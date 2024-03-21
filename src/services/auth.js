import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.js";
import { uploadFile, getFileURL } from "./file-storage.js";
import { createUserProfile, editUserProfile } from "./user.js";

let userData = {
  id: null,
  email: null,
  photoURL: null,
};

let observers = [];

if (localStorage.getItem("user")) {
  userData = JSON.parse(localStorage.getItem("user"));
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    setUserData({
      id: user.uid,
      email: user.email,
      photoURL: user.photoURL,
    });
    localStorage.setItem("user", JSON.stringify(userData));
  } else {
    clearUserData();
    localStorage.removeItem("user");
  }
});

/**
 * Función que se encarga de hacer el Registro de un usuario
 *
 * @param  {{email: string, password: string}} user
 * @return {Promise}
 */
export async function register({ email, password, rol, name, surname, photoURL, plan_id }) {
  try {
    const userCredentials = await createUserWithEmailAndPassword( auth, email, password );
    // Registrar al usuario en firestore
    createUserProfile(userCredentials.user.uid, { email, rol, name, surname, photoURL, plan_id });

    return {
      id: userCredentials.user.uid,
      surname: userCredentials.user.surname,
      name: userCredentials.user.name,
      email: userCredentials.user.email,
      photoURL: userCredentials.user.photoURL,
      plan_id: userCredentials.user.plan_id,
      rol: userCredentials.user.rol,
    };
  } catch (error) {
    return {
      code: error.code,
      message: error.message,
    };
  }
}

/**
 * Función que se encarga de hacer el Iniciar Sesion de un usuario
 *
 * @param  {{email: string, password: string}} user
 * @return {Promise}
 */
export async function login({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return { ...userData };
    })
    .catch((error) => {
      return {
        code: error.code,
        message: error.message,
      };
    });
}

/**
 * Función para editar el perfil de un usuario en Firebase Authentication y Firestore.
 * 
 * @param {Object} data - { photoURL, name, email, rol, surname }
 */
export async function editProfile({ photoURL, name, email, rol, surname }) {
  try {
    // Preparamos los datos para Authentication.
    const data = {};
    const uid = userData.id;
    if (email !== undefined) data.email = email;
    if (name !== undefined) data.name = name;
    if (rol !== undefined) data.rol = rol;
    if (surname !== undefined) data.surname = surname;
    if (photoURL !== undefined) data.photoURL = photoURL;

    // Actualizamos los datos en Firebase Authentication.
    const promiseAuth = updateProfile(auth.currentUser, data);
    
    // Actualizamos los datos en Firestore.
    const promiseProfile = editUserProfile({ uid, data });

    await Promise.all([promiseAuth, promiseProfile]);

    // Actualizamos los datos de userData
    setUserData(data);
  } catch (error) {
    console.log('Ocurrio un error al intentar editar el perfil')
    return {
      code: error.code,
      message: error.message,
    };
  }
}

/**
 * Función que se encarga de editar el Avatar del usuario
 * 
 * @param {File} file
 * @returns {Promise}
 */
export async function editUserProfileAvatar(file) {
  const path = `/users/${userData.id}/avatar`;
  await uploadFile(path, file);
  const photoURL = await getFileURL(path);
  return await editProfile({
    photoURL,
  })
  .then(() => {
    console.log("Avatar actualizado con éxito");
    return { ...photoURL };
  })
  .catch((error) => {
    console.error("Error al actualizar el Avatar");
    return {
      code: error.code,
      message: error.message,
    };
  });
}

/**
 * Se encarga de Cerrar la Sesión del usurio autenticado
 *
 * @returns {Promise}
 */
export function logout() {
  return signOut(auth);
}

/**
 * Agrega un observer para ser notificado de los cambios en el estado de la auth
 *
 * @param {({id:null|string, email:null|string}) => void} observer
 * @returns {() => void } Funcion para cancelar la suscripción
 */
export function suscribeToAuth(observer) {
  // Agregamos el observer
  observers.push(observer);

  // Ejecutamos el observer
  notify(observer);

  return () => {
    observers = observers.filter((obs) => obs !== observer);
  };
}

/**
 * Notifica a todos los observers de los datos de la auth
 */
function notifyAll() {
  observers.forEach((observer) => notify(observer));
}

/**
 * Notifica a un observer de los datos
 *
 * @param {({id:null|string, email:null|string}) => void} observer
 */
function notify(observer) {
  observer({ ...userData });
}

/**
 * Settea nuevamente los datos del usuario y notifica a todos los observer
 *
 * @param {{id:null|string, email:null|string}} newData
 */
function setUserData(newData) {
  userData = {
    ...userData,
    ...newData,
  };
  notifyAll();
}

/**
 * Limpia los datos del usuario
 *
 * @param {{id:null|string, email:null|string}} newData
 */
function clearUserData() {
  setUserData({
    id: null,
    email: null,
    photoURL: null,
  });
}
