import { DataImportPipeline } from "../dataset/pipeline";

export class TimelineEngineService {
  private pipeline = DataImportPipeline.getInstance();

  public getCaseTimeline(caseId: string = "FIR-2026-00491") {
    const firs = this.pipeline.getFIRs();
    const fir = firs.find((f) => f.id === caseId) || firs[0];

    return {
      caseId: fir.id,
      title: `${fir.crimeCategory} Case Timeline Replay`,
      district: fir.districtName,
      policeStation: fir.policeStationName,
      leadOfficer: "Inspector V. Patil",
      events: [
        { stepNumber: 1, date: "14 Jan 2026", time: "10:15 IST", title: "Complaint Filed", officer: "Constable R. Gowda", location: fir.policeStationName, summary: "Initial theft report filed by victim." },
        { stepNumber: 2, date: "14 Jan 2026", time: "14:30 IST", title: `FIR Registered (${fir.id})`, officer: "Inspector V. Patil", location: fir.policeStationName, summary: "Official FIR registered under Section 420 & IPC 379." },
        { stepNumber: 3, date: "15 Jan 2026", time: "11:00 IST", title: "Victim Statement Recorded", officer: "Sub-Inspector M. Nayak", location: fir.policeStationName, summary: "Statement recorded regarding phone phishing call." },
        { stepNumber: 4, date: "16 Jan 2026", time: "16:45 IST", title: "Bank Telecommunication Evidence Collected", officer: "Cyber Cell Analyst K. Rao", location: "Cyber Crime Cell", summary: "Call CDR and mule bank account logs extracted." },
        { stepNumber: 5, date: "18 Jan 2026", time: "09:30 IST", title: "Prime Suspect Identified", officer: "Inspector V. Patil", location: fir.districtName, summary: "Graph engine correlates suspect to repeat offender database." },
        { stepNumber: 6, date: "22 Jan 2026", time: "04:30 IST", title: "Arrest Executed", officer: "Special Task Force", location: fir.districtName, summary: "Joint early morning raid captures suspect." },
        { stepNumber: 7, date: "25 Jan 2026", time: "11:30 IST", title: "Judicial Chargesheet Submitted", officer: "Inspector V. Patil", location: "1st ACMM Court", summary: "Audited chargesheet submitted." },
      ],
    };
  }
}
