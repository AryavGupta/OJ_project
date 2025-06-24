import { AuthContext } from "../context/AuthContext";
import { useContext } from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  return (
    <div>
      <h1>Welcome to ONLINE JUDGE!!</h1>

      <button onClick={handleLogout}>Logout</button>
      
    </div>
  )
}

export default Home;