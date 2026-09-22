# 03. Products, Filtering & Search Algorithms

## Product Filtering Mechanics
ShopSphere uses a dynamic Mongoose query building pattern inside `getProducts` controller:

```javascript
const query = {};
if (keyword) query.$text = { $search: keyword };
if (category) query.category = categoryId;
if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
}
```

## Pagination Logic
```javascript
const pageNum = Number(page) || 1;
const limitNum = Number(limit) || 12;
const skip = (pageNum - 1) * limitNum;

const total = await Product.countDocuments(query);
const products = await Product.find(query).skip(skip).limit(limitNum);
```

## Indexes
- MongoDB Text Index on `name`, `description`, `brand`, `tags`.
- Compound index for category lookup.
