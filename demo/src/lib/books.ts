export type Genre = "Mystery" | "Romance" | "Sci-Fi" | "Fantasy" | "Thriller" | "Historical Fiction";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  genre: Genre;
  rating: number;
  reviewCount: number;
  coverBg: string;
  coverAccent: string;
  bestseller?: boolean;
  newRelease?: boolean;
  description: string;
  /** legacy — used by the Supabase config reorder logic */
  tags?: string[];
}

export const books: Book[] = [
  // Mystery
  { id: "m1", title: "The Silent Hour",       author: "Elena Marsh",    price: 99,  originalPrice: 149, genre: "Mystery",            rating: 4.5, reviewCount: 1243, coverBg: "from-blue-900 via-slate-800 to-gray-900",     coverAccent: "text-blue-300",   bestseller: true,  description: "A detective haunted by an unsolved case returns to the town that changed everything." },
  { id: "m2", title: "Dark Waters",           author: "James Holt",     price: 119, genre: "Mystery",            rating: 4.2, reviewCount: 876,  coverBg: "from-slate-900 via-blue-950 to-indigo-950", coverAccent: "text-cyan-300",   description: "When a body surfaces in the harbor, old secrets rise with it." },
  { id: "m3", title: "The Last Witness",      author: "Clara Voss",     price: 89,  originalPrice: 129, genre: "Mystery",            rating: 4.7, reviewCount: 2105, coverBg: "from-gray-900 via-zinc-800 to-slate-900",    coverAccent: "text-amber-300",  bestseller: true,  description: "She saw everything. Now someone wants to make sure she forgets." },
  { id: "m4", title: "Hollow Creek",          author: "Thomas Dahl",    price: 109, genre: "Mystery",            rating: 3.9, reviewCount: 432,  coverBg: "from-indigo-950 via-gray-900 to-slate-800", coverAccent: "text-indigo-300", description: "A small town with too many secrets and not enough alibis." },
  { id: "m5", title: "The Cipher Room",       author: "Nadia Cole",     price: 129, genre: "Mystery",            rating: 4.4, reviewCount: 689,  coverBg: "from-gray-800 via-slate-900 to-zinc-900",   coverAccent: "text-emerald-300", newRelease: true, description: "A locked room. A dead cryptographer. A code that could change everything." },
  // Romance
  { id: "r1", title: "Before Sunrise",        author: "Sophie Laurent", price: 79,  genre: "Romance",             rating: 4.6, reviewCount: 3421, coverBg: "from-rose-800 via-pink-700 to-orange-600",   coverAccent: "text-rose-200",   bestseller: true,  description: "Two strangers. One magical night in Paris. A love that defies time." },
  { id: "r2", title: "The French Letters",    author: "Amara Chen",     price: 99,  originalPrice: 139, genre: "Romance",             rating: 4.3, reviewCount: 1567, coverBg: "from-pink-700 via-rose-600 to-amber-500",   coverAccent: "text-pink-200",   description: "Love letters from a stranger lead her on a journey across France." },
  { id: "r3", title: "Always You",            author: "Lily Moore",     price: 89,  genre: "Romance",             rating: 4.8, reviewCount: 4502, coverBg: "from-red-800 via-rose-700 to-pink-600",     coverAccent: "text-red-200",    bestseller: true,  description: "Best friends. Secret feelings. One summer that changes everything." },
  { id: "r4", title: "One More Chance",       author: "David Eriksson", price: 109, genre: "Romance",             rating: 4.1, reviewCount: 921,  coverBg: "from-amber-700 via-orange-600 to-rose-700", coverAccent: "text-amber-200",  description: "A second chance at love when he least expects it." },
  { id: "r5", title: "Starlit Promises",      author: "Mei Tanaka",     price: 79,  originalPrice: 119, genre: "Romance",             rating: 4.5, reviewCount: 1890, coverBg: "from-purple-700 via-pink-600 to-rose-500",  coverAccent: "text-purple-200", newRelease: true,  description: "Under the stars of Kyoto, two hearts find their way home." },
  // Sci-Fi
  { id: "s1", title: "Void Protocol",         author: "Kai Nakamura",   price: 129, genre: "Sci-Fi",              rating: 4.6, reviewCount: 2876, coverBg: "from-cyan-900 via-teal-800 to-gray-900",     coverAccent: "text-cyan-300",   bestseller: true,  description: "A signal from deep space. A crew with nothing to lose." },
  { id: "s2", title: "The Last Colony",       author: "Zara Webb",      price: 119, originalPrice: 159, genre: "Sci-Fi",              rating: 4.4, reviewCount: 1654, coverBg: "from-gray-900 via-emerald-900 to-cyan-950", coverAccent: "text-emerald-300", description: "Humanity's last outpost fights for survival on a dying world." },
  { id: "s3", title: "Neon Requiem",          author: "Milo Strand",    price: 99,  genre: "Sci-Fi",              rating: 4.3, reviewCount: 1243, coverBg: "from-violet-900 via-fuchsia-900 to-cyan-900", coverAccent: "text-fuchsia-300", description: "In a neon-soaked city, a hacker uncovers a conspiracy that spans galaxies." },
  { id: "s4", title: "Beyond the Rift",       author: "Priya Rao",      price: 109, genre: "Sci-Fi",              rating: 4.7, reviewCount: 3210, coverBg: "from-teal-900 via-sky-900 to-indigo-950",    coverAccent: "text-sky-300",    bestseller: true,  description: "When reality tears open, she must choose which world to save." },
  { id: "s5", title: "Chrome Hearts",         author: "Alex Volkov",    price: 89,  originalPrice: 129, genre: "Sci-Fi",              rating: 4.1, reviewCount: 567,  coverBg: "from-zinc-800 via-slate-900 to-gray-950",  coverAccent: "text-zinc-300",   newRelease: true,  description: "Can an AI truly love? One android is about to find out." },
  // Fantasy
  { id: "f1", title: "The Iron Crown",        author: "Rowan Blackwood", price: 119, genre: "Fantasy",             rating: 4.8, reviewCount: 5432, coverBg: "from-amber-900 via-yellow-800 to-orange-900", coverAccent: "text-amber-300",  bestseller: true,  description: "A kingdom divided. A prophecy forgotten. A queen who will not kneel." },
  { id: "f2", title: "Ashborn",               author: "Lena Graves",    price: 99,  originalPrice: 149, genre: "Fantasy",             rating: 4.5, reviewCount: 2345, coverBg: "from-orange-900 via-red-900 to-amber-950",   coverAccent: "text-orange-300", description: "Born from fire and ash, she rises to claim her birthright." },
  { id: "f3", title: "The Wandering Wood",    author: "Finn Calloway",  price: 89,  genre: "Fantasy",             rating: 4.3, reviewCount: 1876, coverBg: "from-emerald-900 via-green-800 to-teal-900",  coverAccent: "text-green-300",  description: "The forest has a mind of its own. And it's hungry." },
  { id: "f4", title: "Starfall Kingdom",      author: "Iris Thorne",    price: 129, genre: "Fantasy",             rating: 4.6, reviewCount: 3012, coverBg: "from-indigo-900 via-purple-800 to-violet-900", coverAccent: "text-violet-300", bestseller: true,  description: "When stars fall, magic awakens — and so does an ancient evil." },
  { id: "f5", title: "Dragonsong",            author: "Caspian Reed",   price: 109, originalPrice: 149, genre: "Fantasy",             rating: 4.4, reviewCount: 1567, coverBg: "from-red-900 via-orange-800 to-yellow-900",  coverAccent: "text-yellow-300", newRelease: true,  description: "The last dragon rider must unite a broken world before it's too late." },
  // Thriller
  { id: "t1", title: "The Vanishing Act",     author: "Marcus Black",   price: 99,  genre: "Thriller",            rating: 4.5, reviewCount: 2987, coverBg: "from-gray-900 via-red-950 to-black",         coverAccent: "text-red-400",    bestseller: true,  description: "A magician disappears on stage. This time, it's not a trick." },
  { id: "t2", title: "Dead Drop",             author: "Sasha Petrov",   price: 119, originalPrice: 159, genre: "Thriller",            rating: 4.3, reviewCount: 1432, coverBg: "from-zinc-900 via-gray-800 to-slate-950",   coverAccent: "text-gray-300",   description: "A classified file. A dead agent. Forty-eight hours to find the truth." },
  { id: "t3", title: "The Kill Switch",       author: "Jordan Blake",   price: 109, genre: "Thriller",            rating: 4.6, reviewCount: 3654, coverBg: "from-red-950 via-gray-900 to-zinc-900",      coverAccent: "text-red-300",    bestseller: true,  description: "One button can shut down every system on Earth. Someone just found it." },
  { id: "t4", title: "Blind Spot",            author: "Nina Cross",     price: 89,  genre: "Thriller",            rating: 4.2, reviewCount: 876,  coverBg: "from-slate-950 via-zinc-900 to-gray-900",   coverAccent: "text-slate-300",  description: "She can't remember the last 24 hours. But the blood on her hands is real." },
  { id: "t5", title: "No Exit Point",         author: "Ryan Torres",    price: 129, originalPrice: 169, genre: "Thriller",            rating: 4.4, reviewCount: 1234, coverBg: "from-black via-gray-900 to-red-950",         coverAccent: "text-orange-300", newRelease: true,  description: "Trapped on a train with a killer. No stops for 200 miles." },
  // Historical Fiction
  { id: "h1", title: "The Silk Merchant",     author: "Isabella Romano", price: 109, genre: "Historical Fiction",  rating: 4.7, reviewCount: 4321, coverBg: "from-amber-800 via-yellow-700 to-orange-800", coverAccent: "text-yellow-200", bestseller: true,  description: "Venice, 1492. A merchant's daughter defies her destiny on the Silk Road." },
  { id: "h2", title: "Letters from the Front", author: "William Grey",   price: 99,  originalPrice: 139, genre: "Historical Fiction",  rating: 4.5, reviewCount: 2876, coverBg: "from-stone-800 via-amber-900 to-yellow-900",  coverAccent: "text-stone-300",  description: "Love letters sent from the trenches of WWI that changed two families forever." },
  { id: "h3", title: "The Lighthouse Keeper", author: "Astrid Holm",    price: 89,  genre: "Historical Fiction",  rating: 4.4, reviewCount: 1987, coverBg: "from-sky-900 via-blue-800 to-slate-800",      coverAccent: "text-sky-200",    description: "On a remote island, a keeper guards more than just the light." },
  { id: "h4", title: "Empire of Dust",        author: "Omar Hassan",    price: 129, genre: "Historical Fiction",  rating: 4.6, reviewCount: 3210, coverBg: "from-yellow-900 via-amber-800 to-orange-900",  coverAccent: "text-amber-200",  bestseller: true,  description: "The rise and fall of a dynasty told through the eyes of a scribe." },
  { id: "h5", title: "The Cartographer's Wife", author: "Helena Park",  price: 119, originalPrice: 159, genre: "Historical Fiction",  rating: 4.3, reviewCount: 1456, coverBg: "from-emerald-800 via-teal-700 to-cyan-800",    coverAccent: "text-teal-200",   newRelease: true,  description: "She mapped uncharted lands while her husband took the credit. Until now." },
];

export const genres: Genre[] = ["Mystery", "Romance", "Sci-Fi", "Fantasy", "Thriller", "Historical Fiction"];

export const genreColors: Record<Genre, string> = {
  Mystery:             "bg-genre-mystery",
  Romance:             "bg-genre-romance",
  "Sci-Fi":            "bg-genre-scifi",
  Fantasy:             "bg-genre-fantasy",
  Thriller:            "bg-genre-thriller",
  "Historical Fiction": "bg-genre-historical",
};

// Legacy exports used in Supabase config logic
export const BOOKS = books;
export const GENRES = ["All", ...genres] as const;
export type GenreFilter = typeof GENRES[number];
