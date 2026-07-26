# CrimeLens AI – Deployment Architecture

This document describes the production deployment pipeline and infrastructure using Zoho Catalyst.

## 1. Production Architecture on Zoho Catalyst

CrimeLens AI is deployed exclusively on the **Zoho Catalyst Serverless Platform**, ensuring automatic scaling, high availability, and built-in security compliance required for Law Enforcement Agencies (LEAs).

### 1.1 Infrastructure Components

1. **Catalyst Web Client Hosting (Frontend)**
   - Hosts the compiled Next.js static export (`out/` directory).
   - Served via Catalyst CDN edge nodes for low-latency delivery across Karnataka.
   - Configured with strict Content Security Policies (CSP) and CORS settings.

2. **Catalyst AppSail (Backend App Platform)**
   - The Express.js backend runs within AppSail containers.
   - Automatically scales from zero to hundreds of concurrent instances during peak query loads.
   - Exposes RESTful APIs secured behind the Catalyst API Gateway.

3. **Catalyst API Gateway**
   - The single entry point for all API calls.
   - Handles rate-limiting (e.g., 100 requests per minute per IP to prevent DDoS).
   - Validates incoming Catalyst Authentication JWTs before routing to AppSail.

4. **Catalyst DataStore (Relational DB)**
   - Fully managed PostgreSQL-compatible relational database.
   - Configured for Multi-AZ high availability with automated nightly backups.
   - Stores the strict 3NF normalized schema (FIRs, Suspects, Users, Audit Logs).

5. **Catalyst Stratus (Blob Storage)**
   - Stores immutable digital evidence (CCTV footage, PDF Dossiers, crime scene photos).
   - Enforces strict bucket policies (no public access, signed URLs only).

6. **Catalyst QuickML**
   - Native Catalyst ML pipeline used for predictive modeling and NLP.

## 2. CI/CD Pipeline (GitHub Actions)

Deployments are fully automated via GitHub Actions, mapping to a standard `DEV` -> `UAT` -> `PROD` lifecycle.

### Build and Deploy Pipeline Steps

1. **Push to `main` branch**: Triggers the GitHub Action.
2. **Lint & Test**:
   - Runs `npm run lint` (ESLint/Prettier).
   - Runs `npm test` (Jest unit tests for core services).
   - Runs Prisma Schema validation (`npx prisma validate`).
3. **Build Frontend**:
   - Next.js compiles to static HTML/JS/CSS (`npm run build`).
4. **Build Backend**:
   - TypeScript compiles to JavaScript (`tsc`).
5. **Catalyst Deployment**:
   - The pipeline uses the Catalyst CLI (`catalyst deploy --token $CATALYST_TOKEN`) to push the code.
   - Deploys the Web Client to Web Hosting.
   - Deploys the Server to AppSail.

## 3. Environment Management

Environment variables are managed securely in the Catalyst Console (Settings -> Environment Variables).

### Required Production Environment Variables:
- `DATABASE_URL`: Connection string to the Catalyst DataStore (or external managed PostgreSQL).
- `JWT_SECRET`: 256-bit secure key for signing internal tokens (if bypassing Catalyst Auth for M2M).
- `LLM_API_KEY`: API key for the LLM provider (QuickML / OpenAI).
- `CATALYST_PROJECT_ID`: Auto-injected by AppSail.

## 4. Scalability & Resilience

- **Stateless Backend**: The Express.js AppSail instances are 100% stateless. Sessions are managed via Catalyst Auth (JWT), and application state is in DataStore/Cache. This allows AppSail to spin up new instances instantly under load.
- **Database Connection Pooling**: Prisma is configured with connection pooling (`?pgbouncer=true`) to prevent database connection exhaustion during high-concurrency events (e.g., statewide raids requiring bulk intelligence lookups).
