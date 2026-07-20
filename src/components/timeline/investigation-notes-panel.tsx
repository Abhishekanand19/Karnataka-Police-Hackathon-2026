"use client";

import React, { useState } from "react";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Pin, Save, Plus, Check } from "lucide-react";

export interface NoteItem {
  id: string;
  author: string;
  date: string;
  content: string;
  pinned?: boolean;
}

export const InvestigationNotesPanel: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: "note-01",
      author: "Inspector V. Patil",
      date: "19 Jan 2026 14:10 IST",
      content: "Call Data Records correlate suspect presence near HSR Sector 2 at 12:40 PM. Match confirmed.",
      pinned: true,
    },
    {
      id: "note-02",
      author: "Sub-Inspector M. Nayak",
      date: "17 Jan 2026 09:30 IST",
      content: "Canara Bank Branch Manager verified mule account withdrawal logs. Video CCTV requested.",
      pinned: false,
    },
  ]);

  const [newNoteText, setNewNoteText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const next: NoteItem = {
      id: `note-${Date.now()}`,
      author: "Inspector V. Patil",
      date: new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      content: newNoteText,
      pinned: false,
    };
    setNotes([next, ...notes]);
    setNewNoteText("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Panel
      title="Investigator Notes & Observations"
      action={<Badge variant="neutral">{notes.length} Notes Recorded</Badge>}
    >
      <div className="space-y-4 text-xs select-none">
        {/* Add Note Form */}
        <div className="space-y-2">
          <textarea
            rows={2}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Add officer note or case hypothesis..."
            className="w-full bg-surface text-gray-100 border border-border rounded-xl p-3 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-mono">Recorded under Officer ID: KSP-894102</span>
            <Button
              variant="primary"
              size="sm"
              disabled={!newNoteText.trim()}
              icon={saved ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Save className="w-3.5 h-3.5" />}
              onClick={handleAddNote}
            >
              {saved ? "Saved Note" : "Save Note"}
            </Button>
          </div>
        </div>

        {/* Existing Notes List */}
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-surface/60 rounded-xl border border-border space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white flex items-center gap-1">
                  {note.pinned && <Pin className="w-3 h-3 text-accent" />} {note.author}
                </span>
                <span className="font-mono text-gray-400">{note.date}</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};
