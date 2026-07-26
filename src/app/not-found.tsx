"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen w-full bg-[#030407] items-center justify-center p-6 text-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-semantic-danger/30 rounded-full animate-ping" />
        <div className="absolute inset-2 border-2 border-semantic-danger/50 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center bg-surface border border-semantic-danger/80 rounded-full shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-12 h-12 text-semantic-danger" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white tracking-tight mb-2">404 - Restricted Sector</h1>
      <p className="text-gray-400 max-w-md mb-8">
        The requested intelligence node could not be located. You may have navigated to an invalid coordinate or lack clearance for this sector.
      </p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-surface hover:bg-surface-hover border border-border rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-primary hover:bg-primary-hover border border-transparent rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Command Centre
        </button>
      </div>
    </div>
  );
}
