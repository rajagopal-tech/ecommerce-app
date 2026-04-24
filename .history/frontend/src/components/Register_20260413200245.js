import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../auth.css";

function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

    setMessage(res.data.message);

setTimeout(() => {
  navigate("/");
}, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          {/* ❌ Error message */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Register</button>
          {message && <p className="success-msg">{message}</p>}
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;