// 🔹 List of Products Component
import { Link } from "react-router-dom";
import { renderPrice } from "../../utils/priceFormatter.jsx";
import StarRating from "../../utils/StarRating.jsx";
export default function ListOfProducts({ products }) {
  return (
    <article className="flex w-full justify-center">
      <ul
        className="
          grid gap-6 font-figtree pt-4 pb-4
          grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3
          max-w-7xl mx-auto px-4
        "
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="text-start font-figtree shadow-[var(--shadow-card)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.2)] p-4 bg-white rounded-md"
          >
            <Link to={`/products/${product.id}`} className="block py-2">
              <img
                className="w-full max-h-[30vh] object-contain rounded-md mt-4"
                src={product.images[0]}
                alt={product.title}
              />
              <h2 className="pt-2 font-bold border-t border-gray-300 truncate">
                {product.brand}
              </h2>
              <h3 className="truncate">{product.title}</h3>
              <StarRating rating={product.rating} />
            </Link>
            {renderPrice(product)}
          </li>
        ))}
      </ul>
    </article>
  );
}
