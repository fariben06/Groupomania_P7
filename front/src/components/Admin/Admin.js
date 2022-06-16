import React from "react"; // Importer React pour utiliser les fonctionnalités de React
import axios from "axios"; // Importer axios pour faire des requêtes HTTP
import App from "../App"; // Importer App pour pouvoir utiliser les fonctionnalités de App
import Task from "./Task"; // Importer Task pour pouvoir utiliser les fonctionnalités de Task
import Member from "./Member"; // Importer Member pour pouvoir utiliser les fonctionnalités de Member

// Page Admin (Admin)  
export default class Admin extends React.Component {
  constructor(props) { // Constructeur de la classe Admin 
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Définition du state de la classe Admin
      // Données de la page 
      userLogged: props.userLogged, // Utilisateur connecté (Admin)
      tasksList: props.tasksList, // Liste des tâches (Admin)
      addTask: false,  // Ajout d'une tâche (Admin)  (false = caché)
      editTask: false, // Edition d'une tâche (Admin)  (false = caché)
      isEdited: false, // Edition d'une tâche (Admin)  (false = non effectuée)

      //Inputs [Task, Last, Email, Password, Avatar]
      inputValid: [false], // Validation des inputs (false = non validé)
      validForm: true, // Validation du formulaire (true = validé)
      valueTask: '',  // Valeur de l'input (Tâche)
      valueSearch: '', // Valeur du champ de saisie (Admin)
      searchResult: null, // Résultat de la recherche (Admin)
      isLoading: false  // Chargement (Admin) (false = non chargé)
    }

