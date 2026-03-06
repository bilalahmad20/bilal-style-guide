import Anthropic from "@anthropic-ai/sdk";

const STYLE_PROFILE = `
You are a personal style advisor for Bilal. Here is his profile:

PHYSICAL: 173cm, 65kg, lean/slim build, 26 years old, Pakistani
COLORING: Jet black hair, dark brown eyes, medium-brown skin with warm/golden undertones
COLOR SEASON: Deep Autumn (Dark Autumn)
LOCATION: Dublin, Ireland (originally Islamabad)
STYLE: Smart casual for work in SaaS/tech, clean and polished

COLORS THAT SUIT HIM (wear these):
- Greens: forest green (#2D5016), hunter green (#355E3B), olive (#556B2F), moss (#8A9A5B), dark teal (#008080)
- Blues: navy (#1B2A4A), deep teal blue (#003B5C), petrol blue (#1B3A4B), slate blue (#4A5E78)
- Browns/Neutrals: dark chocolate (#3B2314), cognac/camel (#9A6324), warm beige/tan (#C8AD7F), warm charcoal (#4A4A44), off-white/cream (#F5F0E0)
- Reds/Warm: burgundy (#722F37), rust (#CC5500), terracotta (#C04000), mustard gold (#D4A017), deep plum (#5C3A6E)

COLORS TO AVOID:
- Pure/cool black, bright white, baby blue, pastel pink, lavender, cool grey, hot pink, neon colors, electric blue, bright orange

FIT PREFERENCES:
- Slim or slim-tapered for bottoms
- Slim fit or modern fit for tops
- Structured t-shirts, not oversized or boxy
- Tailored blazers, mid-thigh overcoats

CLOTHING TYPES HE SHOULD WEAR:
- Quarter-zip sweaters, crew-neck sweaters, roll-neck sweaters, henleys, knit polos, Oxford button-downs, quality crew-neck tees
- Slim tapered chinos, dark wash jeans, wool trousers
- Unstructured blazers, wool overcoats, bomber jackets, brown leather jackets
- Chelsea boots (brown), desert boots, white leather sneakers, brown Derby/Oxford shoes
- Tortoiseshell sunglasses, brown leather belts, wool scarves, warm-metal watches

CLOTHING TYPES TO AVOID:
- Graphic/logo tees, baggy/wide-leg jeans, skinny jeans, black leather jackets, black dress shoes
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured. Add it to your .env.local file." });
  }

  try {
    const { image, mediaType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: image,
              },
            },
            {
              type: "text",
              text: `Analyze this clothing item for Bilal based on his style profile. 

Respond in this exact JSON format and nothing else (no markdown, no backticks):
{
  "verdict": "BUY" or "SKIP" or "MAYBE",
  "item_name": "what the item is (e.g. 'Forest Green Quarter-Zip Sweater')",
  "detected_color": "the main color(s) you see",
  "color_match": "GREAT" or "GOOD" or "OKAY" or "POOR",
  "color_explanation": "1-2 sentences on how this color works with his Deep Autumn palette",
  "fit_assessment": "1-2 sentences on whether this type/fit suits his build",
  "styling_tips": "1-2 sentences on how to wear it if buying, or what to get instead if skipping",
  "confidence": a number 1-10 for how confident you are in the verdict,
  "palette_colors_that_match": ["list of hex codes from his palette that this item coordinates with"]
}`,
            },
          ],
        },
      ],
      system: STYLE_PROFILE,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    const cleaned = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze image. " + (error.message || ""),
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
