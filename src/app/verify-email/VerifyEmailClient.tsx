"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function VerifyEmailClient() {
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

  const verifyEmail = useCallback(() => {
    if (token && email) {
      verifyEmailMutation.mutate({ token, email });
    } else {
      setVerificationResult({
        success: false,
        message: "Invalid verification link. Please check your email for the correct link.",
      });
      setIsVerifying(false);
    }
  }, [token, email, verifyEmailMutation]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate({ email });
    }
  };

  if (isVerifying) {
    return <p className="text-center">Verifying your email...</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {verificationResult?.success ? "Email Verified!" : "Verification Failed"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{verificationResult?.message}</p>
        </div>
        <div className="mt-6 space-y-4">
          {verificationResult?.success ? (
            <Link
              href="/signin"
              className="block w-full rounded bg-indigo-600 px-4 py-2 text-white text-center"
            >
              Sign In
            </Link>
          ) : (
            <>
              {email && (
                <button
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                  className="block w-full rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {resendVerificationMutation.isPending
                    ? "Sending..."
                    : "Resend Verification Email"}
                </button>
              )}
              <Link
                href="/signup"
                className="block w-full rounded border px-4 py-2 text-center"
              >
                Back to Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}