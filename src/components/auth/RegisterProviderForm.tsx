"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerProvider } from "../../lib/api/auth";
import type { RegisterProviderPayload } from "../../types/auth";
import { useToast } from "../providers/ToastProvider";
import { useAuth } from "../providers/AuthProvider";
import { getApiErrorMessage } from "../../lib/api/errors";
import { setToken } from "../../lib/auth/token";
import { sanitizeString, isValidEmail, isValidPhone, isValidPincode, validatePassword } from "../../lib/utils/validation";

const SERVICES = [
  { id: 1, name: "Installation" },
  { id: 6, name: "Consultation" },
  { id: 3, name: "Maintenance" },
];

export default function RegisterProviderForm() {
  const router = useRouter();
  const toast = useToast();
  const { setAuth } = useAuth();
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [about, setAbout] = useState("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{ strength: 'weak' | 'medium' | 'strong'; message: string } | null>(null);

  function toggleService(serviceId: number) {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }

  function validateStep1(): boolean {
    if (!fullName || !email || !password || !phone || !businessName || !city || !stateVal || !address || !pincode) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return false;
    }

    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!isValidPincode(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }

    setError(null);
    return true;
  }

  function validateStep2(): boolean {
    if (!latitude || !longitude || !experienceYears || !about || selectedServices.length === 0) {
      setError("Please fill in all required fields and select at least one service.");
      return false;
    }
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Please enter valid latitude (-90 to 90) and longitude (-180 to 180).");
      return false;
    }
    setError(null);
    return true;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  }

  function handleBack() {
    if (step === 2) {
      setStep(1);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const payload: RegisterProviderPayload = {
        full_name: sanitizeString(fullName),
        email: email.trim().toLowerCase(),
        password,
        role: "provider",
        profile: {
          phone_number: phone.replace(/\D/g, ''),
          business_name: sanitizeString(businessName),
          address: sanitizeString(address),
          city: sanitizeString(city),
          state: sanitizeString(stateVal),
          pincode: pincode.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          experience_years: parseInt(experienceYears),
          about: sanitizeString(about),
          services: selectedServices,
        },
      };
      const res = await registerProvider(payload);
      if (res?.jwt) {
        setToken(res.jwt);
        setAuth({ token: res.jwt, user: res.user });
      }
      toast.show("Registered and logged in successfully", "success");
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
    <div className="text-black">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`flex items-center ${step >= 1 ? "text-emerald-600" : "text-black/30"}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? "border-emerald-600 bg-emerald-50" : "border-black/30"}`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span className="ml-2 text-sm font-medium">Basic Info</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? "bg-emerald-600" : "bg-black/30"}`} />
          <div className={`flex items-center ${step >= 2 ? "text-emerald-600" : "text-black/30"}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? "border-emerald-600 bg-emerald-50" : "border-black/30"}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Details</span>
          </div>
        </div>
      </div>

      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="Solar Bright Pvt Ltd"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="solar@bright.com"
                required
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
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
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
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="9876543210"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="Solar Bright Pvt Ltd"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="Bangalore"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="Karnataka"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="MG Road"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="560001"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                  placeholder="12.9716"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                  placeholder="77.5946"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Years</label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40"
                placeholder="Experienced rooftop solar installer with 5+ years of experience."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Services Offered</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      selectedServices.includes(service.id)
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-white border-black/10 text-black hover:bg-black/5"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
              {selectedServices.length === 0 && (
                <p className="mt-1 text-sm text-black/60">Select at least one service</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600" role="alert" aria-live="polite">{error}</div>
        )}

        <div className="mt-6 flex gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-md border border-black/10 px-4 py-2 text-black hover:bg-black/5"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-md bg-emerald-600 text-white py-2 font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Registering…" : step === 1 ? "Next" : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

