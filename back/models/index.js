require("dotenv").config(); // Import de la bibliothèque dotenv pour la configuration de l'application (exemple: configuration du secret de l'application)
const Sequelize = require("sequelize"); // Import de la bibliothèque Sequelize pour la connexion à la BDD SQL via l'API de NodeJS
// Création de la connexion à la BDD SQL via l'API de NodeJS, 
// avec les paramètres de connexion récupérés dans le fichier .env (exemple: host, port, username, password, database)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,  // host de la BDD SQL (localhost)
  dialect: process.env.DB_DIAL, // type de la BDD SQL  (mysql)
  logging: false, // On désactive l'affichage des requêtes SQL dans la console
  define: { // On définit les options de la BDD SQL
    timestamps: false // On désactive les timestamps de la BDD SQL (auto-incrémentation de l'identifiant unique)
  }
});

// 1. On crée un objet vide qui va contenir toutes les définitions de tables SQL de l'application
// 2. On définit l'objet Sequelize dans l'objet db qui va contenir toutes les définitions de tables SQL
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Tous les modèles de l'application sont importés ici via le fichier models\index.js 
db.users = require("./Users")(sequelize, Sequelize); // Import du modèle Users de l'application 
db.articles = require("./Articles")(sequelize, Sequelize); // Import du modèle Articles de l'application
db.comments = require("./Comments")(sequelize, Sequelize); // Import du modèle commentaires de l'application
db.tasks = require("./Tasks")(sequelize, Sequelize); // Import du modèle tâches de l'application
db.likes = require("./Likes")(sequelize, Sequelize); // Import du modèle likes de l'application


// Modèles associés à l'utilisateur (users) et à l'article (articles)
const keyAuthor = { name: 'authorId', allowNull: false }; // Clé étrangère de la table articles qui pointe sur la table users  (id de l'auteur)
const keyArticle = { name: 'articleId', allowNull: false };  // Clé étrangère de la table comments qui pointe sur la table articles (articleId)
const keyTask = { name: 'taskId', allowNull: false };  // Clé étrangère de la table likes qui pointe sur la table tasks (tâches)

// Tâches associées à l'utilisateur (users) et à l'article (articles)
db.tasks.hasOne(db.users, { foreignKey: keyTask }); // Association de la table tasks à la table users via la clé étrangère taskId
db.users.belongsTo(db.tasks, { foreignKey: keyTask }); // Association de la table users à la table tasks via la clé étrangère taskId

// Articles associés à l'utilisateur (users) et à l'article (articles)
db.users.hasMany(db.articles, { foreignKey: keyAuthor }); // Association de la table users à la table articles via la clé étrangère authorId
db.articles.belongsTo(db.users, { foreignKey: keyAuthor }); // Association de la table articles à la table users via la clé étrangère authorId

// Commentaires associés à l'article (articles) et à l'utilisateur (users) (comments)
db.users.hasMany(db.comments, { foreignKey: keyAuthor }); // Association de la table users à la table comments via la clé étrangère authorId
db.comments.belongsTo(db.users, { foreignKey: keyAuthor }); // Association de la table comments à la table users via la clé étrangère authorId

// Articles associés à l'article (articles) et à l'utilisateur (users) et à l'commentaire (comments)
db.articles.hasMany(db.comments, { foreignKey: keyArticle }); // Association de la table articles à la table comments via la clé étrangère articleId
db.comments.belongsTo(db.articles, { foreignKey: keyArticle }); // Association de la table comments à la table articles via la clé étrangère articleId

// Likes associés à l'article (articles) et à l'utilisateur (users) (likes)
db.articles.hasMany(db.likes, { foreignKey: keyArticle }); // Association de la table articles à la table likes via la clé étrangère articleId
db.likes.belongsTo(db.articles, { foreignKey: keyArticle, onDelete: 'CASCADE' }); // Association de la table likes à la table articles via la clé étrangère articleId

module.exports = db; // Export de l'objet db qui contient toutes les définitions de tables SQL de l'application
