"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        window.location.href = "/dashboard";
      }
    };

    checkUser();
  }, []);

  const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://smart-bookmark-app-gamma-seven.vercel.app/dashboard",
    },
  });
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={login}
        className="bg-white text-black px-6 py-3 rounded-xl font-medium"
      >
        Sign in with Google
      </button>
    </div>
  );
}
