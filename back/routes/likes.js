// Importer express pour utiliser les routes de l'API REST (création d'un objet express)
// Créer un nouveau routeur d'express (router = routeur d'express)
const express = require('express');
const router = express.Router();


// Middlewares pour vérifier que l'utilisateur est connecté (get)
const auth = require('../middlewares/auth'); // Importer le middleware auth pour vérifier que l'utilisateur est connecté

// Contrôleurs des routes de l'API REST (création d'un objet controller)
const ctrlLike = require('../controllers/likes');

router.post('/', auth, ctrlLike.like); // 1. Route pour ajouter un like (post) 

module.exports = router; // Exporter le routeur d'express (router) 
