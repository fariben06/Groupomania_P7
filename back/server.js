// Import de la bibliothèque dotenv pour la configuration de l'application (exemple: configuration du secret de l'application)
require('dotenv').config();
const http = require('http'); // Import de la bibliothèque http pour le serveur HTTP de l'application 
const app = require('./app');
const db = require("./models"); // Import de la bibliothèque Sequelize pour la connexion à la BDD SQL via l'API de NodeJS

// On récupère le port dans le fichier .env
const MY_PORT = process.env.PORT || process.env.MY_PORT;

app.set('port', MY_PORT); // On définit le port de l'application à partir du port récupéré dans le fichier .env
const server = http.createServer(app); // Création du serveur HTTP de l'application à partir de l'application Express

// Démarrage du serveur sur le port défini dans le fichier env ou sur le port 8080 par défaut
server.on('error', (err) => { // Si une erreur est survenue lors du démarrage du serveur, on affiche un message d'erreur.
    console.log(`erreur du serveur | ${err}`); // On affiche le message d'erreur sur la console.
});


// Serveur en ligne sur le port défini dans la configuration de l'application (dans .env) et sur le port 8080 par défaut.
server.listen(MY_PORT, () => { // Démarrage du serveur sur le port défini dans le fichier env ou sur le port 8080 par défaut
    // On affiche un message sur la console lors du démarrage du serveur sur le port défini dans la configuration de l'application (dans .env)
    console.log(`Serveur exécuté sur le port : ${MY_PORT}`);
    // On affiche un message sur la console pour vérifier la connexion à la base de données
    console.log('Vérification de la connexion à la base de données...');
    db.sequelize.authenticate() // On vérifie la connexion à la base de données
        .then(() => { // Si la connexion à la base de données est réussie
            db.sequelize.sync({ alter: false, force: false }); // On synchronise la base de données avec la base de données de l'application
            console.log('Connexion à la base de données OK !');
        })
        .catch((error) => { // Si une erreur est survenue lors de la connexion à la base de données, on affiche un message d'erreur.
            console.log('Impossible de se connecter à la base de données:');
            console.log(error.message); // On affiche le message d'erreur sur la console.
            process.exit(1); // On quitte le processus en cours (processus NodeJS)
        });
});
