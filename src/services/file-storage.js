import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Carga un archivo dentro del storage de FirestoreDB
 * 
 * @param {String} path
 * @param {File} file
 * @returns {Promise}
 */
export async function uploadFile(path, file) {
  const fileRef = ref(storage, path);
  return uploadBytes(fileRef, file);
}

/**
 * Retorna la URL en forma de string en el path en el storage
 * 
 * @param {String} path
 * @returns {Promise<string>}
 */
export async function getFileURL(path) {
  return getDownloadURL(ref(storage, path));
}
