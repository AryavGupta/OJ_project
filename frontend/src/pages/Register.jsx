import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post('/auth/register', {
        name,
        username,
        email,
        password
      });
      console.log("Registration successful:", res.data);
      alert("Registration successful!");
      navigate('/login');
      
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong!");
    }
    // to do backend
    console.log("Name:", name);
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
  }
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>

        <input type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} required />

        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />

        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <input type="password" placeholder="Confirm Password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} required />

        <button type="submit">RegisteR</button>

        <p>Already registered? <a href="/login">Click to login</a></p>
          
      </form>
    </div>
  )
}

export default Register;
