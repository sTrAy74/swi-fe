'use client';

import RegisterProviderForm from '@/components/auth/RegisterProviderForm';

export default function ServicesRegisterPage() {
  return (
    <main className="pt-20 bg-white text-black min-h-screen">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="rounded-xl border border-black/10 bg-white p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Register as Service Provider</h1>
          <p className="text-black/70 mb-6">Complete the form below to join our platform and connect with customers.</p>
          <RegisterProviderForm />
        </div>
      </div>
    </main>
  );
}

