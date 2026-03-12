export interface LegoPart {
  id: string; // The Brickognize/Rebrickable Part ID
  name: string;
  colorId?: number;
  colorName?: string;
  quantity: number;
  imageUrl?: string;
  confidence?: number;
}

export interface BuildSuggestion {
  setNum: string;
  name: string;
  year: number;
  themeId: number;
  numParts: number;
  imageUrl: string;
  url: string;
  matchPercentage: number;
}
