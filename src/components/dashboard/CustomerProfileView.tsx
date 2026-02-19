"use client";

import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { getCustomerProfile } from "../../lib/api/profile";

interface CustomerProfile {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CustomerProfileView() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCustomerProfile();
        setProfile(data);
      } catch {
        if (process.env.NODE_ENV === 'development') {
        }
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-center text-black/70">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black/60 mb-1">Full Name</label>
          <p className="text-black">{profile?.full_name || user?.email || "—"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-1">Email</label>
          <p className="text-black">{user?.email || "—"}</p>
        </div>
        {profile?.phone_number && (
          <div>
            <label className="block text-sm font-medium text-black/60 mb-1">Phone Number</label>
            <p className="text-black">{profile.phone_number}</p>
          </div>
        )}
        {profile?.address && (
          <div>
            <label className="block text-sm font-medium text-black/60 mb-1">Address</label>
            <p className="text-black">{profile.address}</p>
          </div>
        )}
        {profile?.city && (
          <div>
            <label className="block text-sm font-medium text-black/60 mb-1">City</label>
            <p className="text-black">{profile.city}</p>
          </div>
        )}
        {profile?.state && (
          <div>
            <label className="block text-sm font-medium text-black/60 mb-1">State</label>
            <p className="text-black">{profile.state}</p>
          </div>
        )}
        {profile?.pincode && (
          <div>
            <label className="block text-sm font-medium text-black/60 mb-1">Pincode</label>
            <p className="text-black">{profile.pincode}</p>
          </div>
        )}
      </div>
    </div>
  );
}

