// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const router = useRouter();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      // Handle specific error for unconfirmed email
      if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        setMsg("Please check your email and click the confirmation link before signing in.");
        setShowResend(true);
      } else {
        setMsg(error.message);
        setShowResend(false);
      }
    } else {
      router.push("/habits");
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/habits` },
    });
    if (error) {
      setLoading(false);
      setMsg(error.message);
    }
  }

  async function handleResendConfirmation() {
    if (!email) {
      setMsg("Please enter your email address first.");
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${location.origin}/habits`
      }
    });
    setLoading(false);
    
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Confirmation email sent! Please check your inbox.");
      setShowResend(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-nb-lilac/40">
      <div className="w-full max-w-md bg-nb-pink border-3 border-nb-border shadow-nb-xl p-6">
        <h1 className="text-4xl font-black text-center text-nb-ink mb-2">tst-coaching</h1>
        <p className="text-center text-nb-ink/80 mb-6">Sign in to continue</p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-bold mb-1">your email</span>
            <input
              type="email"
              className="w-full border-3 border-nb-border px-3 py-2 bg-nb-bg shadow-nb-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold mb-1">your password</span>
            <input
              type="password"
              className="w-full border-3 border-nb-border px-3 py-2 bg-nb-bg shadow-nb-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
<div className="mt-4 flex flex-col gap-2">

          <Button type="submit" className="w-full bg-nb-yellow text-nb-ink">
            {loading ? "Signing in..." : "sign in"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-nb-bg"
            onClick={handleGoogle}
          >
            continue with Google
          </Button>
</div>

          {msg && (
            <Card className="mt-4 bg-nb-yellow/20">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-nb-ink text-center">{msg}</p>
                {showResend && (
                  <div className="mt-3 text-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={loading}
                      className="bg-nb-bg"
                    >
                      {loading ? "Sending..." : "Resend confirmation email"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="text-center text-sm mt-2">
            New here?{" "}
            <Link href="/auth" className="underline text-nb-red">
              create an account
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
