export function renderPrice(product) {
  const { price, discountPercentage } = product;

  if (discountPercentage > 0) {
    const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);

    return (
      <>
        <p className="font-bold line-through text-gray-500 text-sm">${price}</p>
        <div className="flex gap-2">
          <p className="font-bold text-xl">${discountedPrice}</p>
          <p className="text-success text-sm pt-1">{discountPercentage}% OFF</p>
        </div>
      </>
    );
  }

  return <p className="font-bold">${price}</p>;
}
