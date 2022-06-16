// Import du module filesystem pour la gestion des images d'articles dans le dossier images du serveur.
const fs = require('fs');
const db = require("../models"); // Import de la base de données des articles pour la gestion des articles dans le serveur.
const Users = db.users; // Récupération des utilisateurs qui ont posté un article dans la BDD.
const Tasks = db.tasks; // Récupération des tâches
const Articles = db.articles; // Récupération des articles d'un utilisateur.
const Comments = db.comments; // Récupération des commentaires d'un article par son id.  
const Likes = db.likes; // Récupération des likes d'un article par son id.

// Récupération des articles d'un utilisateur par son id.
exports.articlesGet = (req, res) => {
    Articles.findAll({
        // Inclure la récupération des utilisateurs, des tâches, des commentaires et des likes d'un article par son id.
        include: [{ model: Users, include: { model: Tasks } }, { model: Comments }, { model: Likes }],
        order: [['id', 'DESC']] // Tri des articles par ordre décroissant de leur id.
    })
        .then((articles) => {
            // Verifie si des articles existent dans la BDD et si l'utilisateur est connecté ou si il est l'admin (isAdmin).
            if (articles.length <= 0) // Si il n'y a pas d'articles dans la BDD on renvoie un message d'erreur à l'utilisateur.
                return res.status(204).json({ error: 'Aucun article !' });

            return res.status(200).json({ articles: articles }); // Si il y a des articles dans la BDD on les renvoie à l'utilisateur sous forme d'un tableau d'objets JSON (articles).
        })
        .catch((error) => { // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur.
            return res.status(500).json({ error: error }); // On renvoie un message d'erreur à l'utilisateur avec le status code 500 (erreur interne du serveur).
        });
};

// Ajout d'un article dans la BDD (en tant qu'article de l'utilisateur).
exports.articleAdd = (req, res) => {
    let authorId = req.body.userId; // Laissez la variable authorId à la valeur de l'id de l'utilisateur qui a posté l'article (req.body.userId).
    let myArticle = req.body.article; // Laissez la variable myArticle à la valeur de l'article (req.body.article).
    let myImage = "none"; // Laissez la variable myImage à la valeur "none" (aucune image).
    // Si une image est envoyé par l'utilisateur on la stocke dans la BDD.
    if (!req.body.article && !req.file) // Si il n'y a pas d'article et pas d'image.
        return res.status(400).json({ error: 'Entrée vide !' }); // On renvoie un message d'erreur à l'utilisateur avec le status code 400 (bad request).

    if (req.file && req.file.filename) // Si une image est envoyé par l'utilisateur on la stocke dans la BDD 
        myImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // On récupère le nom de l'image dans la BDD et on le stocke dans la variable myImage (req.file.filename).

    // Création d'un nouvel article dans la BDD.
    Users.findOne({ where: { id: authorId } }) // On récupère l'utilisateur par son id (authorId).
        .then((author) => { // Si l'utilisateur existe on crée un nouvel article avec les données de l'utilisateur.
            Articles.create({ // Création d'un nouvel article dans la BDD avec les données de l'utilisateur.
                article: myArticle, // On stocke l'article dans la BDD (myArticle).
                image: myImage, // On stocke l'image dans la BDD (myImage).
                postDate: new Date(), // On stocke la date de publication de l'article dans la BDD.
                authorId: author.id // On stocke l'id de l'utilisateur qui a posté l'article dans la BDD.
            });
            return res.status(201).json({ message: 'Article créé !' }); // On renvoie un message de succès à l'utilisateur avec le status code 201 (created).
        })
        .catch((error) => { // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur.
            console.log("Erreur!"); // On affiche dans la console du serveur le message d'erreur.
            console.log(erreur); // On affiche dans la console du serveur le message d'erreur.
            return res.status(500).json({ error: error }); // On renvoie un message d'erreur à l'utilisateur avec le status code 500 (erreur interne du serveur).
        });
}


