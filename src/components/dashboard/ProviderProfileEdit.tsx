"use client";

import { useState, useEffect } from "react";
import { updateProfile, getProviderProfile } from "../../lib/api/profile";
import { useToast } from "../providers/ToastProvider";
import { getApiErrorMessage } from "../../lib/api/errors";
import FileUpload from "./FileUpload";

const SERVICES = [
  { id: 1, name: "Installation" },
  { id: 6, name: "Consultation" },
  { id: 3, name: "Maintenance" },
];

export default function ProviderProfileEdit() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

  const [coverPhoto, setCoverPhoto] = useState<File[]>([]);
  const [logo, setLogo] = useState<File[]>([]);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProviderProfile();
        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone_number || "");
        setBusinessName(profile.business_name || "");
        setCity(profile.city || "");
        setStateVal(profile.state || "");
        setAddress(profile.address || "");
        setPincode(profile.pincode || "");
        setLatitude(profile.latitude?.toString() || "");
        setLongitude(profile.longitude?.toString() || "");
        setExperienceYears(profile.experience_years?.toString() || "");
        setAbout(profile.about || "");
        const servicesArray = profile.services || [];
        const serviceIds = servicesArray.map((s: unknown) => {
          if (typeof s === 'number') return s;
          if (s && typeof s === 'object' && 'id' in s && typeof s.id === 'number') return s.id;
          return typeof s === 'number' ? s : 0;
        });
        setSelectedServices(serviceIds);
      } catch {
        toast.show("Failed to load profile", "error");
        if (process.env.NODE_ENV === 'development') {
        }
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [toast]);

  function toggleService(serviceId: number) {
    setSelectedServices((prev) => {
      const numericPrev = prev.map(id => typeof id === 'number' ? id : Number(id) || 0).filter(id => id > 0);
      const numericId = typeof serviceId === 'number' ? serviceId : Number(serviceId) || 0;
      
      if (numericPrev.includes(numericId)) {
        return numericPrev.filter((id) => id !== numericId);
      }
      return [...numericPrev, numericId];
    });
  }

  function validateStep1(): boolean {
    if (!fullName || !email || !phone || !businessName || !city || !stateVal || !address || !pincode) {
      setError("Please fill in all required fields.");
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

  function validateStep3(): boolean {
    setError(null);
    return true;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  }

  function handleBack() {
    if (step === 2) {
      setStep(1);
      setError(null);
    } else if (step === 3) {
      setStep(2);
      setError(null);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("business_name", businessName);
      formData.append("city", city);
      formData.append("state", stateVal);
      formData.append("address", address);
      formData.append("pincode", pincode);

      if (step >= 2) {
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("experience_years", experienceYears);
        formData.append("about", about);
        selectedServices
          .filter(id => typeof id === 'number' && !isNaN(id))
          .forEach((serviceId) => {
            formData.append("services", serviceId.toString());
          });
      }

      if (step === 3) {
        if (coverPhoto.length > 0) {
          formData.append("cover_photo", coverPhoto[0]);
        }
        if (logo.length > 0) {
          formData.append("logo", logo[0]);
        }
        if (certifications.length > 0) {
          certifications.forEach((file) => {
            formData.append("certifications", file);
          });
        }
        if (portfolioImages.length > 0) {
          portfolioImages.forEach((file) => {
            formData.append("portfolio_images", file);
          });
        }
      }

      await updateProfile(formData);
      toast.show("Profile updated successfully", "success");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to update profile");
      setError(message);
      toast.show(message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-center text-black/70">
        <p>Loading profile...</p>
      </div>
    );
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
              {step > 2 ? "✓" : "2"}
            </div>
            <span className="ml-2 text-sm font-medium">Details</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 3 ? "bg-emerald-600" : "bg-black/30"}`} />
          <div className={`flex items-center ${step >= 3 ? "text-emerald-600" : "text-black/30"}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? "border-emerald-600 bg-emerald-50" : "border-black/30"}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Uploads</span>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); }}>
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

        {step === 3 && (
          <div className="space-y-6">
            <FileUpload
              label="Cover Photo"
              accept="image/*"
              multiple={false}
              value={coverPhoto}
              onChange={setCoverPhoto}
            />
            <FileUpload
              label="Logo"
              accept="image/*"
              multiple={false}
              value={logo}
              onChange={setLogo}
            />
            <FileUpload
              label="Certifications"
              accept=".pdf,.doc,.docx,image/*"
              multiple={true}
              value={certifications}
              onChange={setCertifications}
            />
            <FileUpload
              label="Portfolio Images"
              accept="image/*"
              multiple={true}
              value={portfolioImages}
              onChange={setPortfolioImages}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        )}

        <div className="mt-6 flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-md border border-black/10 px-3 py-1.5 text-sm text-black hover:bg-black/5"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-md border border-emerald-600 text-emerald-600 px-3 py-1.5 text-sm font-medium hover:bg-emerald-50 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save"}
          </button>
          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-md bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-700"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

