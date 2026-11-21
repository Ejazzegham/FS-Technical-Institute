export const metadata = { title: "Terms of Use | FSTI" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: 21 November 2026</p>
      <p className="mb-4">By using the FSTI app or website you agree to these terms.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide accurate information when registering or applying for admission.</li>
        <li>Keep your login details private; you are responsible for activity on your account.</li>
        <li>Course content, logos and materials belong to FSTI and may not be copied or redistributed without permission.</li>
        <li>Admission is subject to the institute&rsquo;s policies; fees and schedules may change.</li>
        <li>We may suspend accounts that misuse the service.</li>
        <li>The service is provided &ldquo;as is&rdquo; and may be updated at any time.</li>
      </ul>
      <p className="mt-6">Contact: fstechins@gmail.com &middot; +92 300 7640392</p>
    </main>
  );
}
