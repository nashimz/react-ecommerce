import User from "./User.js";
import Cart from "./Cart.js";
import Product from "./Product.js";
import CartItem from "./CartItem.js";

export function configureModelAssociations() {
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
}
