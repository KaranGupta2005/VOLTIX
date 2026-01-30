"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmail, resendOTP } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: emailFromQuery,
    otp: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.otp) {
      setError("Please enter both email and OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyEmail(formData.email, formData.otp);

      if (response.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login"); // Redirect to login after verification
        }, 2000);
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await resendOTP(formData.email, "email_verification");
      if (response.success) {
        setSuccess(
          "New OTP sent! Check your email (or server console in dev mode)",
        );
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP");
      console.error("Resend error:", err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      {/* Back Button */}
      <Link
        href="/SignUp"
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP sent to your email
            {process.env.NODE_ENV === "development" && (
              <span className="block mt-2 text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                💡 Dev mode: Check the backend terminal/console for the OTP code
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code (OTP)</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={formData.otp}
                onChange={(e) => handleChange("otp", e.target.value)}
                required
                disabled={loading}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                {resending
                  ? "Sending..."
                  : "Didn't receive the code? Resend OTP"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
