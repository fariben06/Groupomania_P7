const fs = require('fs'); // Import du module filesystem pour la gestion des images d'articles dans le dossier images du serveur.
const bCrypt = require('bcrypt'); // Hashage du mot de passe d'un utilisateur pour le changement de mot de passe.
const jwt = require('jsonwebtoken'); // Import du module jsonwebtoken pour la gestion des tokens.
const db = require("../models"); // Import du module sequelize pour la gestion de la BDD.
const { Op } = require("sequelize"); // Import du module sequelize pour la gestion de la BDD.
const Users = db.users; // Récupération de la table users pour la gestion de la BDD via un API.
const Tasks = db.tasks; // Récupération de la table des tâches pour la gestion de la BDD via un API.

// Récupération des infos d'un utilisateur
exports.userGet = (req, res) => { // Récupération des infos d'un utilisateur selon son id.
    let authorId = parseInt(req.query.id);
    Users.findOne({
        // Récupération des infos d'un utilisateur selon son id et leur task associé (tâche membre ou administrateur) 
        where: { id: authorId, isDelete: false },
        include: { model: Tasks }
    })
        .then((user) => {
            // Verifie si l'utilisateur existe dans la BDD et si il n'a pas été supprimé par un admin (isDelete = true).
            if (!user)
                return res.status(404).json({ error: 'Utilisateur non trouvé!' }); // Si l'utilisateur n'existe pas, on renvoie une erreur.
            res.status(200).json({ user }); // Si l'utilisateur existe, on renvoie les infos de l'utilisateur et sa tâche associée (tâche membre ou administrateur).
        })
        .catch((error) => {
            // Si une erreur est survenue, on renvoie une erreur de type 500 (erreur interne du serveur).
            return res.status(500).json({ error: error });
        });
};

// Récupération des infos d'un utilisateur selon son nom/prenom 
exports.userSearch = (req, res) => {
    let search = req.query.search; // Récupération du nom/prenom de l'utilisateur.
    Users.findAll({ // Récupération des infos d'un utilisateur selon son nom/prenom.
        where: {
            firstname: { // Condition de recherche sur le nom de l'utilisateur.
                // Opérateur de comparaison : LIKE pour rechercher un nom/prenom contenant la chaine de caractères recherchée.
                [Op.like]: '%' + search + '%'
            }
        },
        // Récupération des infos d'un utilisateur selon son nom/prenom et leur task associé (tâche membre ou administrateur)
        include: { model: Tasks }
    }).then((users) => {
        // Si l'utilisateur n'existe pas, on renvoie une erreur (vide) et un message de type 204 (no content).
        if (!users.length) return res.status(204).json({ message: 'Vide !' });
        // Si l'utilisateur existe, on renvoie les infos de l'utilisateur et sa tâche associée, et un message de type 200 (OK).
        res.status(200).json({ users });
    })
        .catch((error) => {
            // Si une erreur est survenue, on renvoie une erreur de type 500 (erreur interne du serveur).
            return res.status(500).json({ error: error });
        });
};

// Connexion d'un utilisateur via son nom/prenom et mot de passe 
exports.userLogin = (req, res) => {
    // Si les champs email et password sont vides, on renvoie une erreur.
    if (!req.body.email || !req.body.password)
        // Si les champs email et password sont vides, on renvoie une erreur de type 400 (bad request).
        return res.status(400).json({ error: 'Entrée vide !' });
    // Récupération des infos d'un utilisateur selon son email false si il n'existe pas 
    Users.findOne({ where: { email: req.body.email, isDelete: false } })
        .then((user) => { // Si l'utilisateur existe, on renvoie les infos de l'utilisateur.
            if (!user) // Si l'utilisateur n'existe pas, on renvoie une erreur de type 404 (not found).
                return res.status(404).json({ error: 'Utilisateur non trouvé!' });

            // Verifie le mot de passe de l'utilisateur via bCrypt et le mot de passe saisi par l'utilisateur.
            bCrypt.compare(req.body.password, user.password)
                .then(valid => { // Si le mot de passe est correct, on renvoie les infos de l'utilisateur.
                    // Si le mot de passe est incorrect, on renvoie une erreur de type 401 (unauthorized) et un message d'erreur.
                    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect!' });
                    // Si le mot de passe est correct, on renvoie les infos de l'utilisateur et un token de connexion (jwt) qui expirera dans 24 heures.
                    res.status(200).json({
                        userId: user.id, // Id de l'utilisateur.
                        token: jwt.sign( // Création du token de connexion (jwt).
                            { userId: user.id }, // Id de l'utilisateur associé au token.
                            'RANDOM_TOKEN_SECRET', // Clé de cryptage du token.
                            { expiresIn: '24h' } // Expiration du token dans 24 heures.
                        )
                    });
                })
                // Si une erreur est survenue, on renvoie une erreur de type 500 (erreur interne du serveur).
                .catch(error => res.status(500).json({ error }));
        })
        .catch((error) => {
            // Si une erreur est survenue, on renvoie une erreur de type 500 (erreur interne du serveur).
            return res.status(500).json({ error: error });
        });
};

