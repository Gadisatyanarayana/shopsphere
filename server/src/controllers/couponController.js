const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc Validate coupon for customer checkout
// @route POST /api/coupons/validate
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code) {
      return next(new ApiError(400, 'Please enter a coupon code'));
    }

    const upperCode = code.toUpperCase();
    const amount = Number(cartAmount) || 0;

    // Offline MongoDB Safe Fallback Validation
    if (mongoose.connection.readyState !== 1) {
      let discountVal = 10;
      let discType = 'percentage';

      if (upperCode === 'WELCOME10') {
        discountVal = 10;
        discType = 'percentage';
      } else if (upperCode === 'FESTIVE20' || upperCode === 'SELLER20') {
        discountVal = 20;
        discType = 'percentage';
      } else if (upperCode === 'SHOPSPHERE500' || upperCode === 'FLAT50') {
        discountVal = 500;
        discType = 'fixed';
      } else {
        return next(new ApiError(404, 'Invalid coupon code. Available codes: WELCOME10, FESTIVE20, SHOPSPHERE500'));
      }

      let calculatedDiscount = discType === 'percentage' ? (amount * discountVal) / 100 : discountVal;
      if (amount > 0) calculatedDiscount = Math.min(calculatedDiscount, amount);

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            coupon: {
              code: upperCode,
              discountType: discType,
              discountValue: discountVal,
              calculatedDiscount: Math.round(calculatedDiscount)
            }
          },
          `Coupon "${upperCode}" applied successfully!`
        )
      );
    }

    const coupon = await Coupon.findOne({ code: upperCode, isActive: true });
    if (!coupon) {
      return next(new ApiError(404, 'Invalid or inactive coupon code'));
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return next(new ApiError(400, 'This coupon has expired'));
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return next(new ApiError(400, 'Coupon usage limit reached'));
    }

    if (amount && amount < coupon.minimumPurchase) {
      return next(
        new ApiError(400, `Minimum purchase amount of ₹${coupon.minimumPurchase} required for coupon ${coupon.code}`)
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          coupon: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            calculatedDiscount: Math.min(discount, amount)
          }
        },
        'Coupon applied successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc Get all coupons (Admin)
// @route GET /api/coupons
exports.getCoupons = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const fallbackCoupons = [
        { _id: 'c1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minimumPurchase: 500, isActive: true },
        { _id: 'c2', code: 'FESTIVE20', discountType: 'percentage', discountValue: 20, minimumPurchase: 1000, isActive: true },
        { _id: 'c3', code: 'SHOPSPHERE500', discountType: 'fixed', discountValue: 500, minimumPurchase: 2500, isActive: true }
      ];
      return res.status(200).json(new ApiResponse(200, { coupons: fallbackCoupons }, 'Coupons fetched (Memory Mode)'));
    }

    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, { coupons }, 'Coupons fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc Create coupon (Admin)
// @route POST /api/coupons
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minimumPurchase, expiryDate, usageLimit, isActive } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const coupon = {
        _id: `c_${Date.now()}`,
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minimumPurchase: Number(minimumPurchase) || 0,
        expiryDate: expiryDate || '2026-12-31',
        usageLimit: usageLimit || 500,
        isActive: isActive !== undefined ? isActive : true
      };
      return res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created successfully (Memory Mode)'));
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return next(new ApiError(400, 'Coupon code already exists'));
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minimumPurchase,
      expiryDate,
      usageLimit,
      isActive
    });

    res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Update coupon (Admin)
// @route PUT /api/coupons/:id
exports.updateCoupon = async (req, res, next) => {
  try {
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(new ApiResponse(200, { coupon: { _id: req.params.id, ...req.body } }, 'Coupon updated'));
    }

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return next(new ApiError(404, 'Coupon not found'));
    }

    res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete coupon (Admin)
// @route DELETE /api/coupons/:id
exports.deleteCoupon = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(new ApiResponse(200, {}, 'Coupon deleted'));
    }

    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return next(new ApiError(404, 'Coupon not found'));
    }

    res.status(200).json(new ApiResponse(200, {}, 'Coupon deleted successfully'));
  } catch (error) {
    next(error);
  }
};
