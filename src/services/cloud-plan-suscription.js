import { db } from "./firebase.js";
import { doc, updateDoc } from "firebase/firestore";
import { getUserProfileById } from "./user.js";
import { getCloudServiceByUid } from "./cloud-plans.js";

/**
 * Suscribe a un usuario a un servicio de Cloud Plan, que no posea suscripción
 * 
 * @param {Object} data
 * @returns {Promise} 
 */
export async function suscribeToCloudPlanService({ plan_id, user_id }) {
  const refUser = doc(db, `users/${user_id}`);
  const data_user = {
    plan_id: plan_id,
  };

  const userData = await getUserProfileById(user_id);

  if (userData.plan_id != null) {
    console.log("Error, usted ya cuenta con una suscripcion Umbrella Cloud");
    return {
      message: "Suscripción existente"
    }
  } else {
    return await updateDoc(refUser, data_user)
      .then(() => {
        console.log("Suscripción contratada con éxito");
        return {
          message : "Suscripción contratada"
        }
      })
      .catch((error) => {
        console.error("Error al suscribrise al servicio", error);
      });
  }
}

/**
 * Actualiza la suscripción al Cloud Plan de un usuario
 * 
 * @param {string} plan_id - ID del nuevo plan.
 * @param {string} user_id - ID del usuario.
 * @returns {Promise} 
 */
export async function upgradeCloudPlanService({ plan_id, user_id }) {
  const refUser = doc(db, `users/${user_id}`);
  const data_user = {
    plan_id: plan_id,
  };

  const userData = await getUserProfileById(user_id);

  if (userData.plan_id == data_user.plan_id) {
    console.log(
      "Error, usted ya cuenta con una suscripcion a este servicio Umbrella Cloud"
    )
    return {
      message: "Suscripción existente"
    }
  } else {
    return await updateDoc(refUser, data_user)
      .then(() => {
        console.log("Suscripción mejorada con éxito");
        return {
          message : 'Suscripción actualizada'
        }
      })
      .catch((error) => {
        console.error("Error al mejorar la suscripción", error);
      });
  }
}

/**
 * Cancelar la suscripción al Cloud Plan de un usuario.
 * 
 * @param {string} user_id - ID del usuario.
 * @returns {Promise} 
 */
export async function unsuscribeFromCloudPlanService({ user_id }) {
  const refUser = doc(db, `users/${user_id}`);
  const data_user = {
    plan_id: null,
  };

  return await updateDoc(refUser, data_user)
    .then(() => {
      console.log("Suscripción cancelada con éxito");
    })
    .catch((error) => {
      console.error("Error al cancelar la suscripción", error);
    });
}

export async function getCloudPlanServiceDetails(plan_id) {
    return await getCloudServiceByUid(plan_id)
}