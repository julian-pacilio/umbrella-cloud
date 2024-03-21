/**
 * Valida la dirección email proporcionada
 * 
 * @param {string} email 
 * @returns {boolean}
 */

export function validateEmail(email) {

    let regex = /^\S+@\S+\.\S+$/

    if(regex.test(email)) {
        return true
    }
    else {
        return false
    }
}
