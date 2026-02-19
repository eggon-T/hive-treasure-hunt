export const GAME_CONFIG = {
  // The characters representing the levels/stations in the hunt.
  // Customize these to match your specific QR code IDs / path keys.
  LEVEL_KEYS: "abcdefg", 
  
  // Firestore Collection Names
  COLLECTION: {
    USERS: "users",
    HINTS: "hint", // Collection containing the riddles/clues
    QUESTIONS: "Questions", // Collection containing questions (if used)
  },

  // Total number of levels (should match number of QR codes)
  TOTAL_LEVELS: 6,
};
