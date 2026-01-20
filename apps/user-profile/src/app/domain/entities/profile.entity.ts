export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string, // <--- CAMBIO: Name completo
    public readonly phoneNumber: string,
    public readonly address: string | null,
    
    // Nuevos campos
    public readonly semester: string | null,
    public readonly faculty: string | null,
    public readonly career: string | null,
    public readonly profilePicture: string | null
  ) {}
}