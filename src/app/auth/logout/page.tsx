// app/auth/logout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      router.replace("/auth/login");
    })();
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-nb-ink">Signing you out…</div>
    </main>
  );
}
