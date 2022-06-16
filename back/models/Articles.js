// 1. Définition de la structure de la table Articles dans la BDD SQL via l'API de NodeJS (création de la table Articles)
// 2. Identifiant unique de l'article (auto-incrémenté) (INTEGER = entier)
// 3. Type de l'identifiant unique de l'article (INTEGER = entier)
// 4. Auto-incrémentation de l'identifiant unique de l'article (true = auto-incrémenté)
// 5. Identifiant unique de l'article (true = clé primaire)
module.exports = (sequelize, Sequelize) => {
    const Articles = sequelize.define("articles", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // 1. Titre de l'article (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du titre de l'article (STRING = chaîne de caractères)
        // 3. Titre de l'article (false = non null)
        article: {
            type: Sequelize.STRING,
            allowNull: false
        },

        // 1. Image de l'article (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type de l'image de l'article (STRING = chaîne de caractères)
        // 3. valeur par défaut de l'image de l'article (image par défaut = "none")
        image: {
            type: Sequelize.STRING,
            defaultValue: "none"
        },

        // 1. Date de publication de l'article (DATE = date)
        // 2. Type de la date de publication de l'article (DATE = date)
        // 3. Date de publication de l'article (false = non null)
        postDate: {
            type: Sequelize.DATE,
            allowNull: false
        }
    })

    // Retourne la structure de la table Articles dans la BDD SQL via l'API de NodeJS (création de la table Articles)
    return Articles;
};
