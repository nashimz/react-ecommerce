import User from "./User.js";
import Cart from "./Cart.js";
import Product from "./Product.js";
import CartItem from "./Cart-item.js";
import Address from "./Address.js";
import Order from "./Order.js";
import OrderItem from "./Order-item.js";
import Transaction from "./Transaction.js";

export function configureModelAssociations() {
  // Address associations
  User.hasMany(Address, {
    foreignKey: "userId",
    as: "addresses",
    onDelete: "CASCADE",
  });
  Address.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
  // Cart and CartItem associations
  User.hasOne(Cart, {
    foreignKey: "userId",
    as: "cart",
    onDelete: "CASCADE",
  });

  Cart.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    as: "items",
    onDelete: "CASCADE",
  });

  CartItem.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
  });

  CartItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
  });

  Product.hasMany(CartItem, {
    foreignKey: "productId",
    as: "cartItems",
  });

  User.hasMany(Order, {
    foreignKey: "userId",
    as: "orders",
    onDelete: "SET NULL",
  });

  Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Order.belongsTo(Address, {
    foreignKey: "shippingAddressId",
    as: "shippingAddress",
  });

  Address.hasMany(Order, {
    foreignKey: "shippingAddressId",
    as: "orders",
  });

  Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    as: "items",
    onDelete: "CASCADE",
  });

  OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order ",
  });

  OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product ",
  });

  Product.hasMany(OrderItem, {
    foreignKey: "productId",
    as: "orderItems",
  });

  Order.hasMany(Transaction, {
    foreignKey: "orderId",
    as: "transactions",
    onDelete: "CASCADE",
  });

  Transaction.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
  });
}
