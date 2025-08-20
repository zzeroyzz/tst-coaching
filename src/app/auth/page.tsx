// app/auth/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: `${location.origin}/habits`,
      },
    });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      setIsSuccess(false);
    } else {
      setMsg("Check your email to confirm your account.");
      setIsSuccess(true);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/habits`,
      },
    });
    if (error) {
      setLoading(false);
      setMsg(error.message);
      setIsSuccess(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-nb-lilac/40">
      <div className="w-full max-w-md bg-nb-pink border-3 border-nb-border  shadow-nb-xl p-6">
        <h1 className="text-4xl font-black text-center text-nb-ink mb-2">tst-coaching</h1>
        {!isSuccess && (
          <p className="text-center text-nb-ink/80 mb-6">Create your account</p>
        )}

        {isSuccess ? (
          <Card className="bg-nb-bg">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-bold text-nb-ink mb-2">Account Created!</h2>
              <p className="text-sm font-medium text-nb-ink">{msg}</p>
            </CardContent>
          </Card>
        ) : (
          <>
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-bold mb-1">your name</span>
            <input
              className="w-full shadow-nb-md border-3 border-nb-border px-3 py-2 bg-nb-bg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="gluestick fan"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold mb-1">your email</span>
            <input
              type="email"
              className="w-full shadow-nb-md border-3 border-nb-border px-3 py-2 bg-nb-bg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold mb-1">create password</span>
            <input
              type="password"
              className="w-full shadow-nb-md border-3 border-nb-border px-3 py-2 bg-nb-bg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
<div className="mt-4 flex flex-col gap-2">
          <Button type="submit" className="w-full bg-nb-yellow text-nb-ink">
            {loading ? "Creating..." : "create account"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-nb-bg"
            onClick={handleGoogle}
          >
            sign up with Google
          </Button>
</div>
          <div className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline text-nb-red">
              sign in
            </Link>
          </div>
        </form>
        
        {msg && !isSuccess && (
          <Card className="mt-4 bg-nb-red/20">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-nb-ink text-center">{msg}</p>
            </CardContent>
          </Card>
        )}
        </>
        )}
      </div>
    </main>
  );
}
