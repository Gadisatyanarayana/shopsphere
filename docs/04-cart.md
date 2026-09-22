# 04. Shopping Cart & State Synchronization

## Architecture
Cart state is synchronized both in MongoDB for logged-in users and in Redux Toolkit state for instant UI response.

1. **Stock Validation**: Before adding or updating quantity, backend verifies `product.stock >= quantity`.
2. **Subtotal Recalculation**: Server-side pre-save hook recalculates total subtotal:
```javascript
cartSchema.methods.calculateSubtotal = function () {
  this.subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  return this.subtotal;
};
```
