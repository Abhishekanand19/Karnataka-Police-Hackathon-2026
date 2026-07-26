# Enterprise ERD: CrimeLens AI

The following Mermaid diagram visually maps the new enterprise schema architecture, depicting the strict 7-level police hierarchy, intelligence abstraction layers, and audit mappings.

```mermaid
erDiagram
    %% POLICE HIERARCHY
    STATE {
        uuid id PK
        varchar name
    }
    RANGE {
        uuid id PK
        varchar name
        uuid stateId FK
    }
    COMMISSIONERATE {
        uuid id PK
        varchar name
        uuid rangeId FK
    }
    DISTRICT {
        uuid id PK
        varchar name
        uuid commissionerateId FK
    }
    SUB_DIVISION {
        uuid id PK
        varchar name
        uuid districtId FK
    }
    CIRCLE {
        uuid id PK
        varchar name
        uuid subDivisionId FK
    }
    POLICE_STATION {
        uuid id PK
        varchar name
        uuid circleId FK
        decimal latitude
        decimal longitude
    }
    BEAT {
        uuid id PK
        varchar name
        uuid policeStationId FK
    }

    %% USERS & AUDIT
    USER {
        uuid id PK
        varchar badgeNumber
        enum role
        uuid policeStationId FK
    }
    AUDIT_LOG {
        uuid id PK
        uuid userId FK
        enum action
        varchar tableName
        varchar recordId
        jsonb oldData
        jsonb newData
        timestamp createdAt
    }

    %% CRIME CATEGORIES
    CRIME_CATEGORY {
        uuid id PK
        varchar name
        enum severity
        varchar nature
        varchar type
    }
    SUB_CRIME_CATEGORY {
        uuid id PK
        uuid categoryId FK
        varchar name
        array ipcBnsSections
    }

    %% CORE FIR
    FIR {
        uuid id PK
        varchar firNumber
        uuid policeStationId FK
        uuid beatId FK
        uuid categoryId FK
        enum status
        timestamp incidentDate
        geometry geom "PostGIS spatial"
        tsvector ts_mo "FTS Index"
    }

    %% HISTORIES
    CASE_STATUS_HISTORY {
        uuid id PK
        uuid firId FK
        enum oldStatus
        enum newStatus
        uuid changedById FK
        timestamp changedAt
    }
    OFFICER_ASSIGNMENT_HISTORY {
        uuid id PK
        uuid firId FK
        uuid officerId FK
        uuid assignedById FK
        timestamp assignedDate
        timestamp releasedDate
    }

    %% VICTIM & EVIDENCE
    VICTIM {
        uuid id PK
        uuid firId FK
        varchar firstName
        varchar identityProof
        boolean protectionRequired
    }
    EVIDENCE {
        uuid id PK
        uuid firId FK
        varchar type
        varchar sha256Hash
        text digitalSignature
        jsonb chainOfCustody
    }

    %% INTELLIGENCE & AI
    INTELLIGENCE_ENTITY {
        uuid id PK
        enum entityType "PERSON, VEHICLE, PHONE, BANK_ACCOUNT..."
        varchar value
        varchar biometricRef
        varchar criminalHistory
    }
    FIR_ENTITY_LINK {
        uuid firId PK,FK
        uuid entityId PK,FK
        varchar involvementType
    }
    ENTITY_RELATIONSHIP {
        uuid id PK
        uuid sourceEntityId FK
        uuid targetEntityId FK
        varchar relationshipType
        int confidenceScore
        boolean createdByAI
    }
    AI_ANALYSIS {
        uuid id PK
        uuid firId FK
        varchar analysisType
        text content
        varchar vectorIndexReference
    }

    %% RELATIONS - HIERARCHY
    STATE ||--o{ RANGE : "has"
    RANGE ||--o{ COMMISSIONERATE : "has"
    COMMISSIONERATE ||--o{ DISTRICT : "has"
    DISTRICT ||--o{ SUB_DIVISION : "has"
    SUB_DIVISION ||--o{ CIRCLE : "has"
    CIRCLE ||--o{ POLICE_STATION : "has"
    POLICE_STATION ||--o{ BEAT : "has"
    POLICE_STATION ||--o{ USER : "employs"
    POLICE_STATION ||--o{ FIR : "registers"
    BEAT ||--o{ FIR : "contains"

    %% RELATIONS - CRIME
    CRIME_CATEGORY ||--o{ SUB_CRIME_CATEGORY : "has"
    CRIME_CATEGORY ||--o{ FIR : "classifies"
    
    %% RELATIONS - FIR
    FIR ||--o{ CASE_STATUS_HISTORY : "tracks status"
    FIR ||--o{ OFFICER_ASSIGNMENT_HISTORY : "assigned to"
    USER ||--o{ OFFICER_ASSIGNMENT_HISTORY : "worked on"
    FIR ||--o{ VICTIM : "involves"
    FIR ||--o{ EVIDENCE : "holds"
    FIR ||--o{ AI_ANALYSIS : "analyzed by"

    %% RELATIONS - INTELLIGENCE GRAPH
    FIR ||--o{ FIR_ENTITY_LINK : "involves"
    INTELLIGENCE_ENTITY ||--o{ FIR_ENTITY_LINK : "linked to"
    INTELLIGENCE_ENTITY ||--o{ ENTITY_RELATIONSHIP : "source"
    INTELLIGENCE_ENTITY ||--o{ ENTITY_RELATIONSHIP : "target"

    %% RELATIONS - AUDIT
    USER ||--o{ AUDIT_LOG : "generates"
```
