"use server";

import { LegoPart, BuildSuggestion } from "@/types";

const REBRICKABLE_API_KEY = process.env.REBRICKABLE_API_KEY;
const BRICKOGNIZE_API_URL = process.env.BRICKOGNIZE_API_URL || "https://api.brickognize.com/predict/";

export async function identifyLegoPiece(formData: FormData): Promise<LegoPart | null> {
  try {
    const imageFile = formData.get("query_image") as File;
    if (!imageFile) return null;

    const brickognizeFormData = new FormData();
    brickognizeFormData.append("query_image", imageFile);

    const response = await fetch(BRICKOGNIZE_API_URL, {
      method: "POST",
      body: brickognizeFormData,
    });

    if (!response.ok) {
      console.error("Brickognize API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    const topCandidate = data.items?.[0];

    if (!topCandidate) return null;

    // Map Brickognize response to our LegoPart type
    // Brickognize typically returns id, name, external_ids (rebrickable, bricklink, etc.)
    const rebrickableId = topCandidate.external_ids?.rebrickable || topCandidate.id;

    return {
      id: rebrickableId,
      name: topCandidate.name || "Unknown Part",
      quantity: 1,
      imageUrl: topCandidate.img_url || topCandidate.image_url || "",
      confidence: topCandidate.score || 1.0,
    };
  } catch (error) {
    console.error("Identification failed:", error);
    return null;
  }
}

export async function findBuildSuggestions(inventory: LegoPart[]): Promise<BuildSuggestion[]> {
  // If no Rebrickable key, return mock data
  if (!REBRICKABLE_API_KEY || REBRICKABLE_API_KEY.includes("YOUR_")) {
    console.warn("No Rebrickable API key found. Returning mock data.");
    return [
      {
        setNum: '10696-1',
        name: 'Medium Creative Brick Box (Mock)',
        year: 2015,
        themeId: 1,
        numParts: 484,
        imageUrl: 'https://cdn.rebrickable.com/media/sets/10696-1.jpg',
        url: 'https://rebrickable.com/sets/10696-1/',
        matchPercentage: 85
      },
    ];
  }

  try {
    // Real implementation logic:
    // Without a user token, we can't easily use the build engine.
    // A simple approach for a prototype: search for sets/MOCs containing the FIRST part in inventory
    // and see how many other parts they have.
    
    if (inventory.length === 0) return [];
    
    const partId = inventory[0].id;
    const response = await fetch(
      `https://rebrickable.com/api/v3/lego/parts/${partId}/sets/`,
      {
        headers: { Authorization: `key ${REBRICKABLE_API_KEY}` },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    
    // Map Rebrickable sets to our BuildSuggestion type
    return data.results.slice(0, 5).map((set: any) => ({
      setNum: set.set_num,
      name: set.name,
      year: set.year,
      themeId: set.theme_id,
      numParts: set.num_parts,
      imageUrl: set.set_img_url,
      url: `https://rebrickable.com/sets/${set.set_num}/`,
      matchPercentage: Math.random() * 50 + 50, // Mocked percentage for now
    }));
  } catch (error) {
    console.error("Failed to find builds:", error);
    return [];
  }
}
