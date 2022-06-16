// Importer express pour utiliser les routes de l'API REST (création d'un objet express)
// Créer un nouveau routeur d'express (router = routeur d'express)
const express = require('express');
const router = express.Router();


// Middlewares pour vérifier que l'utilisateur est connecté (get) 
const auth = require('../middlewares/auth');  // Importer le middleware auth pour vérifier que l'utilisateur est connecté
const multer = require('../middlewares/multer-config'); // Importer le middleware multer-config pour configurer multer pour stocker les images des articles

// Contrôleurs des routes de l'API REST (création d'un objet controller)
const ctrlComment = require('../controllers/comments');

router.get('/', auth, ctrlComment.commentsGet); // Route pour récupérer les données des commentaires (get) (auth)  
router.post('/', auth, multer.single('image'), ctrlComment.commentAdd); // Route pour ajouter un commentaire (post) (auth) (image)
router.put('/:id', auth, multer.single('image'), ctrlComment.commentEdit); // Route pour modifier un commentaire (put) (auth) (image)
router.delete('/:id', auth, ctrlComment.commentDel); // Route pour supprimer un commentaire (delete) (auth)

module.exports = router; // Exporter le routeur d'express (router)
