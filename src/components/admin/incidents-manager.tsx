"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Globe,
  Lock,
  MessageSquare,
  Radio,
} from "lucide-react";

interface Incident {
  id: string;
  reference: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  detectedAt: string;
  actorIp: string;
  target: string;
  correlationId: string;
  internalNotes: string;
}

export function IncidentsManager() {
  const initialIncidents: Incident[] = [
    {
      id: "inc_01",
      reference: "INC-2026-001",
      title: "Multiple Denied OAuth Initiation Attempts",
      severity: "LOW",
      status: "RESOLVED",
      detectedAt: "2026-10-02T14:22:00Z",
      actorIp: "103.24.18.92 (Cloudflare Edge)",
      target: "/api/auth/sign-in/google",
      correlationId: "corr_9f81a7b",
      internalNotes: "Non-allowlisted student email attempted login. Rejection confirmed by validateUserInfo invariant.",
    },
    {
      id: "inc_02",
      reference: "INC-2026-002",
      title: "Elevated Request Velocity on Event Registration",
      severity: "MEDIUM",
      status: "RESOLVED",
      detectedAt: "2026-10-03T09:10:00Z",
      actorIp: "14.139.207.2 (Campus Network)",
      target: "/events/hack-a-bit",
      correlationId: "corr_c24b91d",
      internalNotes: "Traffic surge during Hack-A-Bit registration launch. Edge rate limit held steady.",
    },
  ];

  const [incidents, setIncidents] = React.useState<Incident[]>(initialIncidents);
  const [selectedIncident, setSelectedIncident] = React.useState<Incident | null>(null);
  const [noteInput, setNoteInput] = React.useState("");

  const handleUpdateStatus = (id: string, newStatus: Incident["status"]) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }
  };

  const handleSaveNote = (id: string) => {
    if (!noteInput.trim()) return;
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              internalNotes: inc.internalNotes
                ? `${inc.internalNotes}\n[${new Date().toLocaleTimeString()}]: ${noteInput.trim()}`
                : noteInput.trim(),
            }
          : inc
      )
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({
        ...selectedIncident,
        internalNotes: selectedIncident.internalNotes
          ? `${selectedIncident.internalNotes}\n[${new Date().toLocaleTimeString()}]: ${noteInput.trim()}`
          : noteInput.trim(),
      });
    }
    setNoteInput("");
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/security"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Security</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span>Security Incident Center</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Correlated threat analysis, anomalous authorization telemetry, and internal audit notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
            <span>Zero Open Breaches</span>
          </span>
        </div>
      </div>

      {/* Incident List & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Recorded Threat Incidents ({incidents.length})
            </h3>
            <span className="text-xs text-zinc-500">Grouped by Correlation ID</span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedIncident(inc);
                  setNoteInput("");
                }}
                className={`p-5 rounded-xl border bg-zinc-950/60 hover:border-zinc-700 transition-all cursor-pointer space-y-3 ${
                  selectedIncident?.id === inc.id
                    ? "border-red-800/80 bg-zinc-900/40"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#E31B23]">
                        #{inc.reference}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          inc.severity === "CRITICAL"
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : inc.severity === "HIGH"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                        {inc.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  </div>

                  <span className="text-[11px] text-zinc-500 shrink-0">
                    {new Date(inc.detectedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">IP: {inc.actorIp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">Correlation: {inc.correlationId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Investigation Drawer (1 Col) */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Incident Investigation Drawer
          </h3>

          {selectedIncident ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4 text-xs">
              <div className="border-b border-zinc-800 pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {selectedIncident.reference}
                  </span>
                  <select
                    value={selectedIncident.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedIncident.id,
                        e.target.value as Incident["status"]
                      )
                    }
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
                <div className="text-zinc-400 font-semibold">{selectedIncident.title}</div>
              </div>

              <div className="space-y-2 text-zinc-400">
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="text-zinc-200">{selectedIncident.target}</span>
                </div>
                <div className="flex justify-between">
                  <span>Source IP:</span>
                  <span className="text-zinc-200">{selectedIncident.actorIp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Correlation:</span>
                  <span className="text-zinc-200">{selectedIncident.correlationId}</span>
                </div>
              </div>

              {/* Internal Notes Section (Section 150) */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                  <MessageSquare className="h-3.5 w-3.5 text-[#E31B23]" />
                  <span>Internal Governance Notes (Private)</span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 whitespace-pre-wrap text-[11px] leading-relaxed max-h-40 overflow-y-auto">
                  {selectedIncident.internalNotes || "No notes added yet."}
                </div>

                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    placeholder="Add an internal investigation note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 text-xs"
                  />
                  <button
                    onClick={() => handleSaveNote(selectedIncident.id)}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
                  >
                    Append Internal Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-8 text-center text-xs text-zinc-500">
              Select an incident from the list to view correlated telemetry and add investigation notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
