# Enterprise Database Schema: CrimeLens AI

This schema establishes the enterprise-grade foundation for the Karnataka Police Crime Intelligence Platform, supporting hierarchical access, intelligence tracking, AI insights, and strict auditing.

## 1. Prisma Schema (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ========================================================
// ENUMS
// ========================================================

enum Role {
  ADMINISTRATOR
  COMMISSIONER
  SUPERVISOR
  INVESTIGATOR
  CRIME_ANALYST
  SYSTEM_AUDITOR
}

enum CaseStatus {
  OPEN
  UNDER_INVESTIGATION
  SUSPECT_ARRESTED
  CHARGESHEET_SUBMITTED
  CLOSED
  TRANSFERED
  COLD_CASE
}

enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }
enum Gender { MALE, FEMALE, OTHER, UNKNOWN }
enum EntityType { PERSON, VEHICLE, PHONE, IMEI, EMAIL, BANK_ACCOUNT, UPI, PASSPORT, DRIVING_LICENSE, IP_ADDRESS, DEVICE_ID, WEAPON, BUSINESS, LOCATION }
enum DeliveryStatus { PENDING, DELIVERED, FAILED, READ }
enum AuditAction { LOGIN, LOGOUT, VIEW, CREATE, UPDATE, DELETE, EXPORT, AI_QUERY }

// ========================================================
// SECURITY & AUDIT
// ========================================================

model User {
  id             String    @id @default(uuid()) @db.Uuid
  badgeNumber    String    @unique @db.VarChar(50)
  email          String    @unique @db.VarChar(255)
  passwordHash   String    @db.VarChar(255)
  firstName      String    @db.VarChar(100)
  lastName       String    @db.VarChar(100)
  role           Role      @default(INVESTIGATOR)
  policeStationId String?  @db.Uuid
  isActive       Boolean   @default(true)
  isDeleted      Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  policeStation      PoliceStation? @relation(fields: [policeStationId], references: [id])
  assignments        OfficerAssignmentHistory[]
  auditLogs          AuditLog[]
  reportsGenerated   GeneratedReport[]
}

model AuditLog {
  id           String      @id @default(uuid()) @db.Uuid
  userId       String?     @db.Uuid
  action       AuditAction
  tableName    String      @db.VarChar(100)
  recordId     String      @db.VarChar(255)
  oldData      Json?
  newData      Json?
  ipAddress    String      @db.VarChar(45)
  createdAt    DateTime    @default(now())

  user         User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([createdAt])
}

// ========================================================
// POLICE HIERARCHY
// ========================================================

model State {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @unique @db.VarChar(100)
  ranges    Range[]
}

model Range {
  id             String           @id @default(uuid()) @db.Uuid
  name           String           @unique @db.VarChar(100)
  stateId        String           @db.Uuid
  state          State            @relation(fields: [stateId], references: [id])
  commissionerates Commissionerate[]
}

model Commissionerate {
  id        String       @id @default(uuid()) @db.Uuid
  name      String       @unique @db.VarChar(100)
  rangeId   String       @db.Uuid
  range     Range        @relation(fields: [rangeId], references: [id])
  districts District[]
}

model District {
  id                String          @id @default(uuid()) @db.Uuid
  name              String          @unique @db.VarChar(100)
  commissionerateId String          @db.Uuid
  commissionerate   Commissionerate @relation(fields: [commissionerateId], references: [id])
  subDivisions      SubDivision[]
}

model SubDivision {
  id         String   @id @default(uuid()) @db.Uuid
  name       String   @db.VarChar(100)
  districtId String   @db.Uuid
  district   District @relation(fields: [districtId], references: [id])
  circles    Circle[]
}

model Circle {
  id             String          @id @default(uuid()) @db.Uuid
  name           String          @db.VarChar(100)
  subDivisionId  String          @db.Uuid
  subDivision    SubDivision     @relation(fields: [subDivisionId], references: [id])
  policeStations PoliceStation[]
}

model PoliceStation {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @db.VarChar(150)
  circleId  String   @db.Uuid
  latitude  Decimal  @db.Decimal(10, 7)
  longitude Decimal  @db.Decimal(10, 7)
  circle    Circle   @relation(fields: [circleId], references: [id])
  
  beats     Beat[]
  users     User[]
  firs      FIR[]
}

model Beat {
  id              String        @id @default(uuid()) @db.Uuid
  name            String        @db.VarChar(100)
  policeStationId String        @db.Uuid
  policeStation   PoliceStation @relation(fields: [policeStationId], references: [id])
  firs            FIR[]
}

// ========================================================
// CRIME CATEGORY NORMALIZATION
// ========================================================

model CrimeCategory {
  id            String             @id @default(uuid()) @db.Uuid
  name          String             @unique @db.VarChar(100)
  severity      RiskLevel          @default(LOW)
  nature        String             @db.VarChar(100)
  type          String             @db.VarChar(100)
  subCategories SubCrimeCategory[]
  firs          FIR[]
}

