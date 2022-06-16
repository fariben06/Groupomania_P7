const express = require('express'); // Importer express pour utiliser les fonctionnalités de ce module dans notre application
const app = express(); // Création d'une instance de express 
const path = require('path'); // Importer path pour utiliser les fonctionnalités de ce module dans notre application
// Importer les routes
const userRoutes = require('./routes/users'); // Importer les routes de l'utilisateur (users.js)
const articlesRoutes = require('./routes/articles'); // Importer les routes des articles (articles.js)
const commentsRoutes = require('./routes/comments'); // Importer les routes des commentaires (comments.js)
const tasksRoutes = require('./routes/tasks'); // Importer les routes des tâches (tasks.js)
const likesRoutes = require('./routes/likes'); // Importer les routes des likes (likes.js)

app.use((req, res, next) => {
    // Permet de définir le header de la réponse pour que les requêtes soient traitées en json et non en html (application/json)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Permet d'autoriser l'accès à notre API depuis n'importe quel site web
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Permet d'autoriser les méthodes HTTP suivantes : GET, POST, PUT, DELETE et OPTIONS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
// 
app.use(express.urlencoded({ extended: true })); // Permet de parser les requêtes en json
app.use(express.json());

// Routes de l'application (authentification, utilisateur, articles, commentaires, tâches, aimer)
app.use('/api/auth', userRoutes); // Routes de l'authentification (users.js)
app.use('/api/user', userRoutes); // Routes de l'utilisateur (users.js)
app.use('/api/articles', articlesRoutes); // Routes des articles (articles.js)
app.use('/api/comments', commentsRoutes); // Routes des commentaires (comments.js)
app.use('/api/tasks', tasksRoutes); // Routes des tâches (tasks.js)
app.use('/api/likes', likesRoutes); // Routes des likes (likes.js)

// Définition du dossier public pour les fichiers statiques (css, images, js)
app.use('/images', express.static(path.join(__dirname, 'images'))); // Permet de servir les images depuis le dossier images (images/)
app.use('/avatars', express.static(path.join(__dirname, 'avatars'))); // Permet de servir les avatars depuis le dossier avatars (avatars/)

module.exports = app; // Exporter l'application pour pouvoir l'utiliser dans d'autres fichiers (app.js)
