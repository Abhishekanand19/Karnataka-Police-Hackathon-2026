# CrimeLens AI 🚔

> **Karnataka State Police (KSP) Hackathon 2026 Submission**
> 
> *A unified, AI-powered Crime Intelligence & Decision Support Platform designed to eliminate data silos and accelerate investigative workflows.*

---

## 🛑 The Problem: Fragmented Intelligence
Modern police forces face a critical data bottleneck. Investigative records, suspect networks, forensic evidence, and geospatial hotspots are often scattered across isolated Excel sheets, disconnected databases, and paper files. 

When a critical incident occurs, officers waste precious time manually cross-referencing information rather than acting on actionable intelligence.

## 🌟 The Solution: CrimeLens AI
**CrimeLens AI** is a production-ready, centralized investigation platform that replaces fragmented tools with a single unified interface. By establishing an `Active Investigation Context` that persists across the entire system, officers can seamlessly transition from high-level hotspot analysis to deep-dive criminal network graphing without ever losing context of the active case.

---

## 🚀 Core Modules (The 6 Pillars of Intelligence)

### 1. Investigation Command Centre (Dashboard)
A dynamic, real-time command dashboard that automatically pulls KPIs, predictive risk scores, and AI summaries based strictly on the current active FIR. 

### 2. Statewide Operations Map (Spatial Intelligence)
A spatial analytics engine visualizing crime density across Karnataka. Officers can drill down from state-level hotspots to specific district nodes, automatically loading the highest-risk FIRs in that sector.

### 3. Criminal Network Graph (Relationship Engine)
Powered by `Cytoscape.js`, this module visually maps the hidden connections between suspects, victims, vehicles, bank accounts, and phone numbers. It reveals syndicate structures that are impossible to detect in tabular formats.

### 4. Investigation Replay Engine (Timeline)
Reconstructs the complete lifecycle of a crime. Officers can hit "Play" to watch the chronological evolution of the case from initial complaint to physical evidence recovery, augmented with AI insights for every event.

### 5. AI Investigator Copilot (Decision Support)
Not just a generic chatbot. The Copilot is inherently aware of the active investigation, evidence, and suspect profiles. It analyzes raw case facts and provides highly structured, actionable recommendations (e.g., *“Cross-reference seized laptops with Cyber Cell hash database”*).

### 6. Official Intelligence Reports (Document Generation)
A robust document compilation engine that transforms raw database entries into formatted, printable A4 intelligence dossiers. Includes mock digital security features (SHA-256 hashes, watermarks, and QR verification codes).

---

## 🛠️ Technology Stack
- **Frontend Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS (Custom Dark Mode "Command Centre" Aesthetic)
- **Graph Visualization**: Cytoscape.js
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context (`InvestigationProvider` with Session Persistence)

---

## 🚦 Running the Application Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/KSP-Hackathon-2026.git
   cd KSP-Hackathon-2026
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Platform**
   Navigate to `http://localhost:3000` in your browser. 
   *(Use any badge ID from the mock database, e.g., `VP-7842`, to log in).*

---

## 🔍 The "Golden Demo" Workflow
For hackathon judges reviewing this project, we recommend the following end-to-end flow to experience the unified architecture:

1. **Login**: Authenticate as an officer.
2. **Global Search**: Press `Ctrl+K` and search for "Vikram". Select the suspect to instantly load the associated high-risk FIR.
3. **Dashboard**: Observe how the AI summary and recommended actions are tailored to the loaded case.
4. **Network**: Navigate to the Network tab to visualize Vikram's connections to other syndicates.
5. **Timeline**: Navigate to the Timeline tab and press "Play" to watch the investigation unfold.
6. **Reports**: Finally, navigate to Reports, toggle on "AI Analysis" and "Network Data", and generate a printable PDF brief for the Superintendent.

---

## 🔮 Future Scope & Known Limitations
- **Backend Integration**: Currently runs on a sophisticated `MOCK_DB` to guarantee demo stability. Ready to be wired into a PostgreSQL/Catalyst backend via REST APIs.
- **Real-Time WebSockets**: Future iterations will feature live incident streaming from dispatch directly into the Map view.
- **Actual PDF Export**: Currently relies on browser native `window.print()` with CSS `@media print` rules. Can be upgraded to headless puppeteer or SmartBrowz for automated batch generation.

---
*Built with ❤️ for the Karnataka State Police Hackathon 2026.*
