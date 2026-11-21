export const metadata = { title: "Delete Your Account | FSTI" };

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-4">Request Account &amp; Data Deletion</h1>
      <p className="mb-4">App: <b>FSTI</b> (Furqan Saeed Technical Institute) &mdash; package <code>com.fsti.app</code>.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How to request deletion</h2>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Email <a className="text-blue-600 underline" href="mailto:fstechins@gmail.com?subject=Delete%20my%20FSTI%20account">fstechins@gmail.com</a> from your registered email address, with the subject &ldquo;Delete my FSTI account&rdquo;.</li>
        <li>Include your full name and enrollment number.</li>
        <li>We verify your identity and delete your account within 30 days and confirm by email.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-2">What is deleted</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Your login account, profile (name, contact details, CNIC/B-Form, address, blood group, religion).</li>
        <li>Your uploaded photograph and documents.</li>
        <li>Contact-form messages and newsletter subscription.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">What may be kept</h2>
      <p>Records we must retain for legal, accounting or certificate-verification purposes (e.g. fee receipts, issued certificate number) may be kept for up to 7 years, then deleted.</p>
    </main>
  );
}
