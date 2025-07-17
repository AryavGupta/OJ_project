import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-full px-6 py-3 bg-background border-b flex justify-between items-center">
      <h1 onClick={() => navigate("/")}
        className='text-xl font-bold cursor-pointer'>
        Codeon
      </h1>

      <div className='flex items-center gap-4'>
        {user && <p className='text-sm'>👤 {user.username}</p>}
        <ThemeToggle />
        <Button
          variant="outline"
          className="text-foreground border-foreground hover:bg-accent"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Navbar;