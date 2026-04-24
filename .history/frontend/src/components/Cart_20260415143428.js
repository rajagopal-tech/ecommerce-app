import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../cart.css";
function Cart() {
  const {cart , setCart } = useContext(CartContext);

  // ➕ increase qty
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item._id === id
        ? { ...item, qty: (item.qty || 1) + 1 }
        : item
    ));
  };

  // ➖ decrease qty
 const decreaseQty = (id) => {
  setCart(cart
    .map(item =>
      item._id === id
        ? { ...item, qty: item.qty - 1 }
        : item
    )
    .filter(item => item.qty > 0)
  );
};

  // ❌ remove item
  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  // 💰 total
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.qty || 1),
    0
  );
  const handleCheckout = () => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum,item) => sum + item.price * item.qty,0),
      date: new Date().toLocaleString()
    };
    const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem("orders", JSON.stringify)
  setCart([]);
  localStorage.removeItem("cart");
};

  return (
  <div className="cart-container">
  <h2>My Cart</h2>

  {cart.length === 0 ? (
    <p>No items in cart</p>
  ) : (
    <>
      {cart.map((item) => (
        <div key={item._id} className="cart-item">
          
          {/* Left */}
          <div className="cart-details">
            <h4>{item.name}</h4>
            <p>₹{item.price} x {item.qty || 1}</p>
          </div>

          {/* Right */}
          <div className="cart-actions">
            <button className="qty-btn" onClick={() => increaseQty(item._id)}>+</button>
            <button className="qty-btn"  disabled={item.qty === 1}  onClick={() => decreaseQty(item._id)}>-</button>

            <button className="remove-btn" onClick={() => removeItem(item._id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="cart-total">
        <h3>Total: ₹{totalPrice}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </>
  )}
</div>
  );
}

export default Cart;