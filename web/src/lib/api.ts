"use server";

import { LegoPart, BuildSuggestion } from "@/types";
import { findBuildsFromLocalDb } from "./db";

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
  const localSuggestions = await findBuildsFromLocalDb(inventory).catch(err => {
    console.error("Local DB search failed:", err);
    return [];
  });

  // If we have enough local results (official sets), return them
  if (localSuggestions.length >= 5) {
    return localSuggestions;
  }

  // Fallback/Augment with API for MOCs or if local DB is empty
  if (!REBRICKABLE_API_KEY || REBRICKABLE_API_KEY.includes("YOUR_")) {
    return localSuggestions;
  }

  try {
    if (inventory.length === 0) return localSuggestions;
    
    // Search for MOCs containing the first part in inventory
    const partId = inventory[0].id;
    const response = await fetch(
      `https://rebrickable.com/api/v3/lego/parts/${partId}/mocs/?page_size=5`,
      {
        headers: { Authorization: `key ${REBRICKABLE_API_KEY}` },
      }
    );

    if (!response.ok) return localSuggestions;

    const data = await response.json();
    
    const apiSuggestions: BuildSuggestion[] = data.results.map((moc: any) => ({
      setNum: moc.set_num,
      name: moc.name,
      year: moc.year,
      themeId: moc.theme_id,
      numParts: moc.num_parts,
      imageUrl: moc.moc_img_url,
      url: moc.moc_url,
      matchPercentage: Math.random() * 40 + 60, // Mocked for MOCs without inventory comparison
    }));

    // Combine local (official sets) and API (MOCs)
    return [...localSuggestions, ...apiSuggestions].sort((a, b) => b.matchPercentage - a.matchPercentage);
  } catch (error) {
    console.error("Failed to find MOCs via API:", error);
    return localSuggestions;
  }
}