model SubCrimeCategory {
  id              String            @id @default(uuid()) @db.Uuid
  categoryId      String            @db.Uuid
  name            String            @db.VarChar(100)
  ipcBnsSections  String[]          // e.g., ["IPC 379", "BNS 303(2)"]
  category        CrimeCategory     @relation(fields: [categoryId], references: [id])
  firs            FIR[]
}

// ========================================================
// FIR & LIFECYCLES
// ========================================================

model FIR {
  id                  String           @id @default(uuid()) @db.Uuid
  firNumber           String           @unique @db.VarChar(50)
  policeStationId     String           @db.Uuid
  beatId              String?          @db.Uuid
  categoryId          String           @db.Uuid
  subCategoryId       String?          @db.Uuid
  
  status              CaseStatus       @default(OPEN)
  incidentDate        DateTime         @db.Timestamp(3)
  
  // GIS Layer
  latitude            Decimal          @db.Decimal(10, 7)
  longitude           Decimal          @db.Decimal(10, 7)
  geoHash             String           @db.VarChar(20)
  ward                String?          @db.VarChar(100)
  village             String?          @db.VarChar(100)
  taluk               String?          @db.VarChar(100)
  pincode             String?          @db.VarChar(20)
  landmark            String?          @db.VarChar(150)
  
  modusOperandi       String           @db.Text
  isDeleted           Boolean          @default(false)
  createdAt           DateTime         @default(now())

  // Relations
  policeStation       PoliceStation    @relation(fields: [policeStationId], references: [id])
  beat                Beat?            @relation(fields: [beatId], references: [id])
  category            CrimeCategory    @relation(fields: [categoryId], references: [id])
  subCategory         SubCrimeCategory? @relation(fields: [subCategoryId], references: [id])
  
  statusHistory       CaseStatusHistory[]
  assignments         OfficerAssignmentHistory[]
  victims             Victim[]
  evidences           Evidence[]
  intelligenceLinks   FIREntityLink[]
  aiAnalyses          AIAnalysis[]
}

model CaseStatusHistory {
  id          String     @id @default(uuid()) @db.Uuid
  firId       String     @db.Uuid
  oldStatus   CaseStatus
  newStatus   CaseStatus
  changedById String     @db.Uuid
  remarks     String?    @db.Text
  reason      String?    @db.VarChar(255)
  changedAt   DateTime   @default(now())

  fir         FIR        @relation(fields: [firId], references: [id])
}

model OfficerAssignmentHistory {
  id           String    @id @default(uuid()) @db.Uuid
  firId        String    @db.Uuid
  officerId    String    @db.Uuid
  assignedById String    @db.Uuid
  assignedDate DateTime  @default(now())
  releasedDate DateTime?
  reason       String?   @db.VarChar(255)

  fir          FIR       @relation(fields: [firId], references: [id])
  officer      User      @relation(fields: [officerId], references: [id])
}

// ========================================================
// VICTIM SCHEMA
// ========================================================

model Victim {
  id                 String    @id @default(uuid()) @db.Uuid
  firId              String    @db.Uuid
  firstName          String    @db.VarChar(100)
  lastName           String?   @db.VarChar(100)
  age                Int?
  gender             Gender    @default(UNKNOWN)
  occupation         String?   @db.VarChar(100)
  address            String?   @db.Text
  guardian           String?   @db.VarChar(100)
  phone              String?   @db.VarChar(20)
  email              String?   @db.VarChar(255)
  identityProof      String?   @db.VarChar(100)
  relationshipToCase String?   @db.VarChar(100)
  injuryType         String?   @db.VarChar(100)
  protectionRequired Boolean   @default(false)

  fir                FIR       @relation(fields: [firId], references: [id])
}

// ========================================================
// INTELLIGENCE ENTITY LAYER & ACCUSED
// ========================================================

model IntelligenceEntity {
  id              String       @id @default(uuid()) @db.Uuid
  entityType      EntityType
  value           String       @db.VarChar(255) // E.g., Phone number, IMEI, Account Num, Suspect ID
  
  // Suspect specific fields (Null for non-person entities)
  firstName       String?      @db.VarChar(100)
  lastName        String?      @db.VarChar(100)
  alias           String?      @db.VarChar(100)
  nationality     String?      @db.VarChar(50)
  occupation      String?      @db.VarChar(100)
  biometricRef    String?      @db.VarChar(255)
  photoHash       String?      @db.VarChar(64)
  criminalHistory String?      @db.Text
  gangMembership  String?      @db.VarChar(100)
  status          String?      @db.VarChar(100)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  firLinks        FIREntityLink[]
  sourceRelations EntityRelationship[] @relation("SourceEntity")
  targetRelations EntityRelationship[] @relation("TargetEntity")
}

model FIREntityLink {
  firId           String             @db.Uuid
  entityId        String             @db.Uuid
  involvementType String             @db.VarChar(100) // E.g., Accused, Stolen Vehicle, Fraud Account
  createdAt       DateTime           @default(now())

  fir             FIR                @relation(fields: [firId], references: [id])
  entity          IntelligenceEntity @relation(fields: [entityId], references: [id])

  @@id([firId, entityId])
}

