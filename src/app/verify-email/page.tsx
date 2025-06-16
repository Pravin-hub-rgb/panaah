import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center mt-12">Loading verification...</p>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
