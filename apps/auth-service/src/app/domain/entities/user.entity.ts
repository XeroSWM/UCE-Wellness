export type UserRole = 'STUDENT' | 'SPECIALIST' | 'ADMIN';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole, // Según tus roles RBAC [cite: 72]
    public readonly isActive = true
  ) {}
}