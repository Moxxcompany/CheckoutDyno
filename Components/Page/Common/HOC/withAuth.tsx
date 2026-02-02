import React, { ComponentType } from "react";

/**
 * Higher-Order Component for authentication wrapper
 * Wraps components that require authentication
 */
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}

export default withAuth;
