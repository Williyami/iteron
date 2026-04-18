const A = "https://raw.githubusercontent.com/wilhelmomnell/novawear-e-commerce-design/main/src/assets";

export type NovaWearGender = "Women" | "Men" | "Unisex";

export interface NovaWearProduct {
  id: string;
  name: string;
  gender: NovaWearGender;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
}

export const NOVAWEAR_PRODUCTS: NovaWearProduct[] = [
  // Women
  { id: "atlas-trench",     name: "Atlas Wool Trench",            gender: "Women",  price: 489, image: `${A}/product-coat.jpg`,           isNew: true },
  { id: "ovo-knit",         name: "Ovo Cashmere Knit",            gender: "Women",  price: 245, image: `${A}/product-knit.jpg`,           isNew: true },
  { id: "ines-blazer",      name: "Inès Single-Breasted Blazer",  gender: "Women",  price: 365, image: `${A}/product-blazer-women.jpg`,   isNew: true },
  { id: "lyre-slip-dress",  name: "Lyre Silk Slip Dress",         gender: "Women",  price: 285, image: `${A}/product-dress-slip.jpg`,     isNew: true },
  { id: "isla-sandal",      name: "Isla Leather Sandal",          gender: "Women",  price: 245, image: `${A}/product-sandals.jpg`,        isNew: true },
  { id: "sable-wrap-dress", name: "Sable Silk Wrap Dress",        gender: "Women",  price: 325, image: `${A}/product-wrap-dress.jpg`,     isNew: true },
  { id: "ines-pump",        name: "Inès Pointed Leather Pump",    gender: "Women",  price: 295, image: `${A}/product-pumps.jpg`,          isNew: true },
  { id: "rae-biker",        name: "Rae Leather Biker Jacket",     gender: "Women",  price: 595, image: `${A}/product-leather-jacket.jpg`, isNew: true },
  { id: "linde-trousers",   name: "Linde Wide-Leg Trouser",       gender: "Women",  price: 138, originalPrice: 198, image: `${A}/product-trousers.jpg` },
  { id: "vela-skirt",       name: "Vela Pleated Midi Skirt",      gender: "Women",  price: 107, originalPrice: 178, image: `${A}/product-skirt.jpg` },
  { id: "ada-jeans",        name: "Ada High-Rise Jean",           gender: "Women",  price: 119, originalPrice: 158, image: `${A}/product-jeans-women.jpg` },
  { id: "noma-tshirt",      name: "Noma Cotton Tee",              gender: "Women",  price: 54,  originalPrice: 68,  image: `${A}/product-tshirt.jpg` },
  { id: "mira-blouse",      name: "Mira Silk Blouse",             gender: "Women",  price: 168, image: `${A}/product-blouse.jpg` },
  { id: "lila-cardigan",    name: "Lila Oversized Cardigan",      gender: "Women",  price: 285, image: `${A}/product-cardigan.jpg` },
  { id: "remy-cropped",     name: "Remy Cropped Wool Trouser",    gender: "Women",  price: 215, image: `${A}/product-cropped-trousers.jpg` },
  // Men
  { id: "vance-blazer",     name: "Vance Double-Breasted Blazer", gender: "Men",    price: 525, image: `${A}/product-blazer-men.jpg`,     isNew: true },
  { id: "halden-shirt",     name: "Halden Oxford Shirt",          gender: "Men",    price: 145, image: `${A}/product-shirt-men.jpg`,      isNew: true },
  { id: "milan-loafer",     name: "Milan Penny Loafer",           gender: "Men",    price: 425, image: `${A}/product-loafers.jpg`,        isNew: true },
  { id: "holt-overcoat",    name: "Holt Wool Overcoat",           gender: "Men",    price: 685, image: `${A}/product-overcoat-men.jpg`,   isNew: true },
  { id: "soren-derby",      name: "Søren Leather Derby",          gender: "Men",    price: 445, image: `${A}/product-derby-men.jpg`,      isNew: true },
  { id: "kaden-parka",      name: "Kaden Field Parka",            gender: "Men",    price: 319, originalPrice: 425, image: `${A}/product-parka.jpg` },
  { id: "rune-tshirt",      name: "Rune Heavyweight Tee",         gender: "Men",    price: 55,  originalPrice: 78,  image: `${A}/product-tshirt-men.jpg` },
  { id: "yves-knit",        name: "Yves Merino Crewneck",         gender: "Men",    price: 195, image: `${A}/product-knit-men.jpg` },
  { id: "cole-denim",       name: "Cole Selvedge Denim",          gender: "Men",    price: 215, image: `${A}/product-jeans-men.jpg` },
  { id: "oslo-trouser",     name: "Oslo Tailored Trouser",        gender: "Men",    price: 225, image: `${A}/product-trousers-men.jpg` },
  { id: "rio-bomber",       name: "Rio Leather Bomber",           gender: "Men",    price: 545, image: `${A}/product-bomber-men.jpg` },
  { id: "noel-henley",      name: "Noel Linen Henley Shirt",      gender: "Men",    price: 135, image: `${A}/product-henley-men.jpg` },
  // Accessories / Unisex
  { id: "siena-scarf",      name: "Siena Wool Scarf",             gender: "Unisex", price: 165, image: `${A}/product-scarf.jpg`,          isNew: true },
  { id: "mercer-watch",     name: "Mercer Field Watch",           gender: "Unisex", price: 365, image: `${A}/product-watch.jpg`,          isNew: true },
  { id: "tully-crossbody",  name: "Tully Leather Crossbody",      gender: "Unisex", price: 285, image: `${A}/product-crossbody.jpg` },
  { id: "fjord-beanie",     name: "Fjord Ribbed Cashmere Beanie", gender: "Unisex", price: 95,  image: `${A}/product-beanie.jpg` },
  { id: "orion-belt",       name: "Orion Woven Leather Belt",     gender: "Unisex", price: 88,  originalPrice: 135, image: `${A}/product-belt.jpg` },
  { id: "noma-sunglasses",  name: "Noma Acetate Sunglasses",      gender: "Unisex", price: 185, image: `${A}/product-sunglasses.jpg` },
  { id: "court-sneaker",    name: "Court Leather Sneaker",        gender: "Unisex", price: 215, image: `${A}/product-sneakers.jpg`,       isNew: true },
];
