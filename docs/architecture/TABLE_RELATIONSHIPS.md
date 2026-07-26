# CrimeLens AI – Table Relationships Map

This document exhaustively details the Primary Key (PK) to Foreign Key (FK) joins governing the Enterprise Database Schema.

## 1. 1:N (One-to-Many) Relationships

| Primary Entity (1) | Foreign Entity (N) | Join Key | Cascade Rule | Description |
| :--- | :--- | :--- | :--- | :--- |
| **State** | **Range** | `stateId` | Restrict | A State contains multiple Ranges. |
| **Range** | **Commissionerate** | `rangeId` | Restrict | A Range contains multiple Commissionerates. |
| **Commissionerate** | **District** | `commissionerateId` | Restrict | A Commissionerate contains multiple Districts. |
| **District** | **SubDivision** | `districtId` | Restrict | A District contains multiple SubDivisions. |
| **SubDivision** | **Circle** | `subDivisionId` | Restrict | A SubDivision contains multiple Circles. |
| **Circle** | **PoliceStation** | `circleId` | Restrict | A Circle contains multiple Police Stations. |
| **PoliceStation** | **Beat** | `policeStationId` | Restrict | A Station has multiple patrol Beats. |
| **PoliceStation** | **User** | `policeStationId` | Set Null | A Station employs multiple Officers. |
| **PoliceStation** | **FIR** | `policeStationId` | Restrict | A Station registers multiple FIRs. |
| **Beat** | **FIR** | `beatId` | Set Null | A Beat bounds multiple FIRs geographically. |
| **CrimeCategory** | **SubCrimeCategory** | `categoryId` | Restrict | A Category has multiple SubCategories. |
| **CrimeCategory** | **FIR** | `categoryId` | Restrict | Multiple FIRs fall under a single Category. |
| **User** | **OfficerAssignmentHistory** | `officerId` | Restrict | An Officer has a history of case assignments. |
| **FIR** | **CaseStatusHistory** | `firId` | Cascade | An FIR has an immutable history of status changes. |
| **FIR** | **Victim** | `firId` | Cascade | An FIR can involve multiple Victims. |
| **FIR** | **Evidence** | `firId` | Cascade | An FIR contains multiple pieces of Evidence. |
| **FIR** | **AIAnalysis** | `firId` | Cascade | An FIR can have multiple AI Insights generated over time. |

## 2. N:M (Many-to-Many) Relationships (via Junction Tables)

The intelligence graph utilizes junction tables to represent complex N:M relationships without rigidly coupling the data.

### 2.1 FIR to Intelligence Entities
A single FIR can involve multiple entities (3 suspects, 1 stolen car, 2 bank accounts). A single entity (a repeat offender or a highly used mule account) can be linked to multiple FIRs across the state.

**Junction Table:** `FIREntityLink`
- `firId` (FK to FIR.id)
- `entityId` (FK to IntelligenceEntity.id)
- `involvementType` (Defines *how* it's involved: "Accused", "Stolen", "Phished")

### 2.2 Intelligence Entity to Intelligence Entity
The Cytoscape.js Network Graph requires knowing how entities relate to *each other* (e.g., Suspect A called Phone B, Phone B was in Vehicle C).

**Junction Table:** `EntityRelationship`
- `sourceEntityId` (FK to IntelligenceEntity.id)
- `targetEntityId` (FK to IntelligenceEntity.id)
- `relationshipType` (e.g., "CALLED", "OWNED_BY", "ASSOCIATED_WITH")
- `confidenceScore` (1-100, crucial for AI-inferred relationships vs Police-verified ones)

## 3. Auditing Relations
- **User** 1:N **AuditLog** (`userId`): If a user is deleted, the FK constraint is `Set Null` rather than `Cascade`. The `AuditLog` MUST persist for legal reasons even if the user record is destroyed.
