import React from "react"; // Importer react pour utiliser les fonctionnalités de react
import axios from "axios"; // Importer axios pour utiliser les fonctionnalités de axios


// Initialisation du composant Task (Afficher/Cacher le formulaire de modification).
export default class Task extends React.Component {
  constructor(props) { // Constructeur du composant Tâche 
    super(props);       // Appel du constructeur de la classe parente (React.Component)
    this.state = {      // Initialisation des variables de l'état
      isLoading: false, // Indicateur de chargement des données (true/false)
      userLogged: props.userLogged, // Indicateur de connexion (true/false)
      task: props.task, // Tâche à afficher (objet)
      addTask: false,   // Indicateur de formulaire d'ajout (true/false)
      editTask: false,  // Indicateur de formulaire de modification (true/false)
      isEdited: false,  // Indicateur de modification (true/false)

      // Valeur des champs de formulaire [Tâche, Nom, Prénom, Email, Mot de passe, Avatar]
      inputValid: [true],          // Indicateur de validité des inputs (true/false)
      validForm: true,             // Indicateur de validité du formulaire (true/false)
      valueTask: props.task.tasks, // Valeur du champ de formulaire (Task)
    };


    this.taskUrl = 'http://localhost:8080/api/tasks';  // URL de l'API pour les tâches (API/tasks)
    this.OnClickEditTask = this.OnClickEditTask.bind(this); // Bind de la fonction OnClickEditTask (Afficher/Cacher le formulaire de modification)
    this.OnDeleteTask = this.OnDeleteTask.bind(this); // Bind de la fonction OnDeleteTask (Suppression d'une tâche)
    this.OnChange = this.OnChange.bind(this);  // Bind de la fonction OnChange (Gestion des events)
  }

