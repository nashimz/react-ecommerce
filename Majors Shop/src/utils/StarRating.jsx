import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StarRating({ rating }) {
  const totalStars = 5;
  const safeRating = Number(rating) || 0; // fallback if undefined/null

  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <FontAwesomeIcon
            icon={faStar}
            key={index}
            className={
              starValue <= Math.round(safeRating)
                ? "text-rating"
                : "text-gray-300"
            }
          />
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}
