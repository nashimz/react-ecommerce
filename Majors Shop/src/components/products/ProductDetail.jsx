import { useParams, Link } from "react-router-dom";
import LoadingButton from "../Loading";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useState } from "react";
import { renderPrice } from "../../utils/priceFormatter";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProductDetail(id);
  const [mainImage, setMainImage] = useState(null);

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

  return (
    <div className="p-6 mt-4 max-w-4xl mx-auto bg-white rounded-md shadow-md">
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
          <p className="text-gray-600 mb-2">{product.brand}</p>
          {renderPrice(product)}
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
