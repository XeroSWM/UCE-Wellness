export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string, // Esta es la "llave" que lo une con el Auth-Service
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phoneNumber: string,
    public readonly address: string | null
  ) {}
}