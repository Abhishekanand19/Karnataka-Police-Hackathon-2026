"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-6">
      <div className="p-4 rounded-full bg-semantic-danger/15 border border-semantic-danger/30 text-semantic-danger">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-lg font-semibold text-gray-200">Intelligence Record Not Found</h2>
        <p className="text-xs text-gray-400">
          The requested route or classification sector does not exist in the CrimeLens AI Command index.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" icon={<Home className="w-4 h-4" />}>
            Return to Command Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
