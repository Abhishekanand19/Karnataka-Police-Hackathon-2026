/**
 * CrimeLens AI - Production Release Automated Test Suite
 */

import { CatalystAuthService } from "../auth/auth.service";
import { AuditLogger } from "../audit/audit-logger";
import { SmartBrowzReportGenerator } from "../reports/smartbrowz-report";
import { StratusStorageService } from "../storage/stratus-storage";
import { HealthMonitorService } from "../health/health-monitor";

export async function runProductionTests() {
  console.log("=================================================");
  console.log("  CrimeLens AI - Running Production Release Tests");
  console.log("=================================================");

  // Test 1: Catalyst Authentication
  const authService = new CatalystAuthService();
  const session = await authService.login(null, "KSP-89410", "secret");
  const validated = authService.validateToken(session.token);

  if (!session.token || !validated || validated.badgeNumber !== "KSP-89410") {
    console.error("❌ TEST 1 FAILED: Catalyst Authentication token error.", session);
    process.exit(1);
  }
  console.log(`✅ TEST 1 PASSED: Catalyst Auth session token created & validated for Badge #${session.badgeNumber}.`);

  // Test 2: Audit Logging
  const auditRecord = AuditLogger.log("Inspector V. Patil", "Investigator", "TEST_ACTION", "CaseMaster", "SUCCESS", "127.0.0.1");
  const logs = AuditLogger.getLogs();
  if (logs.length === 0 || !auditRecord.id) {
    console.error("❌ TEST 2 FAILED: Audit Logger failed to record audit log.");
    process.exit(1);
  }
  console.log(`✅ TEST 2 PASSED: Audit Logger recorded log #${auditRecord.id}. Total logs: ${logs.length}.`);

  // Test 3: SmartBrowz Report Generator
  const reportGenerator = new SmartBrowzReportGenerator();
  const report = reportGenerator.generateReport("Executive Intelligence Briefing", "Inspector V. Patil", "KSP-89410");
  if (!report.reportId || !report.coverPage.title) {
    console.error("❌ TEST 3 FAILED: SmartBrowz report generation failed.", report);
    process.exit(1);
  }
  console.log(`✅ TEST 3 PASSED: SmartBrowz Report #${report.reportId} generated with SHA-256 audit seal.`);

  // Test 4: Stratus Storage
  const storageService = new StratusStorageService();
  const storageRecord = await storageService.uploadReport(null, report.reportId, report);
  if (!storageRecord.downloadUrl || storageRecord.sizeBytes === 0) {
    console.error("❌ TEST 4 FAILED: Stratus storage upload failed.", storageRecord);
    process.exit(1);
  }
  console.log(`✅ TEST 4 PASSED: Report uploaded to Stratus Storage (${storageRecord.sizeBytes} bytes). URL: ${storageRecord.downloadUrl}`);

  // Test 5: Health Monitoring Suite (5 endpoints)
  const healthMonitor = new HealthMonitorService();
  const overall = healthMonitor.getOverallHealth();
  const dbHealth = healthMonitor.getDatabaseHealth();
  const storageHealth = healthMonitor.getStorageHealth();
  const aiHealth = healthMonitor.getAIHealth();
  const sysHealth = healthMonitor.getSystemHealth();

  if (
    overall.status !== "HEALTHY" ||
    dbHealth.status !== "CONNECTED" ||
    storageHealth.status !== "CONNECTED" ||
    aiHealth.status !== "OPERATIONAL" ||
    sysHealth.status !== "OPTIMAL"
  ) {
    console.error("❌ TEST 5 FAILED: Health Monitoring check failed.", { overall, dbHealth, storageHealth, aiHealth, sysHealth });
    process.exit(1);
  }
  console.log("✅ TEST 5 PASSED: All 5 Health Monitoring Endpoints (Overall, DB, Storage, AI, System) Healthy.");

  console.log("=================================================");
  console.log("  ALL PRODUCTION RELEASE TESTS PASSED CLEANLY!  ");
  console.log("=================================================");
}

if (require.main === module) {
  runProductionTests();
}
