'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerCustomer } from '../../../lib/api/auth';
import type { RegisterCustomerPayload } from '../../../types/auth';

export default function ProvidersRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!fullName || !email || !password) {
      setError('Full name, email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const payload: RegisterCustomerPayload = {
        full_name: fullName,
        email,
        password,
        role: 'customer',
        profile: {
          phone_number: phone,
          address,
          city,
          state: stateVal,
          pincode,
        },
      };
      await registerCustomer(payload);
      setSuccess('Registration successful. You can now log in.');
      setTimeout(() => router.push('/providers/login'), 900);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' 
        ? err.message 
        : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Register as Customer</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ravi Kumar"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="9999999999"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="560034"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Koramangala 1st Block"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Bangalore"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            value={stateVal}
            onChange={(e) => setStateVal(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Karnataka"
          />
        </div>

        {error && <div className="sm:col-span-2 text-sm text-red-600">{error}</div>}
        {success && <div className="sm:col-span-2 text-sm text-emerald-700">{success}</div>}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-600 text-white py-2 font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Registering…' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}


