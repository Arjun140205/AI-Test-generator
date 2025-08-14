import React from 'react';

export default function Profile({ user, onLogout }) {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">Profile</h2>
      <div><b>Email:</b> {user.email}</div>
      <button className="btn" onClick={onLogout}>Logout</button>
    </div>
  );
}
