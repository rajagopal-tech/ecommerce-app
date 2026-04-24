import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../products.css";

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]); // ✅ separate
  const navigate = useNavigate();

  // ➕ Add to cart
  const addToCart = (product) => {
    let updatedCart;
    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      );
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }

    setCart(updatedCart);
  };

  // 🔐 Check login + fetch products
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  // 💾 Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [setCart]);

  // 💾 Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      <div className="product-container">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <p>{p.description}</p>

            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
