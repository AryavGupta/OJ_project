import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({children}) {
  const {token , user} = useSelector((state) => state.auth);
  return token && user?.userType === 'admin' ? children : <Navigate to='/login' />;

}

export default AdminProtectedRoute;