export const CATEGORIES: Record<string, string> = {
  Bedsheets:
    "Clover bedsheets come in 7 fabric tiers — from Poly Cotton to Super Heavy Soft Glace Cotton — covering all standard sizes: 60\"×90\" (single), 90\"×90\" and 90\"×100\" (double), and king-size fitted variants. Online-range sheets are available in 150 GSM and 180 GSM. All priced at factory rate — typically 35–40% below MRP — and best sold as 1+2 or 2+2 combos.",

  "Gift Sets":
    "Clover gift sets come in 4-piece, 5-piece, and 6-piece configurations — starting with the standard 1 comforter + 1 sheet + 2 pillow covers, going up to full king-size and kids' digital-print sets. Price range is ₹525 to ₹21,800, making them the right pick for weddings, Diwali, and festival gifting. Factory pricing keeps them 40–50% below what a showroom charges for the same construction.",

  Curtains:
    "Clover curtains are available in 32+ fabric types — from basic Tissue Solid and Polyester Print to Velvet, Jacquard, Linen, Heavy Blackout, and Embroidery Tissue. Standard heights are 5 ft, 7 ft, and 9 ft, with made-to-order sizing available. Price range is ₹100 to ₹3,300 per piece. Custom size, fabric of your choice, factory-direct — no middleman markup.",

  Towels:
    "Clover towels cover bath and hand towel formats — in standard, popcorn texture, check, and hotel-grade white — available in weights from 350g to 1000g per piece. Price range is ₹40 to ₹2,700. Best sold in sets of 6 or 12 for retail, and by weight grade for hotel and hospital supply.",

  "Cushion Covers":
    "Clover cushion covers are available in standard sizes — 16\"×16\", 24\"×24\", and 12\"×24\" bolster — across 100+ designs including Sitara Jaal, Linen Flower, Zari Patta, and more. Price range is ₹45 to ₹670. Best sold in pairs or sets of 5, and a natural add-on to any bedsheet or dohar purchase.",

  "Door Mats":
    "Clover door mats and rugs come in 250+ SKUs — from small 50×80 cm entry doormats to 120×180 cm room rugs and 50×150 cm runners. Types include Pitloom, knitted, fur, water-absorbent, and printed character designs. Price range is ₹40 to ₹4,600. Factory pricing makes even the full-size room rugs practical, not just decorative.",

  "Sofa Panels":
    "Clover sofa panels are available in Ultrasonic, Eco, Embroidery, Rabbit Fur, Ombre, Bubble Fur, and Lotus finishes — around 35 SKUs at ₹100 to ₹500. Designed to refresh an existing sofa without replacing it. A quick, low-cost way to change the look of a drawing room.",

  "Online Bedsheets":
    "Clover's online-range bedsheets are available in Heavy Soft Glace Cotton and Super Heavy Soft Glace Cotton fabrics — 150 GSM and 180 GSM — in double bed size (90\"×100\") with pillow covers in 18\"×28\" or 20\"×30\". MRP ₹999–₹1,299. Packed for shipping at under 1 kg, with exact dimensions listed per SKU for e-commerce listings.",

  Pillows:
    "Clover pillows come in two clear tiers — poly-fill fiber pillows (₹100–₹350) for everyday use and combo bundling, and memory foam pillows (₹1,000–₹2,700) in contour, wedge, gel, and baby variants. The memory foam range includes specialty shapes for kids. Each tier is priced at factory rate, well below what pharmacy and furniture stores charge for the same foam grade.",

  Dohars:
    "Clover dohars are available in 3-layer construction — fabric + fiber + fabric, or fabric + maslin + fabric — in single and double bed sizes. Fabric options range from Fine Cotton and Muslin to Luxury Cotton sets. Price range is ₹315 to ₹5,800. Best sold as a set: 1 dohar + 1 sheet + 2 pillow covers — the natural summer bed unit.",

  Mattresses:
    "Clover mattresses are available in bonded foam, ortho bond (bonded + HR foam + memory foam), and pocket spring variants — in thicknesses from 4\" to 12\". Warranty ranges from 2+5 years to 3+10 years depending on the series. Price range is ₹110 to ₹2,020. The thickness ladder makes in-store upsell straightforward — customers move from entry to mid naturally once they see the difference.",

  Blankets:
    "Clover blankets span from entry Mink (1.1–5 kg, ₹201/kg) to mid-range Wammy, Snuggy, and Pulpy Plush (₹230–₹275/kg) to premium Velvet Touch and Mushy Silk (₹319–₹398/kg). Full double-bed luxury variants — Fushion, Victoria, Versache — are sold as complete units at ₹3,000–₹3,500. Most blankets are priced per kilogram. Kids' prints (Chhota Bheem, Motu) are available at ₹50–₹70/kg.",

  "Charity Blankets":
    "Clover's charity blanket range covers polar fleece and non-woven blankets in 350g to 1100g weights — available at ₹140 to ₹570 MRP. Designed for bulk orders: NGO winter drives, corporate CSR programs, and government tenders. Per-piece pricing is available on bulk quantity; minimum order quantities apply.",

  Baskets:
    "Clover baskets are available in Jute, Kite, Matka, Laundry, Dry Fruit, and decorative styles — around 25 SKUs at ₹70 to ₹1,540. Useful as gifting containers, festival hampers, or standalone home utility buys. A natural add-on during Diwali and wedding season, especially paired with towel sets or dohar combos.",

  Stools:
    "Clover stools come in 9mm and 12mm MDF and ply-top constructions with decorated and metallic leg variants — named after Indian instruments: Bansuri, Tabla, Sitar, Dholak, and more. Kids' variants available. Price range is ₹1,270 to ₹4,520 MRP. A practical cross-sell for customers furnishing a bedroom, kids' room, or dressing area — at a fraction of furniture-store pricing.",

  Comforters: "",
  Rugs: "",
  "Top Sheets": "",
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES).sort();

/** Maps each category to its product photo in /public */
export const CATEGORY_PHOTO: Record<string, string> = {
  "Bedsheets":        "/Bedsheet.png",
  "Gift Sets":        "/Gift Sets.png",
  "Curtains":         "/Curtain.png",
  "Cushion Covers":   "/Cushion Covers.png",
  "Door Mats":        "/Doormats.png",
  "Sofa Panels":      "/Sofa Panel.png",
  "Online Bedsheets": "/Online Bedsheets.png",
  "Pillows":          "/Pillows.png",
  "Dohars":           "/Dohar.png",
  "Mattresses":       "/Mattresses.png",
  "Blankets":         "/Blankets.png",
  "Charity Blankets": "/Donation blanket.png",
  "Hotel Linens":     "/Hotel Linens.png",
};