    // URL 
    this.userUrl = 'http://localhost:8080/api/user'; // URL de l'API (Utilisateur)
    this.taskUrl = 'http://localhost:8080/api/tasks'; // URL de l'API (Tâche)
    // Champ de formulaire de recherche 
    this.OnClickAddTask = this.OnClickAddTask.bind(this); // Ajout d'une tâche (Admin) 
    this.OnAddTask = this.OnAddTask.bind(this); // Ajout d'une tâche (Admin)
    this.OnChange = this.OnChange.bind(this);  // Gestion des events (Admin)
  }

  // Afficher/Cacher le formulaire d'ajout d'une tâche (Admin)
  OnClickAddTask() {
    const { addTask } = this.state; // Récupération du state de la classe Admin (addTask)
    if (addTask) this.setState({ addTask: false });  // Si addTask est true, on le met à false (caché)  et inversement (visible)
    else this.setState({ addTask: true }); // Si addTask est false, on le met à true (visible) et inversement (caché)  et inversement (visible)
  }

  // Ajout d'une tâche (Admin)
  async OnAddTask(event) {
    const { valueTask } = this.state; // Récupération du state de la classe Admin (valueTask)
    const formData = { newTask: valueTask }; // Création d'un objet contenant les données du formulaire (Tâche)


    event.preventDefault();
    await axios.post(this.taskUrl, formData, {
      headers: {
        'Authorization': "Bearer " + sessionStorage.getItem("token") // Ajout du token dans les headers de la requête HTTP (Tâche)
      }
    })
      .then(() => App.ReloadApp()) // Rafraichissement de la page (App)
      .catch(error => { // Gestion des erreurs (Admin)
        console.error('Erreur lors de l\'ajout d\'une tâche !'); // Affichage d'un message d'erreur (Admin)
        console.warn(error); // Affichage de l'erreur (Admin)
      });
  }

  // Gestion des events (Admin)
  OnChange(event) {
    const myCase = event.target.name; // Récupération du nom du champ (Admin)
    switch (myCase) { // Switch sur le nom du champ (Admin)
      case 'task': // Si le champ est la tâche (Admin)
        this.checkForm(event.target); // Vérification du formulaire (Admin) (Tâche)
        this.setState({ valueTask: event.target.value }); // Mise à jour du state de la classe Admin (valueTask) (Tâche)
        break; // On sort de la condition (Admin) (Tâche)

      case 'search':  // Si le champ est la recherche (Admin) 
        this.checkForm(event.target); // Vérification du formulaire (Admin) (Recherche)
        this.setState({ valueSearch: event.target.value }); // Mise à jour du state de la classe Admin (valueSearch) (Recherche)
        break; // On sort de la condition (Admin) (Recherche)
      default: // Si le champ n'est pas reconnu (Admin)
        console.error('Rien ici!'); // Affichage d'un message d'erreur (Admin)
        break; // On sort de la condition (Admin)
    }
  }

  // Contrôle des champs de formulaire (Admin)
  checkForm(target) {
    const { inputValid, valueSearch } = this.state; // Récupération du state de la classe Admin (inputValid, valueSearch)
    const inputName = target.name; // Récupération du nom du champ (Admin)
    let inputs = [...inputValid]; // Création d'un tableau contenant les valeurs des inputs (Admin) (inputValid)
    let pos = 0; // Position du champ dans le tableau (Admin) (inputValid) (inputs)
    switch (inputName) { // Switch sur le nom du champ (Admin)
      default: // Si le champ n'est pas reconnu (Admin) (inputValid) 
      case 'task': // Si le champ est la tâche (Admin) (inputValid)
        if (target.value.length >= 2) { // Si la longueur du champ est supérieure ou égale à 2 (Admin) (inputValid)
          // Changer le style du champ (Admin) (inputValid) (inputs) true = validé
          target.className = "valid";
          inputs[pos] = true;
          this.setState({ inputValid: inputs });
        }
        else {
          // Changer le style du champ (Admin) (inputValid) (inputs) false = non validé
          target.className = "error";
          inputs[pos] = false;
          this.setState({ inputValid: inputs });
        }
        break; // On sort de la condition (Admin) (inputValid) (inputs)

      // Champ de recherche 
      case 'search':
        if (target.value.length >= 2) {
          // Recherche dans la base de données où le prénom/nom contient la valeurRechercher
          axios.get(this.userUrl + '/search?search=' + valueSearch)
            .then((res) => { // Récupération des données (Admin) (inputValid) (inputs)
              this.setState({ searchResult: res.data.users }); // Mise à jour du state de la classe Admin (searchResult) (inputs)
              // Changer le style d'entrée si la recherche est correcte
              target.className = "valid";
            })
            .catch(error => { // Gestion des erreurs (Admin)
              this.setState({ searchResult: null });
              // Changer le style d'entrée si la recherche n'est pas correcte
              target.className = "error";
              console.error('Erreur de recherche d\'utilisateur!');
              console.warn(error); // Affichage de l'erreur (Admin)
            });

          // Changer le style par défaut 
          target.className = "";
        }
        else if (target.value.length === 0) { // Si la longueur du champ est égale à 0 (Admin) (inputValid) (inputs)
          // Changer le style par défaut 
          target.className = "";
          this.setState({ searchResult: null }); // Mise à jour du state de la classe Admin (searchResult) (inputs)
        }
        else {
          // Changer le style d'entrée si la recherche n'est pas correcte
          target.className = "error";
          this.setState({ searchResult: null }); // Mise à jour du state de la classe Admin (searchResult) (inputs)
        }
        break; // On sort de la condition (Admin) (inputValid) (inputs)
    }
    // Si tous les champs sont valides (Admin) (inputValid) (inputs)
    if (inputs.every(element => element === true))
      this.setState({ validForm: false });  // Mise à jour du state de la classe Admin (validForm), false (inputs) 
    else
      this.setState({ validForm: true });  // Mise à jour du state de la classe Admin (validForm), true (inputs)
  }

  render() {
    // Récupération du state de la classe Admin (inputValid, valueTask, valueSearch, searchResult, validForm) 
    const { isLoading, userLogged, tasksList, addTask, valueTask, validForm } = this.state;
    const { valueSearch, searchResult } = this.state; // Récupération du state de la classe Admin (valueSearch, searchResult)
    return (<>

      {/* Panneau d'administration, Gestion des utilisateurs, Rechercher un membre, Gestion des tâches, Ajouter une tâche */}
      {!isLoading && userLogged ? (<>
        <div className="admin-panel">
          <h2><i className="fa-solid fa-gear"></i> Panneau d'administration</h2>
          <h3><i className="fa-solid fa-people-line"></i> Gestion des utilisateurs</h3>
          <label htmlFor="Search">Rechercher</label>
          <input key={'member'} id="Search" type='text' name='search' label='search'
            placeholder="Rechercher un membre..." value={valueSearch} onChange={this.OnChange} />

          {/* Si la recherche est renseignée, affichage des résultats */}
          {valueSearch ? (<>
            <h3>Membres trouvés :</h3>
            <div className="members-result">
              {searchResult ? searchResult.map((user) => (
                <Member key={'member-' + user.id} userLogged={userLogged} member={user} />
              )) : (<>Aucun résultat</>)}
            </div>


          </>) : null}    {/* Fin de la condition */}

          {/* Gestion des tâches */}
          <h3><i className="fa-solid fa-box-archive"></i> Gestion des  tâches</h3>
          <button onClick={this.OnClickAddTask} aria-label='add' ><i className="fa-solid fa-plus"></i> </button>

          {addTask ? <form onSubmit={this.OnAddTask} disabled={validForm} >     {/* Si la tâche est ajoutée, on affiche le formulaire */}
            <label htmlFor="Task">Nouvel tâche</label>                         {/* Label de la tâche */}
            <input id='Task' name='task' type='text' placeholder="Profession ?"     // Champ de saisie de la tâche.
              value={valueTask} onChange={this.OnChange} />                     {/* Valeur de la tâche */}
            <button type='submit' disabled={validForm} aria-label="sendTask">   {/* Bouton d'envoi de la tâche */}
              <i className="fa-solid fa-paper-plane"></i>                       {/* Icone de l'envoi de la tâche */}
            </button>
          </form> : null}                                                       {/* Fin de la condition */}
          {/* Liste des tâches */}
          {tasksList ? tasksList.map((task, index) => (
            // Création d'un key pour chaque tâche (Admin) 
            // Si aucune tâche n'est trouvée on affiche un message aucune tâche trouvé
            <Task key={index} userLogged={userLogged} task={task} />
          )) : 'Aucune tâche trouvé!'}
        </div>
      </>) : 'Erreur lors du chargement du panneau d\'administration !'}

    </>)
  }
}
