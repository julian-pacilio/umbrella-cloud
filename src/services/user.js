import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { updatePassword, getAuth } from "firebase/auth";
import { db } from "./firebase.js";

/**
 * Obtiene el perfil del usuario segun su ID de firebase
 *
 * @param {string} id
 * @returns {Promise<{id: string, email: string}>}
 */
export async function getUserProfileById(id) {
  const refUser = doc(db, `users/${id}`);
  const docSnapshot = await getDoc(refUser);

  if (docSnapshot.exists()) {
    return {
      id: docSnapshot.id,
      name: docSnapshot.data().name,
      surname: docSnapshot.data().surname,
      email: docSnapshot.data().email,
      rol: docSnapshot.data().rol,
      photoURL: docSnapshot.data().photoURL,
      plan_id: docSnapshot.data().plan_id,
    };
  }
}

/**
 * Crea un perfil de usuario en la Firestore DB
 *
 * @param {id: string} id
 * @param {{email: string}} data
 * @returns {Promise}
 */
export async function createUserProfile(id, data) {
  const refUser = doc(db, `users/${id}`);
  return setDoc(refUser, { ...data, created_at: serverTimestamp() });
}

/**
 * Edita un perfil de usuario en la Firestore DB
 *
 * @param {string} uid
 * @param {object} data
 * @returns {Promise}
 */
export async function editUserProfile({ uid, data }) {
  const refUser = doc(db, `users/${uid}`);
  return await updateDoc(refUser, data)
    .then(() => {
      console.log("Los datos fueron actualizados con éxito");
      return { ...data };
    })
    .catch((error) => {
      console.log("Error al actualizar el documento:", error);
      return {
        code: error.code,
        message: error.message,
      };
    })
}

/**
 * Obtiene todos los usuarios almacenados en la collection users con su link a chat privado
 *
 * @param {() => {}} callback
 * @returns {Array} 
 */
export function getAllUsers(callback) {
  const refUsers = collection(db, "users");
  const q = query(refUsers, where("rol", "==", "user"));

  return getDocs(q).then((snapshot) => {
    const userData = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        surname: doc.data().surname,
        email: doc.data().email,
        rol: doc.data().rol,
        photoURL: doc.data().photoURL,
        plan_id: doc.data().plan_id,
        chat: `/usuario/${doc.id}/chat`,
      };
    });
    callback(userData);
  });
}

/**
 * Edita el password de usuario en la Firestore DB
 *
 * @param {password} password
 * @returns {Promise}
 */
export async function editUserAccountPassword({ password }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const newPassword = password;

  return await updatePassword(user, newPassword)
    .then(() => {
      console.log("Password actualizado con éxito");
      return { ...password };
    })
    .catch((error) => {
      console.error("Error al actualizar el Password");
      return {
        code: error.code,
        message: error.message,
      };
    });
}