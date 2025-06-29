import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '../redux/authSlice';

function Home() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <div>
      <h1>Welcome to ONLINE JUDGE!!</h1>
      {user && <h3>Hello, {user.username}</h3>}
      
      <button onClick={handleLogout}>Logout</button>
      
    </div>
  )
}

export default Home;