import { useParams, Link } from "react-router-dom";
import LoadingButton from "../Loading";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useState } from "react";
import { renderPrice } from "../../utils/priceFormatter";
import { useCart } from "../../hooks/useCart";
import { useModal } from "../modal/ModalContext";
import StarRating from "../StarRating";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  console.log("Cart contents:", cart);
  const { product, loading, error } = useProductDetail(id);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { showModal } = useModal();

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingButton />
      </div>
    );

  if (error) return <p className="text-red-500 text-lg">Error: {error}</p>;

  // Initialize mainImage if not set
  if (!mainImage && product.images.length > 0) {
    setMainImage(product.images[0]);
  }
  const maxQuantity = Math.min(product.stock, 10);
  const handleAddCart = (product, quantity) => {
    addToCart(product, quantity);
    showModal(`${product.title} added to cart!`);
  };
  return (
    <div className="p-6 mt-4 max-w-4xl mx-auto bg-white rounded-md shadow-md font-figtree">
      <div className="flex gap-6">
        {/* LEFT: Thumbnails */}
        <div className="flex flex-col gap-2">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.title} thumbnail ${idx + 1}`}
              className={`w-14 h-14 object-cover rounded-md border cursor-pointer ${
                img === mainImage ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        <img
          src={mainImage}
          alt={product.title}
          className="w-1/2 rounded-md bg-gray-100"
        />

        <div className="flex-1 border border-gray-200 p-4 rounded-lg">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <StarRating rating={product.rating} />
          <p className="text-gray-600 mb-2">{product.brand}</p>
          {renderPrice(product)}
          <p className="mt-3 font-figtree">{product.description}</p>
          <div className="[&_p]:font-bold mt-3">
            {product.stock === 0 ? (
              <p className="text-red-600">Out of Stock</p>
            ) : product.stock === 1 ? (
              <p className="text-orange-500">Only 1 left in stock!</p>
            ) : (
              <p className="text-green-600">Stock Available</p>
            )}
          </div>
          <div className="flex gap-1 items-center pt-2">
            <label htmlFor="quantity" className="font-medium ">
              Quantity:
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className=" p-1 w-18 text-medium border-0 focus:ring-0 bg-transparent"
            >
              {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(
                (num) => (
                  <option className="font-medium " key={num} value={num}>
                    {num} Unit{num > 1 ? "ies" : ""}
                  </option>
                )
              )}
            </select>

            <p className="text-gray-600 font-bold">
              (+{product.stock} Available)
            </p>
          </div>
          <div className="info text-medium-600 pt-3">
            <p className="">{product.warrantyInformation}</p>
            <p className="pt-3">{product.shippingInformation}</p>
          </div>
          <div className="flex justify-center">
            <button
              className="rounded-md bg-add-cart text-white font-figtree font-bold mt-4 w-64 px-4 py-2 py-1 hover:bg-add-cart-300"
              onClick={() => handleAddCart(product, quantity)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
