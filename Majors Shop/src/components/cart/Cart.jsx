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
    <div className="wrapper mx-auto flex items-start pl-3 mt-4 gap-12 max-w-[1200px]">
      {/* Cart Section */}
      <section className="cart w-2/3 max-w-5xl mt-4 pt-4 bg-white/90 rounded-md shadow-md font-figtree">
        <div className="w-full border-b border-gray-300/50">
          <h1 className="font-figtree text-xl font-bold py-2 pl-3">Products</h1>
        </div>

        {cart.map((product) => (
          <article
            key={product.id}
            className="cart-item flex items-center gap-4 pt-4 pl-3 border-b border-gray-300/50"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-18 mb-2 rounded-sm shrink-0 bg-gray-300/50"
            />
            <div className="flex justify-between items-center w-full px-3">
              <div className="">
                <h3 className="font-bold ">{product.title}</h3>
                {/* Remove Button */}
                <button
                  className="text-sm text-rating font-bold"
                  onClick={() => handleRemove(product)}
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-md">
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
                    className="w-12 text-center border-x outline-none"
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
                <p className="font-bold">${product.price * product.quantity}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Summary Section */}
      <section className="summary mt-4 w-2/4 max-w-sm bg-white/90 rounded-md shadow-md self-start">
        <div className="w-full">
          <h2 className=" text-md font-bold py-4 pl-3 border-b border-gray-300/50">
            Summary
          </h2>
          <div className="details py-3 pl-3 pr-3 text-sm flex justify-between">
            <span className="font-medium">
              {cart.length > 1 ? "Products" : "Product"}
            </span>

            <span className="font-medium">${total}</span>
          </div>
          <div className="details py-3 pl-3 pr-3 text-sm flex justify-between">
            <span className="font-medium ">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="details py-3 pl-3 pr-3 flex justify-between">
            <span className="font-bold text-md">Total</span>
            <span className="font-bold text-md">${total}</span>
          </div>
          <div className="flex justify-center mb-4 mt-2">
            <button className="rounded-md bg-add-cart text-white font-figtree font-bold w-48 p-2 hover:brightness-90">
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
