function ListOfProducts({ products }) {
  return (
    <section>
      <ul className="grid grid-cols-3 gap-4 font-titles mt-4 mb-4">
        {products.map((product) => (
          <li
            className="text-start font-titles shadow-[var(--shadow-card)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-1 p-4 bg-white rounded-md "
            key={product.id}
          >
            <img
              className="max-w-[30vh]  rounded-md mt-4   "
              src={product.images[0]}
              alt={product.name}
            />

            <h2 className="max-w-[30vh] pt-2 font-bold border-t border-gray-300   ">
              {product.brand}
            </h2>
            <h3 className="max-w-[30vh]   ">{product.title}</h3>
            <p className="font-bold  ">${product.price}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NoProductsResults() {
  return <p>No products found</p>;
}

export default function Products({ products }) {
  const hasProducts = products?.length > 0;
  return hasProducts ? (
    <ListOfProducts products={products} />
  ) : (
    <NoProductsResults />
  );
}
