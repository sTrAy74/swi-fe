'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileContent from '@/components/dashboard/ProfileContent';

export default function DashboardProfilePage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile</h1>
        <ProfileContent />
      </div>
    </DashboardLayout>
  );
}

