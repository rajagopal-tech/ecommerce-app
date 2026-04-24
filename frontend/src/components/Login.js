import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../auth.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await API.post("/auth/login", form);

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      navigate("/products");
    } catch (err) {
      console.error(err);
      alert(err.message || "Invalid login credentials");
    }
  };


return (
  <div className="auth-container">
    <div className="auth-box">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  </div>
);
}

export default Login;