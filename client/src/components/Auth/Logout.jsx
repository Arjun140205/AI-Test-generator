import React from 'react';

export default function Logout({ onLogout }) {
  React.useEffect(() => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => onLogout());
  }, [onLogout]);
  return <div className="text-center p-8">Logging out...</div>;
}
