// 1. Définition de la structure de la table Users dans la BDD SQL via l'API de NodeJS (exemple: création de la table Users)
// 2. Identifiant unique de l'utilisateur (auto-incrémenté)
// 3. Type de l'identifiant unique de l'utilisateur (INTEGER = entier) 
// 4. Auto-incrémentation de l'identifiant unique de l'utilisateur (true = auto-incrémenté)
// 5. Identifiant unique de l'utilisateur (true = clé primaire)
module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // 1. Prénom de l'utilisateur (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du prénom de l'utilisateur (STRING = chaîne de caractères)
        // 3. Valeur par défaut du prénom de l'utilisateur (Utilisateur = prénom par défaut)
        firstname: {
            type: Sequelize.STRING(50),
            defaultValue: "Utilisateur"
        },

        // 1. Nom de l'utilisateur (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du nom de l'utilisateur (STRING = chaîne de caractères)
        // 3. Valeur par défaut du nom de l'utilisateur (Utilisateur = nom par défaut)
        lastname: {
            type: Sequelize.STRING(50),
            defaultValue: "Inconnu"
        },

        // 1. Email de l'utilisateur (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du email de l'utilisateur (STRING = chaîne de caractères)
        // 3. Email de l'utilisateur (false = non null)
        // 4. Email de l'utilisateur (true = unique)
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },

        // 1. Mot de passe de l'utilisateur (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du mot de passe de l'utilisateur (STRING = chaîne de caractères)
        // 3. Mot de passe de l'utilisateur (false = non null)
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        // 1. Avatar de l'utilisateur (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du avatar de l'utilisateur (STRING = chaîne de caractères)
        // 3. Valeur par défaut de l'avatar de l'utilisateur (none = avatar par défaut)
        avatar: {
            type: Sequelize.STRING,
            defaultValue: "none"
        },

        // 1. Indicateur de suppression de l'utilisateur (boolean = vrai ou faux)
        // 2. Type de l'indicateur de suppression de l'utilisateur (BOOLEAN = vrai ou faux)
        // 3. Valeur par défaut de l'indicateur de suppression de l'utilisateur (false = utilisateur non supprimé)
        isDelete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

        // 1. Type de l'indicateur d'administrateur de l'utilisateur (BOOLEAN = vrai ou faux)
        // 2. Valeur par défaut de l'indicateur d'administrateur de l'utilisateur (false = non administrateur)
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    })

    // 3. Retourne la structure de la table Users dans la BDD SQL via l'API de NodeJS (exemple: création de la table Users)
    return Users;
};
