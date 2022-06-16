// 1. Importer express pour utiliser les routes de l'API REST (création d'un objet express)
// 2. Créer un nouveau routeur d'express (router = routeur d'express)
const express = require('express');
const router = express.Router();

// Middlewares pour vérifier que l'utilisateur est connecté (get)
const auth = require('../middlewares/auth'); // Importer le middleware auth pour vérifier que l'utilisateur est connecté

// Contrôleurs des routes de l'API REST (création d'un objet controller)
const ctrlTask = require('../controllers/tasks');

router.get('/', ctrlTask.tasksGet); // 1. Route pour récupérer les données des tâches (get)
router.post('/', auth, ctrlTask.taskAdd); // 2. Route pour ajouter une tâche (post) 
router.put('/:id', auth, ctrlTask.taskEdit); // 3. Route pour modifier une tâche (put)
router.delete('/:id', auth, ctrlTask.taskDel); // 4. Route pour supprimer une tâche (delete)

module.exports = router; // Exporter le routeur d'express (router)
