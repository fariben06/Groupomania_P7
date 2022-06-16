// 1. Importer express pour utiliser les routes de l'API REST (création d'un objet express)
// 2. Créer un nouveau routeur d'express (router = routeur d'express)
const express = require('express');
const router = express.Router();


// 1. Middlewares pour vérifier que l'utilisateur est connecté
// 2. Importer le middleware auth pour vérifier que l'utilisateur est connecté
// 3. Importer le middleware multer-config pour configurer multer pour stocker les images des articles
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


// Contrôleurs des routes de l'API REST (création d'un objet controller)
const ctrlUser = require('../controllers/users');


router.post('/login', ctrlUser.userLogin); // 1. Route pour se connecter à l'API REST (login) 
router.post('/sign', multer.single('avatar'), ctrlUser.userSign); // 2. Route pour s'inscrire à l'API REST (signup) (avec le middleware multer-config pour stocker l'image de profil)
router.get('/', ctrlUser.userGet); // 3. Route pour récupérer les données de l'utilisateur connecté (get)
router.get('/search', ctrlUser.userSearch); // 4. Route pour récupérer les données de l'utilisateur connecté (search) (get)
router.put('/:id/:delete', auth, multer.single('avatar'), ctrlUser.userEdit); // 5. Route pour modifier les données de l'utilisateur connecté (edit)
router.delete('/:id/:avatar', auth, ctrlUser.userDel); // 6. Route pour supprimer l'utilisateur connecté (delete) (avatar)

module.exports = router; // Exporter le routeur d'express (router)
