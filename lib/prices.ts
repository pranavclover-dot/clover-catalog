export interface ProductPrice {
  name: string;
  price: number;   // Column L — F.D.C. (our price)
  mrp: number;     // Column AH — MRP (strikethrough)
  rp: number;      // Column AE — RP
  size: string;
  fabric: string;
}

export const PRICES: Record<string, ProductPrice> = {
  "CLVONL01": { name: "Sabarmati", price: 239, mrp: 999, rp: 347, size: `90"x100"`, fabric: "Heavy Soft Glace Cotton" },
  "CLVONL02": { name: "Sabarmati", price: 239, mrp: 999, rp: 347, size: `90"x100"`, fabric: "Heavy Soft Glace Cotton" },
  "CLVONL03": { name: "Sabarmati", price: 239, mrp: 999, rp: 347, size: `90"x100"`, fabric: "Heavy Soft Glace Cotton" },
  "CLVONL04": { name: "Sabarmati", price: 239, mrp: 999, rp: 347, size: `90"x100"`, fabric: "Heavy Soft Glace Cotton" },
  "CLVONL05": { name: "Sabarmati", price: 239, mrp: 999, rp: 347, size: `90"x100"`, fabric: "Heavy Soft Glace Cotton" },
  "CLVONL06": { name: "Sabarmati", price: 239, mrp: 999, rp: 347, size: `90"x100"`, fabric: "Heavy Soft Glace Cotton" },
  "CLVONL10": { name: "Mahanadi", price: 286, mrp: 1299, rp: 414, size: `90"x100"`, fabric: "Super Heavy Soft Glace Cotton" },
  "CLVONL11": { name: "Mahanadi", price: 286, mrp: 1299, rp: 414, size: `90"x100"`, fabric: "Super Heavy Soft Glace Cotton" },
  "CLVONL12": { name: "Mahanadi", price: 286, mrp: 1299, rp: 414, size: `90"x100"`, fabric: "Super Heavy Soft Glace Cotton" },
  "CLVONL13": { name: "Mahanadi", price: 286, mrp: 1299, rp: 414, size: `90"x100"`, fabric: "Super Heavy Soft Glace Cotton" },
  "CLVONL14": { name: "Mahanadi", price: 286, mrp: 1299, rp: 414, size: `90"x100"`, fabric: "Super Heavy Soft Glace Cotton" },
  "CLVONL15": { name: "Mahanadi", price: 286, mrp: 1299, rp: 414, size: `90"x100"`, fabric: "Super Heavy Soft Glace Cotton" },
  "CLVONL16": { name: "Tapti", price: 278, mrp: 1299, rp: 403, size: `90"x100"`, fabric: "Soft Glace Cotton" },
  "CLVONL17": { name: "Tapti", price: 278, mrp: 1299, rp: 403, size: `90"x100"`, fabric: "Soft Glace Cotton" },
  "CLVONL18": { name: "Tapti", price: 278, mrp: 1299, rp: 403, size: `90"x100"`, fabric: "Soft Glace Cotton" },
  "CLVONL19": { name: "Tapti", price: 278, mrp: 1299, rp: 403, size: `90"x100"`, fabric: "Soft Glace Cotton" },
  "CLVONL20": { name: "Tapti", price: 278, mrp: 1299, rp: 403, size: `90"x100"`, fabric: "Soft Glace Cotton" },
  "CLVONL21": { name: "Tapti", price: 278, mrp: 1299, rp: 403, size: `90"x100"`, fabric: "Soft Glace Cotton" },
  "CLVONL22": { name: "Godavari", price: 348, mrp: 1299, rp: 504, size: `100"x108"`, fabric: "Soft Glace Cotton" },
  "CLVONL23": { name: "Godavari", price: 348, mrp: 1299, rp: 504, size: `100"x108"`, fabric: "Soft Glace Cotton" },
  "CLVONL24": { name: "Godavari", price: 348, mrp: 1299, rp: 504, size: `100"x108"`, fabric: "Soft Glace Cotton" },
  "CLVONL25": { name: "Godavari", price: 348, mrp: 1299, rp: 504, size: `100"x108"`, fabric: "Soft Glace Cotton" },
  "CLVONL26": { name: "Godavari", price: 348, mrp: 1299, rp: 504, size: `100"x108"`, fabric: "Soft Glace Cotton" },
  "CLVONL27": { name: "Godavari", price: 348, mrp: 1299, rp: 504, size: `100"x108"`, fabric: "Soft Glace Cotton" },
};
