// 1. Définition de la structure de la table Likes dans la BDD SQL via l'API de NodeJS (exemple: création de la table Likes)
// 2. Identifiant unique de likes (auto-incrémenté) (INTEGER = entier) 
// 3. Type de l'identifiant unique de likes (INTEGER = entier)
// 4. Auto-incrémentation de l'identifiant unique de likes (true = auto-incrémenté)
// 5. Identifiant unique de likes (true = clé primaire)
module.exports = (sequelize, Sequelize) => {
    const Likes = sequelize.define("likes", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // 1. Identifiant unique de l'utilisateur (INTEGER = entier)
        // 2. Type de l'identifiant unique de l'utilisateur (INTEGER = entier)
        // 3. Identifiant unique de l'utilisateur (false = non null)
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        // 1. Identifiant unique de l'article (INTEGER = entier)
        // 2. Type de l'identifiant unique de l'article (INTEGER = entier)
        // 3. Identifiant unique de l'article (false = non null)
        articleId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

    // 4. Retourne la structure de la table Likes dans la BDD SQL via l'API de NodeJS (exemple: création de la table Likes)
    return Likes;
};
