// =========================================
// MOTS DE PASSE POUR IMAGES PREMIUM
// =========================================
// Ce fichier est protégé par un mot de passe master
// Pour modifier les mots de passe, ouvrez ce fichier et changez les valeurs.
// Le mot de passe master est : Be@trice12 (pour l'édition)

const imagePasswords = {
    // id de l'image : mot de passe
    6: "P@ssword6",
    7: "P@ssword7",
    8: "P@ssword8",
    9: "P@ssword9",
    10: "P@ssword10",
    // Ajoutez ici d'autres paires id:motdepasse
};

// Fonction de vérification (à utiliser dans la page)
function checkImagePassword(imageId, userPassword) {
    // Le mot de passe master est Be@trice12 (pour l'administration)
    if (userPassword === "Be@trice12") {
        return { success: true, password: imagePasswords[imageId] || null };
    }
    if (imagePasswords[imageId] === userPassword) {
        return { success: true, password: imagePasswords[imageId] };
    }
    return { success: false };
}
