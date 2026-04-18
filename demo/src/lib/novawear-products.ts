export type NovaWearCategory = "womens" | "mens" | "sale";

export interface NovaWearProduct {
  id: string;
  name: string;
  category: NovaWearCategory;
  price: number;
  originalPrice?: number;
  badge?: string;
  color: string;
  accentColor: string;
}

export const NOVAWEAR_PRODUCTS: NovaWearProduct[] = [
  // Women's
  { id: "nw-01", name: "Merino Wrap Coat",       category: "womens", price: 2890, color: "#8B7355", accentColor: "#6B5535" },
  { id: "nw-02", name: "Linen Slip Dress",        category: "womens", price: 1290, color: "#D4C4B0", accentColor: "#B0A090" },
  { id: "nw-03", name: "Oversized Blazer",        category: "womens", price: 2190, color: "#2C2C2C", accentColor: "#1A1A1A", badge: "New" },
  { id: "nw-04", name: "Wide-Leg Trousers",       category: "womens", price: 1490, color: "#6B6B6B", accentColor: "#4A4A4A" },
  { id: "nw-05", name: "Cashmere Turtleneck",     category: "womens", price: 1890, color: "#C4B49A", accentColor: "#A09070" },
  { id: "nw-06", name: "Tailored Midi Skirt",     category: "womens", price: 1190, color: "#4A4A4A", accentColor: "#2E2E2E" },
  // Men's
  { id: "nw-07", name: "Unstructured Suit Jacket",category: "mens",   price: 3290, color: "#3D3D3D", accentColor: "#1E1E1E" },
  { id: "nw-08", name: "Heavy Linen Shirt",       category: "mens",   price: 990,  color: "#E8E0D0", accentColor: "#C8C0B0" },
  { id: "nw-09", name: "Leather Belt",            category: "mens",   price: 690,  color: "#5C4033", accentColor: "#3C2013", badge: "Limited" },
  { id: "nw-10", name: "Straight Chinos",         category: "mens",   price: 1290, color: "#9E8E7A", accentColor: "#7E6E5A" },
  { id: "nw-11", name: "Merino Crewneck",         category: "mens",   price: 1590, color: "#1C1C1C", accentColor: "#0A0A0A" },
  { id: "nw-12", name: "Suede Chelsea Boots",     category: "mens",   price: 2890, color: "#704214", accentColor: "#4A2800" },
  // Sale
  { id: "nw-13", name: "Silk Blouse",             category: "sale",   price: 790,  originalPrice: 1590, color: "#C8B89A", accentColor: "#A89878" },
  { id: "nw-14", name: "Cargo Trousers",          category: "sale",   price: 890,  originalPrice: 1890, color: "#7A7A6A", accentColor: "#5A5A4A" },
  { id: "nw-15", name: "Knit Vest",               category: "sale",   price: 590,  originalPrice: 1190, color: "#B8A898", accentColor: "#988878" },
  { id: "nw-16", name: "Canvas Tote",             category: "sale",   price: 390,  originalPrice: 790,  color: "#4A3D35", accentColor: "#2A1D15" },
];
