// 1. Définition de la structure de la table Tasks dans la BDD SQL via l'API de NodeJS (exemple: création de la table Tasks)
// 2. Identifiant unique de la tâche (auto-incrémenté)
// 3. Type de l'identifiant unique de la tâche (INTEGER = entier)
// 4. Auto-incrémentation de l'identifiant unique de la tâche (true = auto-incrémenté)
// 5. Identifiant unique de la tâche (true = clé primaire)
module.exports = (sequelize, Sequelize) => {
    const Tasks = sequelize.define("tasks", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // 1. Titre de la tâche (varchar(255) = chaîne de caractères de 255 caractères maximum)
        // 2. Type du titre de la tâche (STRING = chaîne de caractères)
        // 3. Titre de la tâche (false = non null)
        tasks: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    })

    // 4. Retourne la structure de la table Tasks dans la BDD SQL via l'API de NodeJS (exemple: création de la table Tasks)
    return Tasks;
};
