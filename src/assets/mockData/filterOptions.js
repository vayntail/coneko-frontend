//Folder Structure for the data-
// src/assets/mockData/filterOptions.js

// Platform options
//Patrick Shush, older consoles is for BackEnd
export const platformOptions = [
  { value: "pc", label: "PC" },
  { value: "ps5", label: "PlayStation 5" },
  { value: "ps4", label: "PlayStation 4" },
  { value: "xbox_series", label: "Xbox Series X/S" },
  { value: "xbox_one", label: "Xbox One" },
  { value: "switch", label: "Nintendo Switch" },
  { value: "mobile", label: "Mobile" },
];

// Genre options
export const genreOptions = [
  { value: "fps", label: "FPS" },
  { value: "moba", label: "MOBA" },
  { value: "rpg", label: "RPG" },
  { value: "mmorpg", label: "MMORPG" },
  { value: "battle_royale", label: "Battle Royale" },
  { value: "strategy", label: "Strategy" },
  { value: "sports", label: "Sports" },
  { value: "racing", label: "Racing" },
  { value: "card", label: "Card Games" },
  { value: "fighting", label: "Fighting" },
  { value: "adventure", label: "Adventure" },
  { value: "simulation", label: "Simulation" },
  { value: "party", label: "Party Games" },
];

// Region options
export const regionOptions = [
  { value: "na", label: "North America" },
  { value: "eu", label: "Europe" },
  { value: "sa", label: "South America" },
  { value: "as", label: "Asia" },
  { value: "oc", label: "Oceania" },
  { value: "af", label: "Africa" },
];

// Group size options
export const groupSizeOptions = [
  { value: "any", label: "Any Group Size" },
  { value: "small", label: "Small (1-2 players)" },
  { value: "medium", label: "Medium (3-5 players)" },
  { value: "large", label: "Large (6+ players)" },
];

// Custom tag options (At this stage of the project we'll create the custom tags)
export const customTagOptions = [
  { value: "mic", label: "Has Microphone" },
  { value: "competitive", label: "Competitive" },
  { value: "casual", label: "Casual" },
  { value: "beginner_friendly", label: "Beginner Friendly" },
  { value: "experienced", label: "Experienced Players" },
  { value: "tournament", label: "Tournament" },
  { value: "ranked", label: "Ranked Play" },

  // Role-based tags that exist in most games
  { value: "tank", label: "Tank" },
  { value: "healer", label: "Healer/Support" },
  { value: "dps", label: "DPS/Damage" },
  { value: "controller", label: "Controller" },
  { value: "initiator", label: "Initiator" },
  { value: "strategist", label: "Strategist" },
];
