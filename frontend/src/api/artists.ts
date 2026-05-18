export interface Artist {
  _id: string;
  name: string;
  albums: string[];
  genres: string[];
  mood: string[];
  era: string;
  similarArtists: string[];
  imageUrl: string;
}

export const getArtists = async (query?: string) => {
  const url = query
    ? `http://localhost:3000/artists?query=${encodeURIComponent(query)}`
    : `http://localhost:3000/artists`;

  const res = await fetch(url);
  return res.json();
};
