/**
 * CrimeLens AI - Zoho Catalyst Data Store Manager
 */

export interface CaseEntity {
  ROWID?: string;
  FIR_ID: string;
  DISTRICT: string;
  POLICE_STATION: string;
  CRIME_CATEGORY: string;
  RISK_SCORE: number;
  STATUS: string;
  CREATED_TIME?: string;
}

export interface AccusedEntity {
  ROWID?: string;
  SUSPECT_ID: string;
  NAME: string;
  ALIAS?: string;
  RISK_LEVEL: string;
  TOTAL_FIRS: number;
}

export class CatalystDataStore {
  private static instance: CatalystDataStore;

  private constructor() {}

  public static getInstance(): CatalystDataStore {
    if (!CatalystDataStore.instance) {
      CatalystDataStore.instance = new CatalystDataStore();
    }
    return CatalystDataStore.instance;
  }

  public async getTableDetails(tableName: string, catalystApp?: any) {
    if (catalystApp && catalystApp.datastore) {
      try {
        const datastore = catalystApp.datastore();
        const table = datastore.table(tableName);
        return { tableName, status: "CONNECTED", datastore: "Zoho Catalyst Data Store", table };
      } catch (err: any) {
        return { tableName, status: "READY", datastore: "Zoho Catalyst Data Store (Fallback)" };
      }
    }
    return { tableName, status: "READY", datastore: "Zoho Catalyst Data Store" };
  }
}
