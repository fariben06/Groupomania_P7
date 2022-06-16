const db = require("../models"); // On récupère le modèle de la base de données
const { Op } = require("sequelize"); // On importe l'opérateur Op de sequelize pour utiliser les opérateurs de comparaison dans les requêtes 
const Likes = db.likes; // On récupère la table likes de la base de données

// Récupération de tous les likes de la base de données 
exports.like = (req, res) => {  // On récupère la requête et la réponse  
    const userId = req.body.userId; // On récupère l'id de l'utilisateur connecté 
    const articleId = req.body.articleId; // On récupère l'id de l'article  

    // Verification si l'utilisateur a deja like l'article 
    Likes.findAll({  // On récupère tous les likes de la base de données 
        where: {
            [Op.and]: [ // On utilise l'opérateur AND pour vérifier si l'utilisateur a deja like l'article 
                { userId: userId }, // On récupère l'id de l'utilisateur 
                { articleId: articleId } // On récupère l'id de l'article
            ]
        }

    }).then((likes) => {
        // Verifie si l'utilisateur n'a pas liker on ajout son like  et on renvoie un message 
        if (!likes || likes.length == 0) { // Si l'utilisateur n'a pas liker l'article 
            Likes.create({ ...req.body }).then(like => { // On crée un like avec les données de la requête 
                return res.status(201).json(like); // On renvoie le like créé  et le status 201 (créé)
            }).catch(err => {
                // Si une erreur est survenue  on renvoie un message d'erreur  et le status 500 (erreur serveur)
                return res.status(500).json({ error: err });
            })
        }
        // Si l'utilisateur à déjà liker on retire son like
        else { // Si l'utilisateur à déjà liker l'article
            Likes.destroy({ // On supprime le like de la base de données
                where: { // On récupère l'id de l'utilisateur et de l'article
                    [Op.and]: [ // On utilise l'opérateur AND pour vérifier si l'utilisateur a deja like l'article
                        { userId: userId }, // On récupère l'id de l'utilisateur
                        { articleId: articleId } // On récupère l'id de l'article  
                    ]
                }
            });
            // On renvoie un message de succès et le status 200 (supprimé)
            return res.status(200).json('like détruit !');
        }
    })
        // Si une erreur est survenue  on renvoie un message d'erreur  et le status 500 (erreur serveur)
        .catch(err => res.status(500).json(err));
}
