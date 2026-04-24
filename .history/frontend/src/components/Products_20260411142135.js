import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // add to cart
  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);

    if (exists) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // check login + fetch products
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      <div className="product-container">
        {products.map(p => (
          <div className="product-card" key={p._id}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <p>{p.description}</p>

            <button onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;