export class CreateArtistDto {
  private static nextIdValue = 1;
  _id: number = CreateArtistDto.nextIdValue++;
  name!: string;
  genres!: string[];
  mood!: string[];
  era?: string;
  similarArtists!: string[];
  imageUrl?: string;
  description?: string;
}
