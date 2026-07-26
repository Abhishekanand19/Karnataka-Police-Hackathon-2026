# CrimeLens AI – Data Flow & Sequence Diagrams

This document illustrates the end-to-end data flow and interaction between the Frontend, API Gateway, Backend Services, AI Engine, and the Database.

## 1. High-Level Data Flow

```mermaid
graph TD
    Client[Next.js Client App]
    API_GW[Catalyst API Gateway]
    Auth[Catalyst Auth Service]
    Express[Express.js Backend Server]
    DB[(Catalyst DataStore / PostgreSQL)]
    Stratus[(Catalyst Stratus Object Storage)]
    LLM[QuickML / LLM Provider]
    SmartBrowz[Catalyst SmartBrowz PDF Gen]

    Client -->|HTTPS / JWT| API_GW
    API_GW -->|Token Verification| Auth
    API_GW -->|Routed Request| Express
    Express -->|Prisma Queries| DB
    Express -->|Evidence Upload / Fetch| Stratus
    Express -->|Context + Prompt| LLM
    Express -->|HTML Template| SmartBrowz
    SmartBrowz -->|PDF Binary| Stratus
```

## 2. Sequence Diagram: AI Copilot Query (Zero Hallucination Flow)

This sequence illustrates how a user query is securely intercepted, grounded in factual database context, and verified before being presented to the user.

```mermaid
sequenceDiagram
    participant User as Investigator
    participant UI as Next.js UI
    participant API as Express API
    participant DB as Prisma / DataStore
    participant LLM as QuickML / LLM
    participant Audit as Audit Logger

    User->>UI: Types: "Summarize MO for Suspect A-901"
    UI->>API: POST /api/v1/copilot/query { prompt, context }
    
    rect rgb(200, 220, 240)
        Note right of API: Context Grounding Phase
        API->>DB: Query FIRs & Notes for Suspect A-901
        DB-->>API: Returns Factual JSON Data
    end

    API->>LLM: POST Prompt + Strict Factual Context
    LLM-->>API: Returns LLM Answer text
    
    rect rgb(240, 200, 200)
        Note right of API: Hallucination Verification Phase
        API->>API: Parse entities in LLM Answer
        API->>DB: Verify Entity (A-901) exists in Context
        DB-->>API: Match Confirmed
    end

    API->>API: Inject Citations into Answer
    API->>Audit: Log AI_QUERY Action (Success)
    API-->>UI: Return Verified Answer + Citations
    UI-->>User: Displays Text with interactive citation pills
```

## 3. Sequence Diagram: Network Link Analysis

This sequence illustrates how the Cytoscape.js network graph is populated with multi-hop relational data.

```mermaid
sequenceDiagram
    participant User as Crime Analyst
    participant UI as Next.js Network Tab
    participant API as Express API
    participant DB as Prisma / DataStore

    User->>UI: Selects "Seed Suspect: Rajesh Kumar"
    UI->>API: GET /api/v1/analytics/network?seedId=uuid&depth=2
    
    API->>DB: Query Suspect Node (Depth 0)
    DB-->>API: Suspect Data
    
    API->>DB: Query JOIN FIR_Suspect (Depth 1)
    DB-->>API: Connected FIRs
    
    API->>DB: Query JOIN FIR_Vehicle, FIR_BankAccount (Depth 2)
    DB-->>API: Connected Assets
    
    API->>API: Transform raw joins to Nodes & Edges DTO
    API-->>UI: Return { nodes: [...], edges: [...] }
    
    UI->>UI: Cytoscape.js runs Force-Directed Layout algorithm
    UI-->>User: Renders interactive Graph Visualization
```
