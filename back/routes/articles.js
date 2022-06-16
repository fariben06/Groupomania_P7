// Importer express pour utiliser les routes de l'API REST (création d'un objet express)
// Créer un nouveau routeur d'express (router = routeur d'express)
const express = require('express');
const router = express.Router();

// Middlewares pour vérifier que l'utilisateur est connecté (get) 
const auth = require('../middlewares/auth');  // Importer le middleware auth pour vérifier que l'utilisateur est connecté
const multer = require('../middlewares/multer-config'); // Importer le middleware multer-config pour configurer multer pour stocker les images des articles

// Contrôleurs des routes de l'API REST (création d'un objet controller)
const ctrlArticle = require('../controllers/articles');

router.get('/', ctrlArticle.articlesGet); // 1. Route pour récupérer les données des articles (get)
router.post('/', auth, multer.single('image'), ctrlArticle.articleAdd); // 2. Route pour ajouter un article (post) (auth) (image)
router.put('/:id', auth, multer.single('image'), ctrlArticle.articleEdit); // 3. Route pour modifier un article (put) (auth) (image)
router.delete('/:id/:image', auth, ctrlArticle.articleDel);  // 4. Route pour supprimer un article (delete) (auth)

module.exports = router; // Exporter le routeur d'express (router)
