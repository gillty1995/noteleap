"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Modal from "./ModalWithForm";

// placeholder Google SVG icon
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 533.5 544.3"
    >
      <path
        fill="#4285f4"
        d="M533.5 278.4c0-17.7-1.6-35-4.7-51.8H272v98h146.9c-6.4 34.5-25.3 63.7-54 83.2v68h87.3c51.2-47 80.3-116.5 80.3-197.4z"
      />
      <path
        fill="#34a853"
        d="M272 544.3c73.2 0 134.6-24.3 179.4-66.1l-87.3-68c-24.2 16.3-55.2 26-92.1 26-70.6 0-130.5-47.7-152-112.5h-90.6v70.6C82.6 486.6 170.3 544.3 272 544.3z"
      />
      <path
        fill="#fbbc04"
        d="M120 325.6c-5.6-16.3-8.8-33.8-8.8-51.6s3.2-35.3 8.8-51.6v-70.6h-90.6C5 212.3 0 242.6 0 273.9s5 61.6 29.4 121.5l90.6-70.6z"
      />
      <path
        fill="#ea4335"
        d="M272 109.7c39.5 0 75.1 13.6 103 40.4l77.1-77.1C405.9 24.4 343.4 0 272 0 170.3 0 82.6 57.7 29.4 143.3l90.6 70.6C141.5 157.4 201.4 109.7 272 109.7z"
      />
    </svg>
  );
}

export default function SignInModal({
  isOpen,
  onClose,
  onSignUp,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", {
      email,
      password,
      callbackUrl: "/note-ui",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-sm mx-auto bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl sharetech font-bold mb-4 text-center tracking-widest">
          Sign In
        </h2>
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            disabled={isLoading}
            type="submit"
            className="w-full px-4 py-2 bg-green-200/40 backdrop-blur-sm text-green-900 sharetech text-xl rounded-full cursor-pointer hover:shadow-sm hover:text-green-600 hover:scale-102 transition ease-in-out duration-100"
          >
            {isLoading ? "Signing in…" : "Submit"}
          </button>
        </form>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <GoogleIcon className="h-6 w-6" />
          <button
            onClick={() =>
              signIn("auth0", { callbackUrl: "/note-ui", screen_hint: "login" })
            }
            className="text-green-800 font-medium cursor-pointer hover:text-shadow-2xs"
          >
            Continue with Google
          </button>
        </div>
        <p className="mt-4 text-center text-sm">
          or{" "}
          <button
            onClick={onSignUp}
            className="text-green-700 underline cursor-pointer hover:animate-pulse hover:text-green-800"
          >
            Sign Up
          </button>
        </p>
      </div>
    </Modal>
  );
}
