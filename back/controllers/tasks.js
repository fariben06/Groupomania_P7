const db = require("../models"); // Récupération du modèle de la base de données 
const Tasks = db.tasks; // Récupération d'une tâche existante dans la base de données.

// Récupération de toutes les tâches de la base de données
exports.tasksGet = (req, res) => {
    Tasks.findAll().then((tasks) => {
        if (!tasks)
            // Si Aucune tâche n'existe, on renvoie une erreur 204 Aucune tâche trouvée.
            return res.status(204).json({ error: 'Aucune Tâche trouvée !' });
        // Si des tâches existent, on renvoie les tâches en JSON avec un code 200 OK.
        res.status(200).json({ tasks });
    }).catch((error) => {
        // Si une erreur est survenue, on renvoie un code 500 ERREUR INTERNE DU SERVEUR.
        return res.status(500).json({ error: error });
    });
};

// Ajout d'une tâche à la base de données.
exports.taskAdd = (req, res) => {
    console.log(req.body); // Récupération de la valeur de l'tâche dans le body de la requête.
    if (!req.body.newTask)
        // Si le champ newTask est vide, on renvoie un code 400 MAUVAISE DEMANDE.
        return res.status(400).json({ error: 'Entrée vide !' });

    // Création d'une nouvelle tâche avec la valeur reçue dans le body de la requête et l'id de l'utilisateur connecté.
    Tasks.create({ tasks: req.body.newTask }).then((task) => {
        // Si la tâche a été créée, on renvoie un code 201 CREATION OK.
        res.status(201).json({ task: task });
    });
}

// Modification d'une tâche existante dans la base de données
exports.taskEdit = (req, res) => {
    const taskId = req.params.id; // Récupération de l'id de la tâche à modifier 
    const valueTask = req.body.task; // Récupération de la valeur de la tâche à modifier 
    // Si l'id de la tâche à modifier est vide, on renvoie un code 400 MAUVAISE DEMANDE.
    if (!valueTask) return res.status(400).json({ error: 'aucune valeur!' });
    // trouver la tâche à modifier dans la base de données et le modifier avec la valeur reçue
    Tasks.findOne({ where: { id: taskId } }).then(task => {

        // Mettre à jour la tâche avec la valeur reçue 
        Tasks.update({ tasks: valueTask }, { where: { id: task.id } })
            // Si la tâche a été modifiée, on renvoie un code 200 OK.
            .then(() => res.status(200).json({ message: 'Tâche mise à jour !' }))
            // Si la tâche n'a pas été modifiée, on renvoie un code 304 NON MODIFIE.
            .catch(() => res.status(304).json({ message: 'Tâche non mise à jour !' }));
    })
        .catch(() => console.error('Impossible de trouver cet tâche!'));
}

// Suppression d'une tâche existante dans la base de données.
exports.taskDel = (req, res) => {
    const taskId = req.params.id; // Récupération de l'id de la tâche à supprimer 
    Tasks.findOne({ where: { id: taskId } }).then(task => { // Trouver la tâche à supprimer dans la base de données  et le supprimer.
        Tasks.destroy({ where: { id: task.id } })  // Supprimer la tâche dans la base de données avec l'id reçu dans la requête.
            // Si la tâche a été supprimée, on renvoie un code 200 OK.
            .then(() => res.status(200).json({ message: 'Task deleted!' }))
            // Si la tâche n'a pas été supprimée, on renvoie un code 304 NON MODIFIE.
            .catch(() => res.status(304).json({ message: 'Tâche non supprimée !' }));
    })
        .catch(() => console.error('Impossible de trouver cet tâche!'));
}
