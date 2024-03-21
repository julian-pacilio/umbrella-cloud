import {
  addDoc,
  collection,
  getDocs,
  limit,
  serverTimestamp,
  where,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase.js";

const privateChatRefCache = {};

/**
 * Envía un mensaje de chat privado.
 * 
 * @param {{senderId: string, recieverId: string, message: string}} data
 * @return {Promise}
 */
export async function sendPrivateChatMessage({ senderId, recieverId, message }) {
  const privateChatDoc = await getPrivateChatDoc({ senderId, recieverId });

  const messagesRef = collection(
    db,
    `private-chats/${privateChatDoc.id}/messages`
  );

  await addDoc(messagesRef, {
    senderId,
    message,
    created_at: serverTimestamp(),
  });
  return true;
}

/**
 * Recibe los mensajes de chat entrantes
 *
 * @param {{senderId: string, recieverId: string, message: string}} users
 * @param{({}[]) => void} callback
 * @return {Promise<import("firebase/auth").Unsubscribe>}
 */
export async function subscribeToPrivateChat({ senderId, recieverId }, callback ) {
  const privateChatDoc = await getPrivateChatDoc({ senderId, recieverId });

  const messagesRef = collection(db, `private-chats/${privateChatDoc.id}/messages`);

  const q = query(messagesRef, orderBy("created_at"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        senderId: doc.data().senderId,
        message: doc.data().message,
        created_at: doc.data().created_at?.toDate(),
      };
    });

    callback(messages);
  });
}

/**
 * Crea y verifica la existencia del documento de chat privado entre 2 usuarios
 *
 * @param {{senderId: string, recieverId: string, message: string}} data
 * @return {Promise}
 */
async function getPrivateChatDoc({ senderId, recieverId }) {
  const cachedRef = getFromCache({ senderId, recieverId });
  if (cachedRef) {
    return cachedRef;
  }

  const privateChatRef = collection(db, "private-chats");

  const q = query(
    privateChatRef,
    where("users", "==", {
      [senderId]: true,
      [recieverId]: true,
    }),
    limit(1)
  );

  const snapshot = await getDocs(q);
  let privateChatDoc;
  
  if (snapshot.empty) {
    privateChatDoc = await addDoc(privateChatRef, {
      users: {
        [senderId]: true,
        [recieverId]: true,
      },
    });
  } else {
    privateChatDoc = snapshot.docs[0];
  }

  addToCache({ senderId, recieverId }, privateChatDoc);

  return privateChatDoc;
}

/**
 * Retorna todos los chats en los que el userId es participante ( admin )
 *
 * @param {*} userId
 * @returns {Array} privateChats
 */
export async function getPrivateChatDocs(userId) {
  const privateChatRef = collection(db, "private-chats");

  // Consulta para obtener todos los chats en los que el usuario participa
  const q = query(privateChatRef, where(`users.${userId}`, "==", true));

  const snapshot = await getDocs(q);

  let privateChats = [];

  snapshot.docs.forEach((doc) => {
    const usersMap = doc.data().users;

    const recieverId = Object.keys(usersMap).find((id) => id !== userId);

    const chatInfo = {
      recieverId: recieverId,
    };

    privateChats.push(chatInfo);
  });

  return privateChats;
}

function addToCache({ senderId, recieverId }, value) {
  privateChatRefCache[getKeyForCache({ senderId, recieverId })] = value;
}

function getFromCache({ senderId, recieverId }) {
  return privateChatRefCache[getKeyForCache({ senderId, recieverId })] || null;
}

function getKeyForCache({ senderId, recieverId }) {
  return senderId + recieverId;
}
