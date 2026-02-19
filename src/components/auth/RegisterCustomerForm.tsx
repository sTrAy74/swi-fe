"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, registerCustomer } from "../../lib/api/auth";
import type { RegisterCustomerPayload } from "../../types/auth";
import { useToast } from "../providers/ToastProvider";
import { useAuth } from "../providers/AuthProvider";
import { getApiErrorMessage } from "../../lib/api/errors";
import { sanitizeString, isValidEmail, isValidPhone, isValidPincode, validatePassword } from "../../lib/utils/validation";

export default function RegisterCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const { setAuth } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{ strength: 'weak' | 'medium' | 'strong'; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!fullName || !email || !password) {
      setError("Full name, email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (phone && !isValidPhone(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (pincode && !isValidPincode(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterCustomerPayload = {
        full_name: sanitizeString(fullName),
        email: email.trim().toLowerCase(),
        password,
        role: 'customer',
        profile: {
          phone_number: phone ? phone.replace(/\D/g, '') : '',
          address: address ? sanitizeString(address) : '',
          city: city ? sanitizeString(city) : '',
          state: stateVal ? sanitizeString(stateVal) : '',
          pincode: pincode ? pincode.trim() : '',
        },
      };
      await registerCustomer(payload);
      const res = await login({ identifier: email, password });
      setAuth({ token: res.jwt, user: res.user });
      toast.show("Registered and logged in successfully", "success");
      onSuccess?.();
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Registration failed");
      setError(message);
      toast.show(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
      <div className="sm:col-span-2">
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="Ravi Kumar"
          required
          aria-required="true"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="you@example.com"
          required
          aria-required="true"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value) {
              const validation = validatePassword(e.target.value);
              setPasswordStrength({ strength: validation.strength, message: validation.message });
            } else {
              setPasswordStrength(null);
            }
          }}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="••••••"
          required
          aria-describedby={passwordStrength ? "password-strength" : undefined}
        />
        {passwordStrength && (
          <div id="password-strength" className="mt-1">
            <div className={`text-xs ${
              passwordStrength.strength === 'strong' ? 'text-emerald-600' :
              passwordStrength.strength === 'medium' ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {passwordStrength.message}
            </div>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="9999999999"
          maxLength={10}
          pattern="[0-9]{10}"
        />
      </div>
      <div>
        <label htmlFor="pincode" className="block text-sm font-medium mb-1">Pincode</label>
        <input
          id="pincode"
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="560034"
          maxLength={6}
          pattern="[0-9]{6}"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
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
      {error && <div className="sm:col-span-2 text-sm text-red-600" role="alert" aria-live="polite">{error}</div>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-600 text-white py-2 sm:py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-60"
          aria-busy={loading}
        >
          {loading ? "Registering…" : "Register"}
        </button>
      </div>
    </form>
  );
}


