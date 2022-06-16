// Import de la bibliothèque multer pour la gestion des fichiers uploadés dans les requêtes HTTP POST et PUT (exemple: upload d'images)
const multer = require('multer');

// Définition des types MIME autorisés pour les fichiers uploadés dans les requêtes HTTP POST et PUT (exemple: upload d'images)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

// Définition de la méthode de stockage des fichiers uploadés dans les requêtes HTTP POST et PUT (exemple: upload d'images)
const storage = multer.diskStorage({
  destination: (req, file, callback) => { // destination est une méthode de multer qui permet de définir le chemin d'accès du fichier uploadé.
    if (file.fieldname === 'image') callback(null, 'images');  // Si le nom du champ de la requête HTTP est image, on stocke le fichier dans le dossier images.
    else callback(null, 'avatars');  // Si le fichier uploadé est un avatar, on le stocke dans le répertoire avatars sinon dans le répertoire images.
  },
  filename: (req, file, callback) => {  // Définition du nom du fichier uploadé dans les requêtes HTTP POST et PUT (exemple: upload d'images)
    const name = file.originalname.split(' ').join('_'); // On remplace les espaces par des underscores dans le nom du fichier uploadé pour éviter les problèmes de nom de fichier.
    const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension du fichier uploadé en utilisant le type MIME du fichier uploadé (exemple: upload d'images)
    // On renvoie le nom du fichier uploadé avec la date courante et l'extension du fichier uploadé.
    callback(null, name.split('.' + extension).join(Date.now()) + '.' + extension); // Date.now() permet de générer un identifiant unique pour le nom du fichier uploadé
  }
});

// Export de la configuration de multer pour la gestion des fichiers uploadés dans les requêtes HTTP POST et PUT (exemple: upload d'images)
module.exports = multer({ storage: storage }); 
