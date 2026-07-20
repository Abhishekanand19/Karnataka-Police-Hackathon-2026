"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Database, Cloud, Key, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System & Operational Configuration"
        description="Manage Zoho Catalyst integrations, API service credentials, role-based security access, and audit parameters."
        badge={<Badge variant="neutral">System Admin</Badge>}
        actions={
          <Button variant="primary" icon={<Save className="w-4 h-4" />}>
            Save Configuration
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Zoho Catalyst Platform Connections">
          <div className="space-y-4 text-xs">
            <Input label="Catalyst Project ID" defaultValue="KSP-CRIMELENS-2026" />
            <Input label="Catalyst Data Store Segment" defaultValue="KSP_PROD_DATASTORE_V1" />
            <Input label="SmartBrowz API Endpoint" defaultValue="https://smartbrowz.catalyst.zoho.com/api/v1/pdf" />
          </div>
        </Panel>

        <Panel title="Security & Officer Privileges">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <div>
                <div className="font-semibold text-white">Current Active Officer</div>
                <div className="text-gray-400">Inspector V. Patil (SCRB Unit)</div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <div>
                <div className="font-semibold text-white">Role Privileges</div>
                <div className="text-gray-400">Full Investigator & Audit Dossier Access</div>
              </div>
              <Badge variant="info">Level 3</Badge>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