// Modification d'un article dans la BDD (en tant qu'article de l'utilisateur).
exports.articleEdit = (req, res) => {
    // Récuperation de l'id de l'article à modifié.
    let articleId = req.params.id; // Laissez la variable articleId à la valeur de l'id de l'article à modifier (req.params.id).
    let myArticle = req.body.message; // Laissez la variable myArticle à la valeur de l'article (req.body.message).
    let myImage = "none"; // Laissez la variable myImage à la valeur "none" (aucune image).

    Articles.findOne({ where: { id: articleId } }) // On récupère l'article par son id (articleId) dans la BDD.
        .then((article) => { // Si l'article existe on modifie l'article dans la BDD.

            if (req.file && req.file.filename) { // Si une image est envoyé par l'utilisateur on la stocke dans la BDD
                // On récupère le nom de l'image dans la BDD et on le stocke dans la variable myImage (req.file.filename).
                myImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                if (myImage != 'none' && article.image != 'none') { // Si il y a une image dans l'article et qu'il y a une image dans la BDD on supprime l'image dans la BDD.
                    const filename = article.image.split('/images/')[1]; // On récupère le nom de l'image dans la BDD et on le stocke dans la variable filename (article.image.split('/images/')[1]) (article.image.split('/images/')[1] = filename) (article.image = http://localhost:3000/images/filename).
                    fs.unlink(`images/${filename}`, () => { // On supprime l'image dans la BDD (fs.unlink) (images/filename).
                    });
                }
            }
            // On modifie l'article dans la BDD avec les données de l'utilisateur (myArticle).
            else myImage = article.image;  // Si il n'y a pas d'image dans l'article on stocke l'image dans la BDD (article.image).
            article.update({ // On modifie l'article dans la BDD.
                article: myArticle, // On stocke l'article dans la BDD (myArticle).
                image: myImage  // On stocke l'image dans la BDD (myImage).
            })
                .then((result) => { // Si l'article a été modifié on renvoie un message de succès à l'utilisateur avec le status code 200 (ok).
                    console.log(result); // On affiche dans la console du serveur le message de succès (result) 
                    res.status(201).json({ message: 'Article mis à jour !' }); // On renvoie un message de succès à l'utilisateur avec le status code 201 (created).
                })
                .catch((error) => { // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur.
                    console.log(error); // On affiche dans la console du serveur le message d'erreur (error).
                    res.status(500).json({ message: error }); // On renvoie un message d'erreur à l'utilisateur avec le status code 500 (erreur interne du serveur).
                });
        })
        .catch((error) => { // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur.
            console.log(error); // On affiche dans la console du serveur le message d'erreur (error).
            res.status(500).json({ message: error }); // On renvoie un message d'erreur à l'utilisateur avec le status code 500 (erreur interne du serveur).
        });
}

// Suppression d'un article dans la BDD (en tant qu'article de l'utilisateur) et suppression de l'image de l'article dans la BDD.
exports.articleDel = (req, res) => {
    let articleId = req.params.id; // Récuperation de l'id de l'article à supprimé et de l'id de l'utilisateur qui a posté l'article à supprimé.
    isImage = false; // On initialise la variable isImage à false (aucune image) (isImage = false).
    // Si l'utilisateur a demandé la suppression de l'image de l'article (req.params.image == 1) on initialise la variable isImage à true (isImage = true) (isImage = true).
    if (req.params.image == 1) isImage = true;

    Articles.findOne({ where: { id: articleId } }) // On récupère l'article par son id (articleId) dans la BDD.
        .then((article) => {
            // Si l'utilisateur veut effacer son image de l'article (isImage = true) on supprime l'image de l'article dans la BDD.
            if (isImage) {
                // Si il y a une image dans l'article on supprime l'image dans la BDD (article.image) (article.image = http://localhost:3000/images/filename).
                if (article.image != 'none') {
                    // Suppresion de l'image dans la BDD (fs.unlink) (article.image.split('/images/')[1] = filename) (article.image = http://localhost:3000/images/filename).
                    const filename = article.image.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                    });
                }

                // Mettre à jour le profil de l'utilisateur (article.userId) (article.userId = 1) 
                Articles.update({ image: 'none' }, { where: { id: articleId } })
                    .then(() => { // Si l'image de l'article a été supprimée on renvoie un message de succès à l'utilisateur avec le status code 200 (ok).
                        return res.status(200).json({ message: 'Image supprimée !' });
                    })
                    .catch(() => { // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur.
                        return res.status(304); // On renvoie un message d'erreur à l'utilisateur avec le status code 304 (not modified).
                    });
            }
            // Si il veut suprrimer l'article entier (isImage = false) on supprime l'article dans la BDD.
            else {
                // Si il y a une image dans l'article
                if (article.image != 'none') { // Si il y a une image dans l'article on supprime l'image dans la BDD (article.image = http://localhost:3000/images/filename).
                    const filename = article.image.split('/images/')[1]; // On récupère le nom de l'image dans la BDD et on le stocke dans la variable filename (article.image.split('/images/')[1]) (article.image.split('/images/')[1] = filename) (article.image = http://localhost:3000/images/filename).
                    fs.unlink(`images/${filename}`, () => { // On supprime l'image dans la BDD (fs.unlink) (images/filename).
                    });
                }
                Articles.destroy({ where: { id: articleId } }) // On supprime l'article dans la BDD.
                    .then(() => res.status(200).json({ message: 'Article supprimé !' })) // Si l'article a été supprimé on renvoie un message de succès à l'utilisateur avec le status code 200 (ok).
                    .catch(error => res.status(400).json({ error })); // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur avec le status code 400 (bad request).
            }
        })
        .catch((error) => { // Si une erreur est survenue on renvoie un message d'erreur à l'utilisateur.
            console.log(error); // On affiche dans la console du serveur le message d'erreur (error).
            res.status(500).json({ message: error }); // On renvoie un message d'erreur à l'utilisateur avec le status code 500 (erreur interne du serveur).
        });
}
