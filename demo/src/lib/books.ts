export type Book = {
  id: string;
  title: string;
  author: string;
  genre: "Mystery" | "Romance" | "Sci-Fi" | "Thriller" | "Fantasy";
  tags: string[];
  cover: { bg: string; fg: string };
};

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const make = (
  title: string,
  author: string,
  genre: Book["genre"],
  tags: string[],
  bg: string,
  fg = "#f0ece4",
): Book => ({
  id: slug(title),
  title,
  author,
  genre,
  tags,
  cover: { bg, fg },
});

export const BOOKS: Book[] = [
  // Mystery
  make("The Hollow Hour", "K. Marsh", "Mystery", ["Mystery", "Atmospheric"], "#1a1f2e"),
  make("Cold Case Protocol", "J. Reeve", "Mystery", ["Mystery", "Procedural"], "#0f2a2a"),
  make("What the River Knows", "P. Alcott", "Mystery", ["Mystery", "Gothic"], "#241a1a"),
  // Romance
  make("The Italian Detour", "S. Bloom", "Romance", ["Romance", "Contemporary"], "#3a1f24", "#fde6d3"),
  make("Letters Never Sent", "M. Cassidy", "Romance", ["Romance", "Epistolary"], "#2b1a2a", "#f4d9e2"),
  make("Last Summer in Oslo", "A. Vang", "Romance", ["Romance", "Slow Burn"], "#1f2b33", "#f0ece4"),
  // Sci-Fi
  make("Eigenstate", "C. Mora", "Sci-Fi", ["Sci-Fi", "Hard SF"], "#0a1a2b", "#a8d6ff"),
  make("The Quiet Singularity", "D. Okafor", "Sci-Fi", ["Sci-Fi", "Dystopian"], "#16161e", "#c8832a"),
  make("Pale Horizon", "T. Shen", "Sci-Fi", ["Sci-Fi", "Space Opera"], "#1a0f2e", "#e9d6ff"),
];

export const GENRES = ["All", "Mystery", "Romance", "Sci-Fi", "Thriller", "Fantasy"] as const;
export type Genre = typeof GENRES[number];
