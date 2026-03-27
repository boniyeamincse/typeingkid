import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getDefaultRouteForRole, hasRequiredRole } from '../../utils/roleUtils';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRequiredRole(user.role, allowedRoles)) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
