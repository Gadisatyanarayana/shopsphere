# 05. Orders & Backend Price Verification

## Security Directive: Server-Side Total Recalculation
Frontends can be manipulated. Never trust total amounts submitted by the client!

ShopSphere recalculates prices directly from MongoDB database records:
```javascript
for (const item of items) {
  const dbProduct = await Product.findById(item.product);
  const activePrice = dbProduct.discountPrice > 0 ? dbProduct.discountPrice : dbProduct.price;
  recalculatedSubtotal += activePrice * item.quantity;
}
```

## Inventory Stock Reduction
Upon successful order placement, stock is atomically decremented:
```javascript
await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
```
If an order is cancelled, stock is incremented back (`$inc: { stock: item.quantity }`).
