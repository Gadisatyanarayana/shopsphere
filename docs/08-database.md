# 08. MongoDB Database Schema Design

## Collections Overview
- **User**: User credentials, role (`customer`/`admin`), and embedded addresses.
- **Category**: Product categories with unique slugs.
- **Product**: Catalog items referenced to Category ID.
- **Cart**: User 1-to-1 cart document with embedded cart items.
- **Wishlist**: User 1-to-1 wishlist document with referenced product array.
- **Order**: Historical order records with snapshot item details.
- **Review**: Product reviews with compound index `{ product: 1, user: 1 }` preventing duplicate reviews.
- **Coupon**: Voucher codes with expiry dates and usage limits.
