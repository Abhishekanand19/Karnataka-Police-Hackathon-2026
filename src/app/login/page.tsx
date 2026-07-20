"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, KeyRound, Lock, UserCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl pointer-events-none -bottom-40 -right-40" />

      <div className="w-full max-w-md bg-card border border-border rounded-dialog shadow-2xl p-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/20 border border-primary/40 text-primary mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            CrimeLens<span className="text-primary">.AI</span>
          </h1>
          <p className="text-xs text-gray-400">
            Karnataka State Police • Crime Intelligence Command Portal
          </p>
        </div>

        {/* Form Placeholder */}
        <div className="space-y-4">
          <Input label="Officer Service ID / KGID" placeholder="e.g. KSP-894102" icon={<UserCheck className="w-4 h-4" />} />
          <Input label="Password" type="password" placeholder="••••••••••••" icon={<Lock className="w-4 h-4" />} />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-border bg-surface text-primary focus:ring-primary/50" />
              <span>Remember session</span>
            </label>
            <span className="text-primary hover:underline cursor-pointer">Catalyst SSO help</span>
          </div>

          <Link href="/" className="block">
            <Button variant="primary" size="lg" fullWidth icon={<KeyRound className="w-4 h-4" />}>
              Authenticate Officer Credentials
            </Button>
          </Link>
        </div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-border/50 text-center text-[11px] text-gray-500 space-y-1 font-mono">
          <div>Protected by Catalyst Authentication & Audit Logging</div>
          <div>Unauthorized access is prohibited by KSP Cyber Security Act</div>
        </div>
      </div>
    </div>
  );
}
