"use client";

import React, { useState } from "react";
import { Shield, Lock, User } from "lucide-react";
import { useInvestigation } from "@/providers/investigation-provider";

export default function LoginPage() {
  const [badgeId, setBadgeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useInvestigation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(badgeId, password);
    if (!success) {
      setError("Invalid Badge ID or Password");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05060A] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-surface/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/20 border border-primary/30 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CrimeLens<span className="text-primary">.AI</span></h1>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest text-center">
            Karnataka State Police<br />Intelligence Command
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-semantic-danger/10 border border-semantic-danger/20 text-semantic-danger text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Badge ID</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="e.g. KSP-101"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                className="w-full bg-[#0a0c14] border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0c14] border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            Authenticate & Enter
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400 bg-card/40 border border-border/50 rounded-xl p-3">
          <div className="font-semibold text-gray-300 mb-1">Demo Credentials</div>
          <div className="font-mono text-[11px] text-primary">Badge ID: <span className="text-white">KSP-101</span> | Password: <span className="text-white">any password</span></div>
        </div>

        <div className="mt-4 text-center text-[10px] text-gray-500 font-mono">
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </div>
      </div>
    </div>
  );
}
