export class AlertEngineService {
  public getActiveAlerts() {
    return [
      {
        id: "alt-01",
        title: "Critical Hotspot Spike: Indiranagar",
        message: "Property theft incidents surpassed +45% threshold in Sector 3.",
        type: "critical",
        timestamp: "10 mins ago",
        district: "Bengaluru Urban",
      },
      {
        id: "alt-02",
        title: "New Accused Network Link Discovered",
        message: "Graph engine linked Suspect #A-901 to Canara Bank Mule A/C 948102841.",
        type: "warning",
        timestamp: "35 mins ago",
        district: "Bengaluru Urban",
      },
      {
        id: "alt-03",
        title: "Judicial Chargesheet Submitted",
        message: "Inspector V. Patil submitted 120-page chargesheet for FIR-2026-00491.",
        type: "info",
        timestamp: "2 hours ago",
        district: "Bengaluru Urban",
      },
    ];
  }
}