// Inscription d'un utilisateur  avec son nom/prenom, email, mot de passe et role (membre ou administrateur)
exports.userSign = (req, res) => {
    // Verification des champs du formulaire (nom/prenom, email, mot de passe, role)
    if (!req.body.email || !req.body.password)
        // Si les champs email et password sont vides, on renvoie une erreur de type 400 (bad request) et un message d'erreur.
        return res.status(400).json({ error: 'Entrée vide !' });

    // Hashage du mot de passe de l'utilisateur via bCrypt et le nombre de fois de hashage (10) pour le rendre plus robuste.
    bCrypt.hash(req.body.password, 10)
        .then(hash => { // Si le mot de passe est hashé, on renvoie les infos de l'utilisateur.
            console.log('Nouveau registre.'); // Affichage d'un message de type console.
            let objectTasks = { tasks: 'Membre' }; // Création d'un objet contenant la tâche associée à l'utilisateur.
            let objectUser = { // Création d'un objet contenant les infos de l'utilisateur.
                firstname: req.body.firstname, // Nom de l'utilisateur.
                lastname: req.body.lastname, // Prénom de l'utilisateur.
                email: req.body.email, // Email de l'utilisateur.
                password: hash, // Mot de passe hashé de l'utilisateur.
                taskId: 1, // Id de la tâche associée à l'utilisateur.
                isAdmin: 0 // Indicateur de role de l'utilisateur (0 = membre, 1 = administrateur).
            };
            // Récupération des infos de tous les utilisateurs.
            Users.findAll().then((user) => {
                if (!user || user.length == 0) { // Si aucun utilisateur n'existe, on crée l'utilisateur avec les infos de l'utilisateur.
                    Tasks.create({ ...objectTasks }).then((tasks) => { // Création d'une tâche par défaut (membre) pour l'utilisateur.
                        console.log(tasks); // Affichage d'un message de type console pour la tâche créée par défaut.
                    });
                    // Création d'un utilisateur avec les infos de l'utilisateur.
                    // Droits d'aministrations accordés à l'utilisateur.
                    objectUser = {
                        ...objectUser, // Ajout des infos de l'utilisateur dans l'objet.
                        isAdmin: 1 // Indicateur de role de l'utilisateur (0 = membre, 1 = administrateur).
                    };
                }
                // Création du nouveau membre dans la BDD et renvoie les infos du nouveau membre et de sa tâche associée (tâche membre).
                Users.create({ ...objectUser }).then((user) => { // Création du nouveau membre dans la BDD.
                    res.status(201).json({ // Si l'utilisateur a été créé, on renvoie un message de succès code 201 (création).
                        userId: user.id, // Id du nouveau membre.
                        token: jwt.sign( // Création du token pour la connexion du nouveau membre.
                            { userId: user.id }, // On signe le token avec l'id de l'utilisateur pour le renvoyer dans le header de la réponse.
                            'RANDOM_TOKEN_SECRET', // Clé de hashage du token (RANDOM_TOKEN_SECRET).
                            { expiresIn: '24h' } // Expiration du token dans 24h (valeur par défaut).
                        )
                    })
                });
            })
        })
        .catch(error => res.status(500).json({ error })); // Si une erreur est survenue, on renvoie une erreur de type 500 (erreur interne du serveur).
}

