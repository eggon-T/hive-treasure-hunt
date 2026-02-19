import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { GAME_CONFIG } from "./game-config";

// To collect data from a document
const getData = async (collection, document) => {
  const docRef = doc(db, collection, document);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};
//To create random pathway for each user
const shuffle = (inputString) => {
  const array = inputString.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  // make the last path fixed
  return array.join("") + "h";
};
const FALLBACK_HINTS = {
  a: "Where silence lives among knowledge infinite, Find the place where books illuminate minds.",
  b: "Where minds recharge and conversations flow, Find the place where hunger disappears.",
  c: "Where competition meets teamwork. Find the court where baskets decide victory.",
  d: "Where the ball flies above the net. Find the court of spikes and serves.",
  e: "Where protection and observation never rest. Find the room that guards everything.",
  f: "The final destination stands tall and wide, Find the structure beneath the open sky.",
  g: "The final destination stands tall and wide, Find the structure beneath the open sky.", // Fallback for g if needed
};

// To fetch hint from firebase based on pathway
const handleData = async (email) => {
  // const hint = await getData("Questions", "hint");
  const userData = await getData(GAME_CONFIG.COLLECTION.USERS, email);
  if (!userData) return null;

  const newPath = userData.path;

  // If user completed the game, then goto completion page and obtain completion time
  if (userData[newPath[GAME_CONFIG.TOTAL_LEVELS]] === true) {
    try {
      const washingtonRef = doc(db, GAME_CONFIG.COLLECTION.USERS, email);
      const endTime = new Date().getTime();
      const startTime = userData.startTime.seconds;
      const totalTime = endTime / 1000 - startTime;
      await updateDoc(washingtonRef, {
        endTime: endTime,
        completionTime: totalTime/60,
      });
      const obj = {
        Name: userData.name,
        Email: email,
        StartTime: startTime,
        EndTime: endTime / 1000,
        CompletionTime: totalTime,
      };
      return obj;
    } catch (err) {
      return { hint: "Not available", level: "Cant find" };
    }
  }

  // Collect all hints up to current level
  const hintsToFetch = [];
  let currentLevelIndex = -1;

  for (let i = 0; i < GAME_CONFIG.TOTAL_LEVELS; i++) {
    let c = newPath[i];
    if (userData[c] === true) {
        hintsToFetch.push({ c, level: i + 1, status: 'completed' });
    } else if (userData[c] === false) {
        hintsToFetch.push({ c, level: i + 1, status: 'active' });
        currentLevelIndex = i;
        break; // Stop at current level
    }
  }

  // Fetch hints in parallel
  const hintResults = await Promise.all(
    hintsToFetch.map(async (item) => {
      let data = await getData(GAME_CONFIG.COLLECTION.HINTS, item.c);
      if (!data) {
        // Use fallback data if DB is empty
        const fallbackText = FALLBACK_HINTS[item.c] || `[SIGNAL LOST]`;
        data = {
          h: fallbackText,
          qr: `placeholder-${item.c}`,
        };
      }
      return { ...data, ...item };
    })
  );

  if (currentLevelIndex !== -1) {
    const currentHintObj = hintResults[hintResults.length - 1];
    const obj = { 
      hint: currentHintObj, 
      allHints: hintResults, 
      level: currentLevelIndex + 1, 
      userName: userData.name, 
      path: newPath 
    };
    return obj;
  }
};

// To fetch random question for the particular path
const handleQuestion = async (User) => {
  try {
    const userData = await getData(GAME_CONFIG.COLLECTION.USERS, User.email);
    const newPath = userData.path;
    for (let i = 0; i < 10; i++) { // Keep 10 or update if questions follow different logic
      let c = newPath[i];
      if (userData[c] === false) {
        const question = await getData(GAME_CONFIG.COLLECTION.QUESTIONS, c);
        const randomIndex = Math.floor(Math.random() * 3) + 1;
        const obj = {
          question: question[randomIndex],
          answer: question[`${randomIndex}a`],
          userName: userData.name,
        };
        return obj;
      }
    }
  } catch (err) {
    alert("Something went Wrong, Try Again!!");
  }
};
// To update firebase data if question is answered correctly
const handleQuestionSubmit = async (User) => {
  const userData = await getData(GAME_CONFIG.COLLECTION.USERS, User.email);
  const newPath = userData.path;
  for (let i = 0; i < GAME_CONFIG.TOTAL_LEVELS; i++) {
    let c = newPath[i];
    if (userData[c] === false) {
      try {
        const washingtonRef = doc(db, GAME_CONFIG.COLLECTION.USERS, User.email);
        await updateDoc(washingtonRef, {
          [c]: true,
        });
        return true;
      } catch (err) {
        alert(err.message);
      }
      break;
    }
  }
};
// to check the path of user
const checkUserPath = async (email) => {
  const newpath = await getData(GAME_CONFIG.COLLECTION.USERS, email);
  if (newpath && newpath.path && newpath.path.length > 0) {
    return true;
  } else {
    return false;
  }
};
export {
  getData,
  shuffle,
  handleData,
  handleQuestion,
  handleQuestionSubmit,
  checkUserPath,
};
