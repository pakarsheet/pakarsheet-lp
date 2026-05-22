"use client";

import { AlertCircle, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const next = searchParams.get("next") || "/admin";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Password salah atau sesi tidak bisa dibuat.");
        return;
      }

      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-black font-black text-lg">
            P
          </div>
          <span className="font-bold text-white text-lg">Pakarsheet Admin</span>
        </div>

        <form onSubmit={submit} className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-8 md:p-10">
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Lock size={22} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Masuk ke Dashboard</h1>
          <p className="text-base text-neutral-500 mb-8">
            Masukkan password admin untuk melanjutkan.
          </p>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-base text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
            autoComplete="current-password"
            autoFocus
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 mt-4">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full bg-white text-black text-base font-bold py-4 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}