  // Afficher/Cacher le formulaire de modification de la tâche (Ajout/Modification).
  async OnClickEditTask(event) {
    let taskId = event.target.parentNode.value; // Récupération de l'id de la tâche (value du button)
    if (!taskId) taskId = event.target.value; // Si l'id n'est pas défini, on récupère l'id de la tâche (value du button)

    // Récupération des variables de l'état du composant (editTask, isEdited, valueTask) 
    const { editTask, isEdited, valueTask } = this.state;
    if (editTask) { // Si le formulaire est affiché (editTask = true)
      if (isEdited) { // Si une modification a été effectuée (isEdited = true)

        // Création de l'objet formData (task = valueTask) pour la requête POST (Ajout/Modification)
        const formData = { task: valueTask };

        // Requête PUT (Ajout/Modification) (API/tasks/id) (formData)
        await axios.put(this.taskUrl + '/' + taskId, formData, {
          headers: {
            // Ajout du token dans les headers de la requête (Authorization) (Bearer) (token)
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => {
          this.setState({ editTask: false }); // On cache le formulaire de modification (editTask = false)
          document.location.reload(); // On recharge la page (reload)
        });
      }
      else this.setState({ editTask: false }); // On cache le formulaire de modification (editTask = false)
    }
    else {
      this.setState({ editTask: true }); // On affiche le formulaire de modification (editTask = true)
    }
  }

  // Suppression d'une tâche (API/tasks/id).
  async OnDeleteTask(event) {
    let taskId = event.target.parentNode.value; // Récupération de l'id de la tâche (value du button)
    if (!taskId) taskId = event.target.value;   // Si l'id n'est pas défini, on récupère l'id de la tâche (value du button)
    // Confirmation de la suppression (window.confirm)
    if (window.confirm(`Vous êtes sur le point de supprimer :\n ${taskId}\nÊtes vous sûre ?`)) {
      // Requête de suppression (API/tasks/id) (taskId) 
      await axios.delete(this.taskUrl + '/' + taskId, {
        headers: {
          // Ajout du token dans les headers de la requête (Authorization) (Bearer) (token)
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
        .then(() => { document.location.reload(); }); // On recharge la page (reload) 
    }
  }

  // Gestion des events (changement des valeurs des champs de formulaire).
  OnChange(event) {
    const { task } = this.state;  // Récupération des variables de l'état du composant (task)
    const myCase = event.target.name; // Récupération du nom du champ de formulaire (myCase)
    switch (myCase) { // Switch sur le nom du champ de formulaire
      case 'task': // Si le champ est la tâche
        // Si une modification a été effectuée (isEdited = true)
        if (task.tasks !== event.target.value) this.setState({ isEdited: true });
        // On remet isEdited à false (isEdited = false)
        else this.setState({ isEdited: false });
        // On vérifie le formulaire (checkForm)
        this.checkForm(event.target);
        // On met à jour la valeur du champ de formulaire (valueTask)
        this.setState({ valueTask: event.target.value });
        break; // On sort de la condition
      default:
        console.error('Rien ici!');
        break;
    }
  }

  // Contrôle des champs de formulaire.
  checkForm(target) {
    const inputName = target.name; // Récupération du nom du champ de formulaire (inputName)
    switch (inputName) { // Switch sur le nom du champ de formulaire
      default: // Si le champ n'est pas défini (default)
      case 'task': // Si le champ est la tâche
        if (target.value.length >= 2) { // Si la longueur du champ est supérieure ou égale à 2
          target.className = "valid"; // On change le style du champ de formulaire (valid)
        }
        else {
          target.className = "error"; // On change le style du champ de formulaire (error)
        }
        break; // On sort de la condition
    }
  }

  // Rendu du composant (render)
  render() {
    // Récupération des variables de l'état du composant (isLoading, userLogged, task, editTask, valueTask)
    const { isLoading, userLogged, task, editTask, valueTask } = this.state;
    return (<>
      {/*Si le composant n'est pas en chargement et que l'utilisateur est connecté et que la tâche existe (isLoading = false && userLogged = true && task = true) */}
      {!isLoading && userLogged && task ? (
        // On crée un div className="task" (key = id de la tâche) 
        <div className="task" key={'Tasks-' + task.id}>
          {/*Si le formulaire est affiché (editTask = true) */}
          {editTask ? (<>

            {/*Label pour le champ de formulaire (Task) */}
            <label htmlFor="Task">Task</label>
            <input key={task.id} id='Task' name='task' type='text' placeholder="Profession ?" // placeholder = "Profession ?"
              defaultValue={valueTask} onChange={this.OnChange} /> {/*defaultValue = valueTask, onChange = OnChange */}
            <div>
              {/* Bouton de validation (OnValidateTask) */}
              <button className="edit actived" aria-label="editTask" value={task.id} onClick={this.OnClickEditTask}>
                <i className="fa-solid fa-pen"></i>  {/* icon = stylo */}
              </button>
              {task.id === 1 ? null : (<>                 {/* Si la tâche n'est pas la tâche 1 (id = 1) */}
                {/* Bouton de suppression (OnDeleteTask) */}
                <button className="delete" aria-label="delTask" value={task.id} onClick={this.OnDeleteTask}>
                  <i className="fa-solid fa-trash"></i>   {/* icon de suppression */}
                </button>
              </>)}
            </div>

          </>) : (<>

            <p>{task.tasks}</p> {/* On affiche la tâche */}
            <div>
              {/* Bouton de modification (OnClickEditTask) */}
              <button className="edit" aria-label="editTask" value={task.id} onClick={this.OnClickEditTask}>
                <span className="hidden">edit task</span>
                <i className="fa-solid fa-pen"></i> {/* icon = stylo */}
              </button>
              {task.id === 1 ? null : (<>                {/* Si la tâche n'est pas la tâche 1 (id = 1) */}
                {/* Bouton de suppression (OnDeleteTask) */}
                <button className="delete" aria-label="delTask" value={task.id} onClick={this.OnDeleteTask}>
                  <i className="fa-solid fa-trash"></i>  {/* icon de suppression */}
                </button>
              </>)}
            </div>

          </>)}
        </div>
      ) : 'Erreur lors du chargement des tâches !'}

    </>)
  }
}
