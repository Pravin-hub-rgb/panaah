"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const verifyEmailMutation = api.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setVerificationResult(data);
      setIsVerifying(false);
    },
    onError: (error) => {
      setVerificationResult({
        success: false,
        message: error.message,
      });
      setIsVerifying(false);
    },
  });

  const resendVerificationMutation = api.auth.resendVerification.useMutation({
    onSuccess: (data) => {
      setVerificationResult(data);
    },
    onError: (error) => {
      setVerificationResult({
        success: false,
        message: error.message,
      });
    },
  });

  useEffect(() => {
    if (token && email) {
      verifyEmailMutation.mutate({ token, email });
    } else {
      setVerificationResult({
        success: false,
        message: "Invalid verification link. Please check your email for the correct link.",
      });
      setIsVerifying(false);
    }
  }, [token, email]);

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate({ email });
    }
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 animate-spin text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 6h1m-6 6v1m-6-6H4m15.364 15.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              verificationResult?.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {verificationResult?.success ? (
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {verificationResult?.success ? "Email Verified!" : "Verification Failed"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {verificationResult?.message}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {verificationResult?.success ? (
            <Link
              href="/signin"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
            </Link>
          ) : (
            <div className="space-y-4">
              {email && (
                <button
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendVerificationMutation.isPending ? (
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 6h1m-6 6v1m-6-6H4m15.364 15.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>
              )}
              <Link
                href="/signup"
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back to Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}