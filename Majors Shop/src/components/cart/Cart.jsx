import { useCart } from "../../hooks/useCart";
import { useModal } from "../modal/ModalContext";
import EmptyCart from "./EmptyCart";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { showModal } = useModal();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleRemove = (product) => {
    removeFromCart(product.id);
    showModal(`${product.title} removed from the cart!`);
  };

  const handleQuantityChange = (product, newQty) => {
    if (newQty < 1) return; // prevent going below 1
    updateQuantity(product.id, newQty);
  };

  return (
    <div className="wrapper mx-auto flex flex-col md:flex-row items-start p-2  mt-4 gap-6 md:gap-12 max-w-[1200px]">
      <section className="cart w-full md:w-2/3 max-w-5xl mt-4 pt-4 bg-white/90 rounded-md shadow-md font-figtree">
        <div className="w-full border-b border-gray-300/50">
          <h1 className=" text-xl font-bold py-2 pl-3">Products</h1>
        </div>

        {cart.map((product) => (
          <article
            key={product.id}
            className="cart-item flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 pl-3 pr-3 border-b border-gray-300/50"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-20 h-20 object-cover mb-2 rounded-sm shrink-0 bg-gray-300/50"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-6">
              <div>
                <h3 className="font-bold">{product.title}</h3>
                {/* Remove Button */}
                <button
                  className="text-sm text-rating font-bold"
                  onClick={() => handleRemove(product)}
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-4 pb-2">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-600/40 rounded-md">
                  <button
                    onClick={() =>
                      handleQuantityChange(product, product.quantity - 1)
                    }
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(product, Number(e.target.value))
                    }
                    className="w-12 text-center  outline-none"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(product, product.quantity + 1)
                    }
                    className="px-2 py-1 text-rating hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p className="font-bold">
                  ${(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Summary Section */}
      <section className="summary w-full md:w-1/3 max-w-sm bg-white/90 rounded-md shadow-md self-start m-4 font-figtree">
        <div className="w-full">
          <h2 className="text-md font-bold py-4 pl-3 border-b border-gray-300/50">
            Summary
          </h2>
          <div className="details py-3 px-3 text-sm flex justify-between">
            <span className="font-medium">
              {cart.length > 1 ? "Products" : "Product"}
            </span>
            <span className="font-medium">${total}</span>
          </div>
          <div className="details py-3 px-3 text-sm flex justify-between">
            <span className="font-medium">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="details py-3 px-3 flex justify-between">
            <span className="font-bold text-md">Total</span>
            <span className="font-bold text-md">${total}</span>
          </div>
          <div className="flex justify-center mb-4 mt-2">
            <button className="rounded-md bg-add-cart text-white font-bold w-64 p-2 hover:brightness-90">
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
