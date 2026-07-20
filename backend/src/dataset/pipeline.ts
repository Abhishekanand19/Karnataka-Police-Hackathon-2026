import {
  generateSyntheticDataset,
  DistrictRecord,
  PoliceStationRecord,
  FIRRecord,
  AccusedRecord,
} from "./generator";

export class DataImportPipeline {
  private static instance: DataImportPipeline;
  private districts: DistrictRecord[] = [];
  private policeStations: PoliceStationRecord[] = [];
  private firs: FIRRecord[] = [];
  private accused: AccusedRecord[] = [];

  private constructor() {
    this.seedDatabase();
  }

  public static getInstance(): DataImportPipeline {
    if (!DataImportPipeline.instance) {
      DataImportPipeline.instance = new DataImportPipeline();
    }
    return DataImportPipeline.instance;
  }

  public seedDatabase(): void {
    const dataset = generateSyntheticDataset();
    this.districts = dataset.districts;
    this.policeStations = dataset.policeStations;
    this.firs = dataset.firs;
    this.accused = dataset.accused;
  }

  public resetDatabase(): void {
    this.seedDatabase();
  }

  public validateForeignKeys(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.firs.forEach((fir) => {
      const dist = this.districts.find((d) => d.id === fir.districtId);
      if (!dist) errors.push(`FIR [${fir.id}] references invalid district [${fir.districtId}]`);

      const ps = this.policeStations.find((p) => p.id === fir.policeStationId);
      if (!ps) errors.push(`FIR [${fir.id}] references invalid police station [${fir.policeStationId}]`);

      if (fir.suspectId) {
        const acc = this.accused.find((a) => a.id === fir.suspectId);
        if (!acc) errors.push(`FIR [${fir.id}] references invalid suspect [${fir.suspectId}]`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  public getDistricts(): DistrictRecord[] {
    return this.districts;
  }

  public getPoliceStations(): PoliceStationRecord[] {
    return this.policeStations;
  }

  public getFIRs(): FIRRecord[] {
    return this.firs;
  }

  public getAccused(): AccusedRecord[] {
    return this.accused;
  }
}
