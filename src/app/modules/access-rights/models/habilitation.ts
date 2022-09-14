export class Habilitation {
  private grantedAccess: number;
  constructor(grantedAccess: number) {
    this.grantedAccess = grantedAccess !== undefined ? grantedAccess : 0;
  }
  unauthorized(): boolean {
    return this.grantedAccess <= 0;
  }
  canRead(): boolean {
    return this.grantedAccess > 0;
  }
  canReadList(): boolean {
    return this.grantedAccess > 1;
  }
  canCreate(): boolean {
    return this.grantedAccess > 2;
  }
  canEdit(): boolean {
    return this.grantedAccess > 3;
  }
  canDelete(): boolean {
    return this.grantedAccess > 4;
  }
  isAdmin(): boolean {
    return this.grantedAccess > 5;
  }
  isSuperAdmin(): boolean {
    return this.grantedAccess > 6;
  }
}
