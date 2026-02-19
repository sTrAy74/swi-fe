"use client";

import { useAuth } from "../providers/AuthProvider";
import ProviderProfileEdit from "./ProviderProfileEdit";
import CustomerProfileView from "./CustomerProfileView";

export default function ProfileContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-center text-black/70">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (user.role === "provider") {
    return <ProviderProfileEdit />;
  }

  return <CustomerProfileView />;
}

