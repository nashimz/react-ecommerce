import withResults from "../../mocks/with-results.json";
export default function Cart() {
  console.log("withResults:", withResults);
  const product = withResults.products[1];
  return (
    <>
      <div className="wrapper mx-auto flex items-start pl-3 gap-12 max-w-[1200px]">
        {/* Cart Section */}
        <section className="cart w-2/3 max-w-5xl mt-4 pt-4 bg-white/90 rounded-md shadow-md">
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
            <div className="flex justify-between items-center w-full px-3">
              <h3 className="font-bold">{product.title}</h3>

              <div className="flex items-center gap-4">
                <p className="font-bold">${product.price}</p>
                <button className="text-sm text-red-500">Remove</button>
              </div>
            </div>
          </article>

          {/* more cart items */}
        </section>

        {/* Summary Section */}
        <section className="summary mt-4 w-1/4 max-w-sm bg-white/90 rounded-md shadow-md self-start ">
          <div className="w-full ">
            <h2 className="font-poppins text-md font-bold py-4 pl-3 border-b border-gray-300/50">
              Summary
            </h2>
            <div className="details py-3 pl-3 pr-3 text-xs flex justify-between">
              <span>Product</span>
              <span className="font-bold">${product.price}</span>
            </div>
          </div>
          {/* summary content here */}
        </section>
      </div>
    </>
  );
}
