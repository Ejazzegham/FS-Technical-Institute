export const metadata = { title: "Privacy Policy | FSTI" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: 21 November 2026</p>

      <p className="mb-4">
        This policy explains how Furqan Saeed Technical Institute (&ldquo;FSTI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects and uses information through the FSTI mobile app (package <code>com.fsti.app</code>) and our website
        https://fs-technical-institute.vercel.app.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information we collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><b>Account &amp; registration data:</b> full name, father&rsquo;s name, email address, password (stored by Firebase Authentication, never visible to us), mobile number, CNIC / B-Form number, address, enrollment number.</li>
        <li><b>Admission details:</b> selected course, batch, qualification, religion and blood group (optional fields).</li>
        <li><b>Files you upload:</b> passport-size photograph / profile picture and qualification or CNIC document copy.</li>
        <li><b>Messages:</b> details you send through the Contact form, and your email if you subscribe to the newsletter.</li>
        <li><b>Student records created by the institute:</b> attendance, fee status, live-class and certificate information linked to your account.</li>
      </ul>
      <p className="mt-3">We do not collect your precise location, contacts, microphone/camera recordings, or advertising ID, and we do not show ads.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. How we use it</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>To create and manage your student account and process admissions.</li>
        <li>To show your attendance, fees, classes, lectures, notifications and certificates.</li>
        <li>To verify certificates issued by FSTI.</li>
        <li>To respond to your enquiries and send institute updates.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Permissions</h2>
      <p>The app asks for access to your photo library only when you choose to upload or change a photograph, and to files only when you attach a document. Nothing is accessed in the background.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Sharing and service providers</h2>
      <p>We do not sell your data. We use trusted providers to run the service: Google Firebase (authentication and database), Cloudflare R2 (file storage) and Vercel (website hosting). They process data only on our behalf. We may disclose information if required by law.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Security &amp; retention</h2>
      <p>Data is transmitted over HTTPS. We keep student records for as long as needed for your enrollment, certification and legal/accounting obligations, then delete or anonymise them.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your rights &amp; account deletion</h2>
      <p>You can view and update your details in the app profile, and request deletion of your account and data at any time via{" "}
        <a className="text-blue-600 underline" href="/delete-account">/delete-account</a> or by emailing fstechins@gmail.com.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Children</h2>
      <p>The app is intended for users aged 18 and over (or students enrolled with parent/guardian consent). We do not knowingly collect data from children without such consent.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes</h2>
      <p>We may update this policy; the date above will change when we do.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact</h2>
      <p>Furqan Saeed Technical Institute, Furqan Saeed Printing Press, Nankana Road, Shahkot, Punjab, Pakistan<br />
        Email: fstechins@gmail.com &middot; Phone: +92 300 7640392</p>
    </main>
  );
}
