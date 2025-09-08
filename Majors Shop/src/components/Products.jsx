function ListOfProducts({ products }) {
  return (
    <section className="flex ">
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
            {product.discountPercentage > 0 ? (
              <>
                <p className="font-bold line-through text-gray-500 text-sm">
                  ${product.price}
                </p>
                <div className="flex gap-2">
                  <p className="font-bold">
                    $
                    {(
                      product.price *
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}
                  </p>
                  <p className="text-success text-sm">
                    {product.discountPercentage}% OFF
                  </p>
                </div>
              </>
            ) : (
              <p className="font-bold">${product.price}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NoProductsResults() {
  return <p className="pt-2 text-xl text-black">No products found</p>;
}

export default function Products({ products, search, filters }) {
  const query = search.trim().toLowerCase();

  const filteredProducts = products.filter((p) => {
    const matchesSearch = `${p.title} ${p.brand}`.toLowerCase().includes(query);

    const matchesCategory =
      filters.category === "all" || p.category === filters.category;

    const matchesBrand = filters.brand === "all" || p.brand === filters.brand;

    const matchesPrice =
      p.price >= filters.minPrice && p.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
  });

  const hasProducts = filteredProducts?.length > 0;

  return hasProducts ? (
    <ListOfProducts products={filteredProducts} />
  ) : (
    <NoProductsResults />
  );
}
