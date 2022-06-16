// Import de la bibliothèque jsonwebtoken pour l'authentification des requêtes HTTP
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {  // Définition de la méthode middleware auth pour l'authentification des requêtes HTTP
  try { // Tentative de récupération du token dans les headers de la requête HTTP et de le décodé en utilisant le secret de l'application
    console.log('--- middleware d\'authentification  ---'); // Affichage dans la console du début du middleware auth pour debug 
    if (!req.headers.authorization) { // Si le token n'est pas dans les headers de la requête HTTP  (exemple: si l'utilisateur n'est pas connecté)
      throw 'Token manquant!'; // On lance une erreur pour indiquer à l'utilisateur qu'il n'est pas connecté
    }


    // Récupération du token dans les headers de la requête HTTP et de le décodé en utilisant le secret de l'application
    const token = req.headers.authorization.split(' ')[1].split('"')[1]; // split permet de séparer le token de la chaine de caractères "Bearer " et de le récupérer dans un tableau à 2 éléments 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Décodage du token en utilisant le secret de l'application et le temps de validité du token défini dans la configuration de l'application
    const userId = decodedToken.userId; // Récupération de l'id de l'utilisateur dans le token décodé en utilisant le secret de l'application
    if (req.body.userId && req.body.userId !== userId) { // Si l'id de l'utilisateur dans le token décodé ne correspond pas à l'id de l'utilisateur dans le body de la requête HTTP (exemple: si l'utilisateur n'est pas connecté)
      throw 'User ID non valable!'; // On lance une erreur pour indiquer à l'utilisateur qu'il n'est pas connecté et qu'il doit se connecter pour accéder à la ressource demandée 
    } else { // Sinon (exemple: si l'utilisateur est connecté) on passe au prochain middleware 
      console.log('quitter l\'authentification du middleware'); // Affichage dans la console du début du middleware auth pour debug.
      next(); // Passage au prochain middleware  
    }
  } catch { // Si une erreur est lancée dans le bloc try 
    res.status(401).json({ error: 'Requête non authentifiée!' }); // On renvoie une erreur 401 (non autorisé) à l'utilisateur et on lui indique qu'il n'est pas connecté  
  }
};
