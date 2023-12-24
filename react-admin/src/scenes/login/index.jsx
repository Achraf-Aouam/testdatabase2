import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   // Fetch session data from server
  //   fetch("http://localhost:5000/session")
  //     .then((res) => res.json())
  //     .then((data) => setUserId(data.userId));
  // }, []);
  // var userId = req.session.userId;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Login logic here
      const body = { email, password };
      console.log(body);
      const response = await fetch("http://localhost:5000/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      //store id in session
      console.log(response.user_id);
      //navigate to dashboard
      window.location = "/dashboard";
    } catch (error) {
      console.error(error.message);
      alert("Email or password is wrong");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Login Page</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Don't have an account yet? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