// Modification d'un utilisateur.
exports.userEdit = (req, res) => {
    let forDelete = false; // Indicateur de suppression d'un utilisateur (false = non supprimé, true = supprimé).
    if (req.params.delete == 1) forDelete = true; // Si l'utilisateur est supprimé, on change l'indicateur de suppression.
    let userId = req.params.id; // Récupération de l'id de l'utilisateur à modifier.
    let objectUser = { ...req.body }; // Création d'un objet contenant les infos de l'utilisateur.
    // Récupération des infos de l'utilisateur à modifier via son id via la BDD.
    Users.findOne({ where: { id: userId, isDelete: false } })
        .then(user => {
            // Si l'utilisateur veut modifier son avatar existant (avatar existant), on supprime l'ancien avatar.
            if (req.file && user.avatar) {
                // Suppression de l'ancien avatar, Récupération du nom du fichier de l'avatar.
                const filename = user.avatar.split('/avatars/')[1];
                // Suppression du fichier de l'avatar via son nom de fichier (filename) avec fs (file system) et un callback pour vérifier si le fichier a bien été supprimé.
                fs.unlink(`avatars/${filename}`, () => {
                    console.log('--- Avatar supprimé !'); // Affichage d'un message de type console pour la suppression du fichier.
                });
                // Ajout des infos de l'utilisateur dans l'objet (avatar).
                objectUser = {
                    ...objectUser,
                    // Ajout de l'avatar dans l'objet (avatar) avec le chemin du fichier (req.file.filename) pour le renvoyer dans le header de la réponse.
                    avatar: `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`
                };
            }
            // Si l'utilisateur modifie son mot de passe 
            if (objectUser.password) {
                // Hashage du mot de passe de l'utilisateur via bCrypt et le nombre de fois de hashage (10) pour le rendre plus robuste.
                const newPass = bCrypt.hashSync(objectUser.password, 10);
                // Mise a jour de l'objet avec le nouveau mot de passe hashé.
                objectUser = {
                    ...objectUser, // On récupère les infos de l'utilisateur.
                    password: `${newPass}` // On met le nouveau mot de passe hashé dans l'objet user.
                };
            }
            // Si l'utilisateur veut supprimer son compte.
            if (forDelete) {
                if (user.avatar && user.avatar != 'none') { // Et si l'utilisateur a un avatar on le supprime de la BDD et du serveur.
                    // On supprime le fichier de l'avatar.
                    const filename = user.avatar.split('/avatars/')[1];  // On récupère le nom du fichier de l'avatar de l'utilisateur dans la BDD 
                    fs.unlink(`avatars/${filename}`, () => { // On supprime le fichier de l'avatar.
                        console.log('--- Avatar supprimé !'); // On affiche un message de succès.
                    });
                }
                // On met les infos de l'utilisateur dans l'objet user pour le supprimer.
                objectUser = {
                    ...objectUser,
                    firstname: 'Compte', // On met le prénom de l'utilisateur de Compte pour le supprimer.
                    lastname: 'Inactif', // On met le nom de l'utilisateur de Inactif pour le supprimer.
                    avatar: 'none', // On met l'avatar de l'utilisateur de none pour le supprimer.
                    isDelete: `${forDelete}` // On met le booléen isDelete de l'utilisateur à true pour le supprimer.
                };
            }
            // Mise à jour de l'utilisateur dans la BDD 
            Users.update({ ...objectUser }, { where: { id: user.id } })
                .then(() => res.status(200).json({ message: 'Profil modifié !' })) // On affiche un message de succès.
                .catch((error) => res.status(400).json({ error: error })); // On affiche un message d'erreur si il y a une erreur.
        })
        .catch(() => { console.error('Impossible de trouver cet utilisateur!'); });
}

// Suppression d'un utilisateur (isDelete = true) et de son avatar (avatar = none).
exports.userDel = (req, res) => {
    let isAvatar = false; // On initialise la variable isAvatar à false pour ne pas supprimer l'avatar.
    // Si l'utilisateur veut supprimer son avatar on met la variable isAvatar à true pour supprimer l'avatar de la BDD et du serveur.
    if (req.params.avatar == 1) isAvatar = true;

    let userId = req.params.id; // On récupère l'id de l'utilisateur à supprimer.
    Users.findOne({ where: { id: userId } }) // On cherche l'utilisateur dans la BDD avec l'id récupéré précédemment.
        .then(user => { // Si l'utilisateur existe on le supprime de la BDD.
            // Si l'utilisateur a un avatar on le supprime de la BDD et du serveur.
            if (isAvatar && userId) {
                // On récupère le nom du fichier de l'avatar de l'utilisateur dans la BDD  on le supprime du serveur.
                const filename = user.avatar.split('/avatars/')[1];
                fs.unlink(`avatars/${filename}`, () => { // On supprime le fichier de l'avatar de la BDD.
                    console.log('--- Avatar supprimé !'); // On affiche un message de succès.
                });
                // On met l'avatar de l'utilisateur de none pour le supprimer de la BDD et du serveur.
                Users.update({ avatar: 'none' }, { where: { id: userId } })
                    .then(() => {
                        // On affiche un message de succès si l'avatar a bien été supprimé.
                        return res.status(200).json({ message: 'Avatar supprimé !' });
                    })
                    .catch(() => {
                        // On affiche un message d'erreur 304 non modifié si l'avatar n'a pas été supprimé ou car il n'existe pas dans la BDD.
                        return res.status(304);
                    });
            }
            // Si l'utilisateur veut effacer son compte 
            else {
                // Si l'utilisateur a un avatar
                if (user.avatar != 'none') {
                    // On supprime le fichier de l'avatar.
                    const filename = user.avatar.split('/avatars/')[1];
                    fs.unlink(`avatars/${filename}`, () => {
                        console.log('--- Avatar supprimé !');
                    });
                }
                // On supprime l'utilisateur de la BDD avec l'id récupéré précédemment.
                Users.destroy({ where: { id: userId } })
                    .then(() => {
                        // On affiche un message de succès si l'utilisateur a bien été supprimé.
                        return res.status(200).json({ message: 'Compte supprimé !' });
                    })
                    .catch(() => { // On affiche un message d'erreur si il y a une erreur ou si l'utilisateur n'existe pas dans la BDD.
                        return res.status(304).json({ message: 'Compte non supprimé !' });
                    });
            }
        })
        // Si l'utilisateur n'existe pas dans la BDD on affiche un message d'erreur.
        .catch(() => { console.error('Impossible de trouver cet utilisateur!'); });
}
