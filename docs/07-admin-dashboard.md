# 07. Admin Analytics & MongoDB Aggregation Pipelines

## Aggregation Pipelines
ShopSphere utilizes MongoDB `$aggregate` pipelines for revenue calculations and top product statistics.

### 1. Total Revenue Aggregation
```javascript
const revenueAgg = await Order.aggregate([
  { $match: { paymentStatus: 'completed' } },
  { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
]);
```

### 2. Top Selling Products Aggregation
```javascript
const topProducts = await Order.aggregate([
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.product',
      name: { $first: '$items.name' },
      totalSold: { $sum: '$items.quantity' },
      revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
    }
  },
  { $sort: { totalSold: -1 } },
  { $limit: 5 }
]);
```
