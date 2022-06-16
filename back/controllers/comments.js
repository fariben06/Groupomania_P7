const db = require("../models");
const Users = db.users;
const Comments = db.comments;
const Tasks = db.tasks;

// Récupération des commentaires d'un article.
exports.commentsGet = (req, res) => {
    const articleId = req.query.article;   // Récupération de l'id de l'article concerné par les commentaires.
    Comments.findAll({ // Récupération de tous les commentaires de l'article concerné.
        where: { articleId: articleId },
        include: [{ model: Users, include: { model: Tasks } }], // Récupération de l'auteur du commentaire ainsi que de ses tâches.
        order: [['id', 'DESC']] // Tri des commentaires par ordre décroissant de leur id (le plus récent au plus ancien).
    })
        .then((comments) => { // Envoi des commentaires au client
            // Verifie si des commentaires existent dans la BDD.
            if (comments.length <= 0) // Si il n'y a pas de commentaires dans la BDD 

                return res.status(204).json({ error: 'Sans commentaires !' }); // Envoi d'un message d'erreur 204 (Pas de contenu) 
            // Si il y a des commentaires dans la BDD On envoie les commentaires avec un code 200 (OK)
            res.status(200).json({ comments: comments });
        })
        .catch((error) => {
            // Envoi d'un message d'erreur 500 (Erreur interne au serveur)
            return res.status(500).json({ error: error });
        });
};

// Ajout d'un commentaire à un article. 
exports.commentAdd = (req, res) => {
    const authorId = req.body.userId; // Récupération de l'id de l'auteur du commentaire (utilisateur connecté).
    const articleId = req.body.articleId; // Récupération de l'id de l'article concerné par le commentaire (article concerné).
    const myComment = req.body.comment; // Récupération du commentaire à ajouter à l'article.
    let myImage = "none"; // Initialisation de la variable image à "none" (aucune image).
    // Verification des champs du formulaire.
    if (!req.body.comment && !req.file) // Si le commentaire est vide et que l'image est vide (aucune image)
        return res.status(400).json({ error: 'Entrée vide !' }); // Envoi d'un message d'erreur 400 (Bad Request)

    if (req.file) // Si l'image est présente dans le formulaire (image uploadée)
        // Récupération de l'url de l'image uploadée (protocole + nom du serveur + chemin de l'image) et envoi de l'url à la BDD.
        myImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    // Ajout du commentaire à la BDD avec l'id de l'auteur et l'id de l'article.
    Users.findOne({ where: { id: authorId } }) // Récupération de l'auteur du commentaire (utilisateur connecté).
        .then((author) => { // Envoi de l'auteur du commentaire à la BDD.
            Comments.create({ // Création du commentaire dans la BDD.
                comment: myComment, // Envoi du commentaire à la BDD.
                postDate: new Date(), // Envoi de la date du commentaire à la BDD.
                image: myImage, // Envoi de l'image à la BDD.
                authorId: author.id, // Envoi de l'id de l'auteur du commentaire à la BDD.
                articleId: articleId // Envoi de l'id de l'article concerné par le commentaire à la BDD.
            });
            return res.status(201).json({ message: 'Article created!' }); // Envoi d'un message de succès 201 (Created)
        })
        .catch((error) => {
            // Envoi d'un message d'erreur 500 (Erreur interne au serveur)
            return res.status(500).json({ error: error });
        });
}

// Modification d'un commentaire (commentaire + image).
exports.commentEdit = (req, res) => {
    const commentId = req.params.id; // Récupération de l'id du commentaire à modifier.
    let myComment = req.body.comment; // Récupération du commentaire à modifier dans le formulaire.
    let myImage = "none"; // Initialisation de la variable image à "none" (aucune image).
    if (req.file && req.file.filename) // Si l'image est présente dans le formulaire (image uploadée)
        // Récupération de l'url de l'image uploadée (protocole + nom du serveur + chemin de l'image) et envoi de l'url à la BDD.
        myImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    Comments.findOne({ where: { id: commentId } })  // Récupération du commentaire à modifier dans la BDD.
        .then((comment) => { // Envoi du commentaire à la BDD.
            // Si il y a une image dans l'article
            if (myImage != 'none' && comment.image != 'none') { // Si l'image est présente dans le formulaire (image uploadée) et que l'image existe déjà dans la BDD
                // Suppression de l'image existante dans la BDD.
                const filename = comment.image.split('/images/')[1]; // Récupération du nom de l'image dans la BDD (après le chemin) et envoi de ce nom à la BDD pour suppression.
                fs.unlink(`images/${filename}`, () => { // Suppression de l'image dans le dossier images (dans le serveur).
                });
            }
            // Vérification si l'auteur du commentaire est le même que l'utilisateur connecté (si il est le même on peut modifier le commentaire). 
            // Mettre à jour le commentaire dans la BDD 
            comment.update({
                comment: myComment,  // Envoi du commentaire à la BDD 
                image: myImage  // Envoi de l'image à la BDD.
            })
                .then(() => res.status(201).json({ message: 'Commentaire mis à jour !' })) // Envoi d'un message de succès 201 (Created)
                .catch((error) => res.status(500).json({ message: error })); // Envoi d'un message d'erreur 500 (Erreur interne au serveur)
        })
        .catch((error) => res.status(500).json({ message: error })); // Envoi d'un message d'erreur 500 (Erreur interne au serveur)
}

// Suppression d'un commentaire (commentaire + image) d'un article (article + commentaire).
exports.commentDel = (req, res) => {
    const commentId = req.params.id; // Récupération de l'id du commentaire à supprimé.

    Comments.findOne({ where: { id: commentId } }) // Récupération du commentaire à supprimé dans la BDD 
        .then((comment) => { // Envoi du commentaire à la BDD.
            // Si il y a une image dans l'article (commentaire) et que l'image existe déjà dans la BDD (image uploadée) on supprime l'image dans le serveur.
            if (comment.image != 'none') {
                // Récupération du nom de l'image dans la BDD (après le chemin) et envoi de ce nom à la BDD pour suppression.
                const filename = comment.image.split('/images/')[1];
                // Suppression de l'image dans le dossier images (dans le serveur) fs (file system).
                fs.unlink(`images/${filename}`, () => {
                });
            }
            // Suppression du commentaire dans la BDD (commentaire + image).
            Comments.destroy({ where: { id: commentId } })
                .then(() => res.status(200).json({ message: 'Commentaire supprimé !' })) // Envoi d'un message de succès 200 (OK)
                .catch(error => res.status(400).json({ error })); // Envoi d'un message d'erreur 400 (Bad Request)
        })
        .catch((error) => res.status(500).json({ message: error })); // Envoi d'un message d'erreur 500 (Erreur interne au serveur)
}
