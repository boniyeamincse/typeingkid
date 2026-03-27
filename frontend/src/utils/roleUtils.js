const ROLE = {
  USER: 'USER',
  EDUCATOR: 'EDUCATOR',
  ADMIN: 'ADMIN',
};

export const hasRequiredRole = (role, allowedRoles = []) => {
  if (!role) return false;
  if (!allowedRoles.length) return true;
  return allowedRoles.includes(role);
};

export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case ROLE.ADMIN:
      return '/admin';
    case ROLE.EDUCATOR:
      return '/educator';
    case ROLE.USER:
    default:
      return '/dashboard';
  }
};

export { ROLE };
