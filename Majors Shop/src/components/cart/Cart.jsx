import withResults from "../../mocks/with-results.json";
export default function Cart() {
  console.log("withResults:", withResults);
  const product = withResults.products[1];
  return (
    <>
      <div className="wrapper mx-auto flex items-start pl-3 gap-12">
        {/* Cart Section */}
        <section className="cart w-2/3 max-w-4xl mt-4 pt-4 bg-white/90 rounded-md shadow-md">
          <div className="w-full border-b border-gray-300/50">
            <h1 className="font-poppins text-xl font-bold py-2 pl-3">
              Productos
            </h1>
          </div>

          <article className="cart-item flex items-center gap-4 pt-4 pl-3 border-b border-gray-300/50">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-24 shrink-0 bg-gray-300/50 rounded-full"
            />
            <div className="flex gap-1">
              <h3 className="font-bold">{product.title}</h3>
              <p>${product.price}</p>
              <button className="text-sm text-red-500">Remove</button>
            </div>
          </article>
          <article className="cart-item flex items-center gap-4 pt-4 pl-3 border-b border-gray-300/50">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-24 shrink-0 bg-gray-300/50 rounded-full"
            />
            <div className="flex gap-1">
              <h3 className="font-bold">{product.title}</h3>
              <p>${product.price}</p>
              <button className="text-sm text-red-500">Remove</button>
            </div>
          </article>

          {/* more cart items */}
        </section>

        {/* Summary Section */}
        <section className="summary mt-4 w-1/3 max-w-sm bg-white/90 rounded-md shadow-md self-start">
          <div className="w-full border-b border-gray-300/50">
            <h1 className="font-poppins text-xl font-bold py-2 pl-3">
              Summary
            </h1>
          </div>
          {/* summary content here */}
        </section>
      </div>
    </>
  );
}