model EntityRelationship {
  id               String             @id @default(uuid()) @db.Uuid
  sourceEntityId   String             @db.Uuid
  targetEntityId   String             @db.Uuid
  relationshipType String             @db.VarChar(100) // E.g., "COMMUNICATED_WITH", "OWNED_BY"
  confidenceScore  Int                @default(100)
  verified         Boolean            @default(false)
  createdByAI      Boolean            @default(false)
  sourceRef        String?            @db.VarChar(255) // E.g., Call Data Record ID
  createdAt        DateTime           @default(now())

  sourceEntity     IntelligenceEntity @relation("SourceEntity", fields: [sourceEntityId], references: [id])
  targetEntity     IntelligenceEntity @relation("TargetEntity", fields: [targetEntityId], references: [id])
}

// ========================================================
// EVIDENCE & CHAIN OF CUSTODY
// ========================================================

model Evidence {
  id               String    @id @default(uuid()) @db.Uuid
  firId            String    @db.Uuid
  type             String    @db.VarChar(50) // Images, Videos, CCTV, Fingerprint, DNA
  title            String    @db.VarChar(200)
  storagePath      String    @db.Text // Stratus bucket path
  sha256Hash       String    @db.VarChar(64)
  digitalSignature String?   @db.Text
  chainOfCustody   Json?     // Array of custody transfers
  uploadedAt       DateTime  @default(now())

  fir              FIR       @relation(fields: [firId], references: [id])
}

// ========================================================
// AI & REPORTING LAYER
// ========================================================

model AIAnalysis {
  id                   String   @id @default(uuid()) @db.Uuid
  firId                String?  @db.Uuid
  analysisType         String   @db.VarChar(50) // Summary, Risk, Recommendation
  content              String   @db.Text
  aiRiskScore          Int?
  aiReasoning          String?  @db.Text
  embeddingReference   String?  @db.VarChar(255)
  vectorIndexReference String?  @db.VarChar(255)
  promptHistory        Json?
  modelVersion         String   @db.VarChar(50)
  inferenceTimeMs      Int
  createdAt            DateTime @default(now())

  fir                  FIR?     @relation(fields: [firId], references: [id])
}

model GeneratedReport {
  id             String   @id @default(uuid()) @db.Uuid
  reportType     String   @db.VarChar(50) // PDF, Excel
  storagePath    String   @db.Text
  createdById    String   @db.Uuid
  generatedTime  DateTime @default(now())
  downloadCount  Int      @default(0)

  createdBy      User     @relation(fields: [createdById], references: [id])
}

model Notification {
  id             String         @id @default(uuid()) @db.Uuid
  recipientId    String         @db.Uuid
  message        String         @db.Text
  priority       RiskLevel      @default(LOW)
  readStatus     Boolean        @default(false)
  deliveryStatus DeliveryStatus @default(PENDING)
  createdAt      DateTime       @default(now())
}
```

## 2. PostgreSQL Architecture & Strategy

To support millions of records, the backend PostgreSQL DDL incorporates native partitioning and specialized index structures.

### Partitioning Strategy (FIR Table)
The `FIR` table is range-partitioned by `incidentDate` by year, dramatically improving scan speeds for historical analytical queries.

```sql
CREATE TABLE "FIR" (
    "id" UUID DEFAULT uuid_generate_v4(),
    "firNumber" VARCHAR(50) NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    -- ... other fields
    PRIMARY KEY ("id", "incidentDate")
) PARTITION BY RANGE ("incidentDate");

CREATE TABLE "FIR_2024" PARTITION OF "FIR" FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE "FIR_2025" PARTITION OF "FIR" FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE "FIR_2026" PARTITION OF "FIR" FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

### Advanced Indexing Strategy

**1. Spatial Indexing (PostGIS)**
Required for mapping features and boundary detection.
```sql
CREATE EXTENSION postgis;
-- Add Geometry Column
ALTER TABLE "FIR" ADD COLUMN geom geometry(Point, 4326);
-- Create GIST index
CREATE INDEX "IDX_FIR_GIS" ON "FIR" USING GIST (geom);
```

**2. Full Text Search**
Required for querying Modus Operandi and Case Notes.
```sql
-- Create GIN index on tsvector
ALTER TABLE "FIR" ADD COLUMN ts_mo tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce("modusOperandi", ''))) STORED;
CREATE INDEX "IDX_FIR_FTS" ON "FIR" USING GIN (ts_mo);
```

**3. Composite Covering Indexes**
Speeds up the specific dashboard counts for Station House Officers.
```sql
CREATE INDEX "IDX_FIR_Station_Status" ON "FIR" ("policeStationId", "status", "incidentDate");
```

### Archival Strategy
- Active tables hold data for the last 5 years.
- Partitions older than 5 years are detached and migrated to AWS S3 / Catalyst Stratus as Parquet files using pg_dump.
- Queried via federated queries only when "Deep Archive" is selected.
