"use client";

export default function SignupSection() {
  return (
    <section
      id="signup"
      className="relative py-24 bg-gradient-to-br from-green-50 via-white to-white/60 backdrop-blur-sm scroll-mt-[4rem] flex items-center justify-center px-6"
    >
      <div className="max-w-2xl w-full text-center space-y-6">
        <h2 className="text-4xl md:text-7xl sharetech text-green-800">
          Jump into organized notes in seconds
        </h2>
        <p className="text-lg md:text-xl font-roboto text-gray-700">
          Sign up today to create your first session. Tag, categorize, and
          navigate all your notes with lightning-fast keyboard shortcuts. Stay
          focused, organized, and never lose an idea again.
        </p>
        <ul className="mx-auto max-w-lg list-disc list-inside text-left text-gray-700 space-y-2">
          <li>
            <span className="font-bold">Quick Setup:</span> Get started with a
            single click and intuitive onboarding.
          </li>
          <li>
            <span className="font-bold">Instant Access:</span> Jump between
            notes with numbers, letters, or tags.
          </li>
          <li>
            <span className="font-bold">Secure & Private:</span> All your data
            stays encrypted and yours alone.
          </li>
        </ul>
        <button
          onClick={() =>
            document.querySelector<HTMLElement>("#signin-modal")?.click()
          }
          className="mt-4 px-20 py-3 bg-gradient-to-r from-green-200/40 to-green-300/40 backdrop-blur-sm text-green-900 roboto text-xl rounded-full shadow-lg hover:from-green-200/60 hover:to-green-300/60 transition cursor-pointer hover:shadow-2xl"
        >
          Sign Up
        </button>
        <p className="mt-4 text-sm text-gray-500">No payment required.</p>
      </div>
    </section>
  );
}
