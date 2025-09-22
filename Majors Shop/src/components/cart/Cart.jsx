import { useCart } from "../../hooks/useCart";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return <p className="text-center mt-8">Your cart is empty</p>;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="wrapper mx-auto flex items-start pl-3 gap-12 max-w-[1200px]">
      {/* Cart Section */}
      <section className="cart w-2/3 max-w-5xl mt-4 pt-4 bg-white/90 rounded-md shadow-md">
        <div className="w-full border-b border-gray-300/50">
          <h1 className="font-poppins text-xl font-bold py-2 pl-3">
            Productos
          </h1>
        </div>

        {cart.map((product) => (
          <article
            key={product.id}
            className="cart-item flex items-center gap-4 pt-4 pl-3 border-b border-gray-300/50"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-18 mb-2 rounded-sm shrink-0 bg-gray-300/50 "
            />
            <div className="flex justify-between items-center w-full px-3">
              <h3 className="font-bold">{product.title}</h3>

              <div className="flex items-center gap-4">
                <p className="font-bold">${product.price}</p>
                <button className="text-sm text-red-500">Remove</button>
              </div>
            </div>
          </article>
          <article className="cart-item flex items-center gap-4 pt-4 pl-3 border-b border-gray-300/50">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-18 mb-2 rounded-sm shrink-0 bg-gray-300/50 "
            />
            <div className="flex justify-between items-center w-full px-3">
              <h3 className="font-bold">{product.title}</h3>
              <div className="flex items-center gap-4">
                <p className="font-bold">
                  ${product.price} x {product.quantity}
                </p>
                <button
                  className="text-sm text-red-500"
                  onClick={() => removeFromCart(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Summary Section */}
      <section className="summary mt-4 w-1/4 max-w-sm bg-white/90 rounded-md shadow-md self-start">
        <div className="w-full">
          <h2 className="font-poppins text-md font-bold py-4 pl-3 border-b border-gray-300/50">
            Summary
          </h2>
          <div className="details py-3 pl-3 pr-3 text-xs flex justify-between">
            <span>Total</span>
            <span className="font-bold">${total}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
