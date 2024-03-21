import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const refCloudPlans = collection(db, "services");

/**
 * Obtiene todos los servicios activos almacenados en la colecction services
 *
 * @param {() => {}} callback
 * @returns {Array} Array con todos los servicios existentes activos
 */
export function getCloudServices(callback) {
  const q = query(
    refCloudPlans,
    where("online", "==", "Activo"),
    orderBy("id")
  );

  return getDocs(q).then((snapshot) => {
    const data = snapshot.docs.map((doc) => {
      return {
        uid: doc.id,
        id: doc.data().id,
        online: doc.data().online,
        name: doc.data().name,
        price: doc.data().price,
        storage: doc.data().storage,
        users: doc.data().users,
        benefits: doc.data().benefits,
      };
    });
    callback(data);
  });
}

/**
 * Obtiene todos los servicios almacenados en la colecction services
 *
 * @param {() => {}} callback
 * @returns {Array} Array con todos los servicios existentes
 */
export function getAllCloudServices(callback) {
  const q = query(refCloudPlans, orderBy("id"));

  return getDocs(q).then((snapshot) => {
    const data = snapshot.docs.map((doc) => {
      return {
        uid: doc.id,
        id: doc.data().id,
        online: doc.data().online,
        name: doc.data().name,
        price: doc.data().price,
        storage: doc.data().storage,
        users: doc.data().users,
        benefits: doc.data().benefits,
      };
    });
    callback(data);
  });
}

/**
 * Agrega un nuevo servicio en la Firestore DB
 *
 * @param {Object} data Objeto con los datos del nuevo servicio
 * @return {Promise}
 */
export async function addCloudService(data) {
  return addDoc(refCloudPlans, {
    ...data,
    id: await getLastId(),
  })
  .then(() => {
    console.log("Documento creado con éxito");
  })
  .catch((error) => {
    console.error("Error al crear el documento:", error);
  });
}

/**
 * Elimina el servicio por su uid de Firestore DB
 *
 * @param {String} uid UID del servicio almacenado en Firestore
 * @return {Promise}
 */
export async function deleteCloudService(uid) {
  const refCloudPlan = doc(db, `services/${uid}`);
  return await deleteDoc(refCloudPlan)
    .then(() => {
      console.log("Documento eliminado con éxito");
    })
    .catch((error) => {
      console.error("Error al eliminar el documento:", error);
    });
}

/**
 *
 * Obtiene el servicio por su uid de Firestore DB
 *
 * @param {String} uid UID del servicio almacenado en Firestore
 * @return {Promise}
 */
export async function getCloudServiceByUid(uid) {
  const refCloudPlan = doc(db, `services/${uid}`);
  const docSnapshot = await getDoc(refCloudPlan);

  if (docSnapshot.exists()) {
    return {
      id: docSnapshot.data().id,
      name: docSnapshot.data().name,
      price: docSnapshot.data().price,
      storage: docSnapshot.data().storage,
      users: docSnapshot.data().users,
      online: docSnapshot.data().online,
      benefits: docSnapshot.data().benefits,
    };
  }
}

/**
 * Edita el servicio por su uid de Firestore DB
 *
 * @param {Object} Object Objeto que contiene el UID del servicio y los datos para actualizar
 * @return {Promise} 
 */
export async function editCloudService({ uid, data }) {
  const refCloudPlan = doc(db, `services/${uid}`);
  return await updateDoc(refCloudPlan, data)
    .then(() => {
      console.log("Documento actualizado con éxito");
    })
    .catch((error) => {
      console.error("Error al actualizar el documento:", error);
    });
}

/**
 * Obtiene la longitud de los documentos de una collection para generar un nuevo ID de Servicio
 *
 * @returns Promise
 */
async function getLastId() {
  // Realiza una consulta para obtener todos los documentos en la colección
  return await getDocs(refCloudPlans)
    .then((snapshot) => {
      // La longitud de la colección es el tamaño del snapshot
      const length = snapshot.size;
      console.log(`La colección tiene ${length} documentos.`);
      return length + 1;
    })
    .catch((error) => {
      console.error("Error al obtener la colección:", error);
    });
}