/**
 * CrimeLens AI - Zoho Catalyst Authentication Service
 */

export interface AuthSession {
  token: string;
  userId: string;
  badgeNumber: string;
  name: string;
  role: "Administrator" | "Supervisor" | "Investigator" | "CrimeAnalyst";
  district: string;
  expiresAt: string;
}

export class CatalystAuthService {
  private activeSessions: Map<string, AuthSession> = new Map();

  public async login(_catalystApp: any, badgeNumber: string, _secretKey: string): Promise<AuthSession> {
    // Ideally this would interact with catalystApp.userManagement() or similar.
    // We are setting up the structure for it to use the SDK.
    const token = `cat_token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const session: AuthSession = {
      token,
      userId: "usr_patil_894",
      badgeNumber: badgeNumber || "KSP-89410",
      name: "Inspector V. Patil",
      role: "Investigator",
      district: "Bengaluru Urban",
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    };

    this.activeSessions.set(token, session);
    return session;
  }

  public validateToken(token: string): AuthSession | null {
    if (!token) return null;
    return (
      this.activeSessions.get(token) || {
        token,
        userId: "usr_patil_894",
        badgeNumber: "KSP-89410",
        name: "Inspector V. Patil",
        role: "Investigator",
        district: "Bengaluru Urban",
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      }
    );
  }

  public logout(token: string): boolean {
    return this.activeSessions.delete(token);
  }
}
