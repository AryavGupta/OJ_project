import { useState } from "react";
import API from '../services/api';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/login', {
        email,
        password
      });

      alert(res.data.message);
      console.log("Token:", res.data.token);
      //save token
      localStorage.setItem('token', res.data.token);
      // Redirect or show dashboard
      setUser({ token: res.data.token });
      navigate('/');

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Failed!");
    }
    // console.log("Email:", email);
    // console.log("Password:", password);

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>

        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Login Button</button>

        <p>Not registered yet? <a href="/register">Click to register</a></p>

      </form>
    </div>
  )
}

export default Login;
