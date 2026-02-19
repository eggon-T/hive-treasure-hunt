import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { GAME_CONFIG } from "./game-config";

// Generic Firestore document reader
const getData = async (collection, document) => {
  const docRef = doc(db, collection, document);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Load user game state — returns { level, userName, completed }
const handleData = async (email) => {
  const userData = await getData(GAME_CONFIG.COLLECTION.USERS, email);
  if (!userData) return null;

  // Determine current level from qr1–qr6 booleans
  let currentLevel = 1;
  for (let i = 1; i <= GAME_CONFIG.TOTAL_LEVELS; i++) {
    if (userData[`qr${i}`] === true) {
      currentLevel = i + 1;
    } else {
      break;
    }
  }

  // Check if game is completed (all QRs scanned)
  const completed = currentLevel > GAME_CONFIG.TOTAL_LEVELS;

  return {
    level: completed ? GAME_CONFIG.TOTAL_LEVELS : currentLevel,
    userName: userData.name || "",
    completed,
    startTime: userData.startTime,
    stopTime: userData.stopTime,
    timeTaken: userData.timeTaken,
  };
};

// Mark a QR code as scanned. If it's the last one, also set stopTime and timeTaken.
const markQRScanned = async (email, qrNumber) => {
  const userRef = doc(db, GAME_CONFIG.COLLECTION.USERS, email);
  const updateData = {
    [`qr${qrNumber}`]: true,
  };

  // If this is the last QR, calculate completion time
  if (qrNumber === GAME_CONFIG.TOTAL_LEVELS) {
    const userData = await getData(GAME_CONFIG.COLLECTION.USERS, email);
    if (userData && userData.startTime) {
      const stopTime = new Date();
      const startMs = userData.startTime.toDate
        ? userData.startTime.toDate().getTime()
        : new Date(userData.startTime).getTime();
      const timeTakenMinutes = (stopTime.getTime() - startMs) / (1000 * 60);

      updateData.stopTime = stopTime;
      updateData.timeTaken = Math.round(timeTakenMinutes * 100) / 100; // 2 decimal places
    }
  }

  await updateDoc(userRef, updateData);
};

export {
  getData,
  handleData,
  markQRScanned,
};
