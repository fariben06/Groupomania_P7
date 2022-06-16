// 1. Définition de la structure de la table Comments dans la BDD SQL via l'API de NodeJS (exemple: création de la table Comments)
// 2. Identifiant unique de la commentaire (auto-incrémenté) (INTEGER = entier)
// 3. Type de l'identifiant unique de la commentaire (INTEGER = entier)
// 4. Auto-incrémentation de l'identifiant unique de la commentaire (true = auto-incrémenté)
// 5. Identifiant unique de la commentaire (true = clé primaire) 
module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // 1. Commentaire (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du commentaire (STRING = chaîne de caractères)
        // 3. Commentaire (false = non null)
        comment: {
            type: Sequelize.STRING,
            allowNull: false
        },

        // 1. Image de la commentaire (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type de l'image de la commentaire (STRING = chaîne de caractères)
        // 3. Image de la commentaire (false = non null)
        image: {
            type: Sequelize.STRING,
            defaultValue: "none"
        },

        // 1. Date de publication de la commentaire (DATE = date)
        // 2. Type de la date de publication de la commentaire (DATE = date)
        postDate: {
            type: Sequelize.DATE
        }
    })

    // Retourne la structure de la table Comments dans la BDD SQL via l'API de NodeJS (exemple: création de la table Comments)
    return Comments;
};
