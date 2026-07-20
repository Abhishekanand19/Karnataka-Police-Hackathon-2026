/**
 * CrimeLens AI - Analytics Engine Automated Test Suite
 */

import { DataImportPipeline } from "../dataset/pipeline";
import { CrimeStatisticsService } from "../services/crime-statistics.service";
import { DistrictAnalyticsService } from "../services/district-analytics.service";
import { HotspotEngineService } from "../services/hotspot-engine.service";
import { RepeatOffenderService } from "../services/repeat-offender.service";
import { NetworkBuilderService } from "../services/network-builder.service";

export function runAnalyticsTests() {
  console.log("=================================================");
  console.log("  CrimeLens AI - Running Analytics Engine Tests  ");
  console.log("=================================================");

  // Test 1: Data Import & Foreign Keys
  const pipeline = DataImportPipeline.getInstance();
  const fkCheck = pipeline.validateForeignKeys();
  if (!fkCheck.valid) {
    console.error("❌ TEST 1 FAILED: Foreign Key Validation Errors:", fkCheck.errors);
    process.exit(1);
  }
  console.log("✅ TEST 1 PASSED: Synthetic Dataset & Foreign Key Integrity Verified.");

  // Test 2: Crime Statistics Service
  const crimeStatsService = new CrimeStatisticsService();
  const stats = crimeStatsService.getOverallStatistics();
  if (stats.totalCases < 1 || !stats.clearanceRate) {
    console.error("❌ TEST 2 FAILED: Crime Statistics calculation invalid.");
    process.exit(1);
  }
  console.log(`✅ TEST 2 PASSED: Overall Statistics calculated. Total Cases: ${stats.totalCases}, Clearance: ${stats.clearanceRate}.`);

  // Test 3: District Analytics & Risk Scores
  const districtService = new DistrictAnalyticsService();
  const districtAnalytics = districtService.getDistrictAnalytics();
  if (districtAnalytics.length < 5) {
    console.error("❌ TEST 3 FAILED: District analytics calculation failed.");
    process.exit(1);
  }
  console.log(`✅ TEST 3 PASSED: District Analytics calculated across ${districtAnalytics.length} districts.`);

  // Test 4: Hotspot Engine
  const hotspotEngine = new HotspotEngineService();
  const hotspots = hotspotEngine.calculateHotspots();
  if (hotspots.length === 0 || hotspots[0].riskScore < 50) {
    console.error("❌ TEST 4 FAILED: Hotspot engine calculation failed.");
    process.exit(1);
  }
  console.log(`✅ TEST 4 PASSED: Hotspot Engine emerged ${hotspots.length} spatial hotspot clusters.`);

  // Test 5: Repeat Offender Engine
  const repeatOffenderService = new RepeatOffenderService();
  const repeatOffenders = repeatOffenderService.getRepeatOffenders();
  if (repeatOffenders.length === 0) {
    console.error("❌ TEST 5 FAILED: Repeat offender detection failed.");
    process.exit(1);
  }
  console.log(`✅ TEST 5 PASSED: Repeat Offender Engine detected ${repeatOffenders.length} high-risk repeat suspects.`);

  // Test 6: Network Builder
  const networkBuilder = new NetworkBuilderService();
  const graph = networkBuilder.buildNetworkGraph("FIR-2026-00491");
  if (graph.nodesCount < 3 || graph.edgesCount < 2) {
    console.error("❌ TEST 6 FAILED: Network builder graph generation failed.");
    process.exit(1);
  }
  console.log(`✅ TEST 6 PASSED: Network Builder graph generated with ${graph.nodesCount} nodes and ${graph.edgesCount} edges.`);

  console.log("=================================================");
  console.log("  ALL ANALYTICS ENGINE TESTS PASSED CLEANLY!     ");
  console.log("=================================================");
}

if (require.main === module) {
  runAnalyticsTests();
}
