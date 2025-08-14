import React, { useState } from 'react';

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      onSignup(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-sm mx-auto p-6 bg-white rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-800">Sign Up</h2>
      <input type="email" className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
    </form>
  );
}
