// Importer les composants nécessaires à la page d'accueil (Home)
import React from 'react'; // Importer React pour utiliser les fonctionnalités de React JS
import axios from 'axios'; // Importer axios pour utiliser les fonctionnalités de axios  pour les requêtes HTTP
import App from "../App"; // Importer le composant App pour récupérer les données de l'utilisateur connecté
import Avatar from '../Avatar/Avatar'; // Importer le composant Avatar pour afficher l'avatar de l'utilisateur connecté

// Créer la classe Profile pour afficher le profil de l'utilisateur connecté 
export default class Profile extends React.Component {
  constructor(props) { // Constructeur de la classe Profile (récupération des données de l'utilisateur connecté)
    super(props); // Appel du constructeur de la classe parente (React) 
    this.state = { // Définition des variables de la classe Profile  
      userLogged: props.userLogged, // Utilisateur connecté (récupéré dans le composant App)  
      tasksList: props.tasksList, // Liste des tâches (récupéré dans le composant App) - Liste des tâches de l'utilisateur connecté
      // Formulaires des inputs [Nom, Prénom, Email, Mot de passe, Avatar]
      inputValid: [true, true, true, true, true],
      validForm: true,
      valueFirstname: props.userLogged.firstname,
      valueLastname: props.userLogged.lastname,
      valueEmail: props.userLogged.email,
      valuePassword: null,
      fileAvatar: null,
      // Tâche courante (tâche courante de l'utilisateur connecté) et position de la tâche dans la liste des tâches.
      curTaskId: props.userLogged.task.id, // Id de la tâche courante de l'utilisateur connecté
      curTask: props.userLogged.task.tasks, // Tâche courante de l'utilisateur connecté (récupéré dans le composant App)
      curPosTask: null
    }
    // Récupération de l'url de l'API pour les requêtes HTTP 
    this.userUrl = 'http://localhost:8080/api/user'; // Url de l'API pour les requêtes HTTP  pour les utilisateurs
    this.taskUrl = 'http://localhost:8080/api/tasks'; // Url de l'API pour les requêtes HTTP  pour les tâches de l'utilisateur connecté

    this.OnSubmit = this.OnSubmit.bind(this); // Gestion d'envoi (bind) de la fonction OnSubmit 
    this.OnChange = this.OnChange.bind(this); // Gestion des events (bind) de la fonction OnChange
    this.deleteAvatar = this.deleteAvatar.bind(this); // Suppression de l'avatar de l'utilisateur connecté  
    this.delete = this.delete.bind(this); // Suppression de l'utilisateur connecté
    this.OnClickTask = this.OnClickTask.bind(this); // Gestion du clic sur une tâche de la liste des tâches de l'utilisateur connecté
  }

  // Gestion d'envoi des données de l'utilisateur connecté, modification de son profil et récupération de la liste des tâches de l'utilisateur connecté.
  async OnSubmit(event) {
    const { userLogged, valueFirstname, valueLastname, valueEmail, valuePassword, fileAvatar, curTaskId } = this.state;
    // L'objet contient des formes de valeurs pour les données de l'utilisateur connecté et des données de la tâche courante.
    const formData = new FormData(); // Création d'un objet FormData pour les données de l'utilisateur connecté
    formData.append("userId", userLogged.id); // Ajout de l'id de l'utilisateur connecté à l'objet FormData  
    formData.append("firstname", valueFirstname); // Ajout du prénom de l'utilisateur connecté à l'objet FormData
    formData.append("lastname", valueLastname); // Ajout du nom de l'utilisateur connecté à l'objet FormData
    formData.append("taskId", curTaskId); // Ajout de l'id de la tâche courante à l'objet FormData  
    formData.append("email", valueEmail); // Ajout de l'email de l'utilisateur connecté à l'objet FormData 
    // Si le mot de passe est renseigné, alors on ajoute le mot de passe à l'objet FormData  sinon on ne fait rien (pas de modification du mot de passe)
    if (valuePassword != null) formData.append("password", valuePassword);
    // Si l'avatar est renseigné, alors on ajoute l'avatar à l'objet FormData  sinon on ne fait rien (pas de modification de l'avatar)
    if (fileAvatar != null) formData.append("avatar", fileAvatar);

    event.preventDefault();
    // Envoi de la requête HTTP pour la modification du profil de l'utilisateur connecté 
    // et récupération de la liste des tâches de l'utilisateur connecté  avec axios et la méthode PUT
    await axios.put(this.userUrl + '/' + userLogged.id + '/' + 0, formData, {
      headers: { // Ajout des headers à la requête HTTP pour la modification du profil de l'utilisateur connecté
        Authorization: "Bearer " + sessionStorage.getItem("token") // Ajout du token d'authentification à la requête HTTP pour la modification du profil de l'utilisateur connecté
      }
    })
      .then(() => App.ReloadApp())
      .catch(error => {  // Gestion des erreurs.
        console.error('Error Edit Avatar!'); // Affichage d'un message d'erreur si la modification du profil de l'utilisateur connecté a échoué 
        console.warn(error);  // Affichage d'un message d'erreur en cas d'erreur de réponse de l'API 
      });

  }

  // Gestion des events des inputs [Nom, Prénom, Email, Mot de passe, Avatar] et récupération de la liste des tâches de l'utilisateur connecté.
  OnChange(event) {
    const myCase = event.target.name; // Récupération du nom de l'input pour le traitement correspondant à l'input
    switch (myCase) { // Traitement du nom de l'input pour le traitement correspondant à l'input 
      case 'firstname':
        this.checkForm(event.target); // Vérification du formulaire pour le champ prénom 
        this.setState({ valueFirstname: event.target.value }); // Récupération du prénom de l'utilisateur connecté et mise à jour de la valeur du champ prénom dans le state de l'application
        break; // Fin du traitement du champ prénom  

      case 'lastname':
        this.checkForm(event.target); // Vérification du formulaire pour le champ nom   
        this.setState({ valueLastname: event.target.value }); // Récupération du nom de l'utilisateur connecté et mise à jour de la valeur du champ nom dans le state  
        break; // Fin du traitement du champ nom

      case 'email':
        this.checkForm(event.target); // Vérification du formulaire pour le champ email 
        this.setState({ valueEmail: event.target.value }); // Récupération de l'email de l'utilisateur connecté et mise à jour de la valeur du champ email dans le state (email est unique)
        break; // Fin du traitement du champ email 

      case 'password':
        this.checkForm(event.target); // Vérification du formulaire pour le champ mot de passe 
        this.setState({ valuePassword: event.target.value }); // Récupération du mot de passe de l'utilisateur connecté et mise à jour de la valeur du champ mot de passe dans le state (mot de passe est unique)
        break; // Fin du traitement du champ mot de passe

      case 'avatar':
        this.checkForm(event.target); // Vérification du formulaire pour le champ avatar
        this.setState({ fileAvatar: event.target.files[0] }); // Récupération de l'avatar de l'utilisateur connecté et mise à jour de la valeur du champ avatar dans le state (avatar est unique)
        break; // Fin du traitement du champ avatar
      default: // Traitement par défaut pour le nom de l'input qui n'est pas reconnu par le switch 
        console.error('Rien ici !'); // Affichage d'un message d'erreur si le nom de l'input n'est pas reconnu par le switch
        break; // Fin du traitement par défaut 
    }
  }

  // Contrôle des champs de formulaire pour les champs prénom, nom, email et mot de passe, et pour le champ avatar.
  checkForm(target) {
    const { inputValid } = this.state; // Récupération du state inputValid 
    const inputName = target.name; // Récupération du nom du champ de formulaire pour le traitement correspondant à l'input
    let inputs = [...inputValid]; // Création d'un tableau inputs qui contient les valeurs du state inputValid  et qui est un tableau d'objets 
    let pos = 0; // Initialisation de la position du tableau inputs à 0  
    switch (inputName) { // Traitement du nom de l'input pour le traitement correspondant à l'input
      default: // Traitement par défaut pour le nom de l'input qui n'est pas reconnu par le switch
        console.error('Nom de champ inconnu!'); // Affichage d'un message d'erreur si le nom de l'input n'est pas reconnu par le switch
        break; // Fin du traitement par défaut

      case 'firstname': // Traitement du nom de l'input pour le traitement correspondant à l'input prénom
      case 'lastname':  // Traitement du nom de l'input pour le traitement correspondant à l'input nom
        if (inputName === 'lastname') pos = 1; // Si le nom du champ de formulaire est nom, alors on met la position du tableau inputs à 1 (position du champ nom)
        // Si la longueur du champ de formulaire est supérieure ou égale à 2 caractères alors
        // on met la valeur du champ de formulaire dans le tableau inputs à la position pos (position du champ nom)
        if (target.value.length >= 2) {
          target.className = "valid"; // Ajout d'un style valid au champ de formulaire pour le champ nom
          inputs[pos] = true; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ nom) à true
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        }
        else {
          target.className = "error"; // Ajout d'un style error au champ de formulaire pour le champ nom  
          inputs[pos] = false; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ nom) à false
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        }
        break; // Fin du traitement du champ nom 

      case 'email':
        // Création d'une expression régulière pour le champ email  qui doit contenir un @ et un  point et un chiffre et un caractère alphanumérique. 
        let regEmail = new RegExp(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g);
        pos = 2; // Mise à jour de la position du tableau inputs à 2 (position du champ email) pour le champ email 
        // Si la valeur du champ de formulaire ne correspond pas à l'expression régulière alors on met la valeur 
        // du champ de formulaire dans le tableau inputs à la position pos(position du champ email) à false et on met le style error au champ de formulaire
        if (!target.value.match(regEmail)) {
          target.className = "error"; // Ajout d'un style error au champ de formulaire pour le champ email
          inputs[pos] = false; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ email) à false
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        }
        else {
          target.className = "valid"; // Ajout d'un style valid au champ de formulaire pour le champ email 
          inputs[pos] = true; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ email) à true et on met le style valid au champ de formulaire
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets) 
        }
        break; // Fin du traitement du champ email

      case 'password':
        pos = 3; // Mise à jour de la position du tableau inputs à 3 (position du champ mot de passe) pour le champ mot de passe 
        // Si la longueur du champ de formulaire est supérieure ou égale à 4 caractères alors on met la valeur du champ
        // de formulaire dans le tableau inputs à la position pos (position du champ mot de passe) à true et on met le style valid au champ de formulaire
        if (target.value.length >= 4) {
          target.className = "valid"; // Ajout d'un style valid au champ de formulaire pour le champ mot de passe 
          inputs[pos] = true; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ mot de passe) à true
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        }
        else {
          target.className = "error"; // Ajout d'un style error au champ de formulaire pour le champ mot de passe
          inputs[pos] = false; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ mot de passe) à false
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        }
        // Si la longueur du champ de formulaire est égale à 0 alors on met la valeur du champ de formulaire dans le tableau 
        // inputs à la position pos (position du champ mot de passe) à false et on met le style error au champ de formulaire
        if (target.value.length === 0) {
          target.className = ""; // Suppression du style valid au champ de formulaire pour le champ mot de passe
          inputs[pos] = true; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ mot de passe) à true
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        };
        break; // Fin du traitement du champ mot de passe

      case 'avatar': // Traitement du nom de l'input pour le traitement correspondant à l'input avatar
        pos = 4; // Mise à jour de la position du tableau inputs à 4 (position du champ avatar) pour le champ avatar
        // Si la valeur du champ de formulaire n'est pas vide alors on met la valeur du champ de formulaire dans le tableau
        // inputs à la position pos(position du champ avatar) à true et on met le style valid au champ de formulaire
        if (target.value) {
          target.className = "valid"; // Ajout d'un style valid au champ de formulaire pour le champ avatar
          inputs[pos] = true; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ avatar) à true
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        }
        else {
          target.className = ""; // Suppression du style valid au champ de formulaire pour le champ avatar
          inputs[pos] = false; // Mise à jour de la valeur du tableau inputs à la position pos (position du champ avatar) à false
          this.setState({ inputValid: inputs }); // Mise à jour du state inputValid avec le tableau inputs (tableau d'objets)
        };
        break; // Fin du traitement du champ avatar

    }

    // Si tous les éléments du tableau inputs sont vrais alors on met le state isValid à true et on met le style valid au bouton submit
    if (inputs.every(element => element === true))
      this.setState({ validForm: false }); // Mise à jour du state validForm à false pour le formulaire 
    else
      this.setState({ validForm: true }); // Mise à jour du state validForm à true pour le formulaire 
  }

  // Modification de la tâche courante (click sur une tâche) et récupération de la position de la tâche dans la liste des tâches.
  async OnClickTask(event) {
    // Récupération de la position de la tâche dans la liste des tâches  et récupération de la tâche courante
    const { tasksList, curPosTask, userLogged } = this.state;
    let posTask = curPosTask + 1; // Mise à jour de la position de la tâche courante dans la liste des tâches à 1 (position de la tâche courante)
    if (!curPosTask) posTask = 1; // Si la position de la tâche courante est nulle alors on met la position de la tâche courante à 1 pour la première tâche
    if (posTask >= tasksList.length) posTask = 0; // Si la position de la tâche courante est supérieure ou égale à la longueur de la liste des tâches alors on met la position de la tâche courante à 0 pour la première tâche

    // Parcours de la liste des tâches pour récupérer la tâche courante et la tâche suivante dans la liste des tâches
    tasksList.forEach((task, index) => {
      if (posTask === index) { // Si la position de la tâche courante est égale à l'index de la tâche courante dans la liste des tâches alors on met la tâche courante dans la variable task.

        if (task.id === userLogged.task.id) {  // Si la tâche courante est la tâche courante de l'utilisateur connecté alors on met la tâche courante dans la variable task. 
          event.target.className = ""; // Suppression du style valid au bouton submit pour la tâche courante
          this.setState({ validForm: true }); // Mise à jour du state validForm à true pour le formulaire 
        }
        else {
          event.target.className = "valid"; // Ajout d'un style valid au bouton submit pour la tâche courante
          this.setState({ validForm: false }); // Mise à jour du state validForm à false pour le formulaire 
        }
        this.setState({
          curPosTask: posTask, // Mise à jour du state curPosTask à la position de la tâche courante dans la liste des tâches
          curTaskId: tasksList[posTask].id, // Mise à jour du state curTaskId à l'id de la tâche courante
          curTask: tasksList[posTask].tasks // Mise à jour du state curTask à la tâche courante dans la liste des tâches 
        });

      }
    });
  }


  // Suppression de l'avatar de l'utilisateur (Avatar par défaut) et réinitialisation du champ input.  
  async deleteAvatar() {
    const { userLogged } = this.state;
    if (window.confirm('Votre avatar est sur le point d\'être supprimer...\nÊtes vous sûre ?')) {
      // Supprimer la demande de l'utilisateur (avatar par défaut) et réinitialiser le champ input.
      await axios.delete(this.userUrl + '/' + userLogged.id + '/' + 1, {
        headers: {
          // Envoyer le token dans les headers de la requête pour authentifier l'utilisateur (sécurité).
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      }).then(() => App.ReloadApp()); // Recharger l'application pour mettre à jour l'avatar de l'utilisateur.
    }
  }


  // Suppression du compte de l'utilisateur et des données associées à lui (tâches, commentaires, etc.).
  async delete() {
    const { userLogged } = this.state;
    if (window.confirm('Vous êtes sur le point de supprimer votre compte...\nÊtes vous sûre ?')) {
      // L'objet contient des formes de valeur différentes, il faut donc les transformer en string pour les envoyer dans la requête HTTP.
      const formData = new FormData(); // Création d'un objet FormData pour envoyer les données dans la requête HTTP.
      formData.append('', userLogged); // Ajout de l'objet userLogged dans l'objet FormData pour envoyer les données dans la requête HTTP.
      // Envoi de la requête HTTP pour supprimer le compte de l'utilisateur et les données associées à lui.
      await axios.put(this.userUrl + '/' + userLogged.id + '/' + 1, formData, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token") // Ajout du token dans les headers de la requête HTTP.
        }
      })
        .then(() => {
          sessionStorage.clear(); // Suppression du token dans la session storage du navigateur.
          App.ReloadApp(); // Rechargement de la page pour rediriger l'utilisateur vers la page de connexion.
        });
    }
  }

  render() {
    const { userLogged } = this.state; // Récupération de l'utilisateur connecté.
    const { isLoading, curTask } = this.state; // Récupération de la tâche courante de l'utilisateur connecté.
    // Récupération des données du formulaire de modification, de l'avatar, du nom, du prénom, de l'email, et de l'image de l'avatar de l'utilisateur connecté.
    const { validForm, valueFirstname, valueLastname, valueEmail, fileAvatar } = this.state;
    return (<>

      {/* Div contenant le formulaire de modification du profil de l'utilisateur. */}
      <div className='profile'>
        <form onSubmit={this.OnSubmit} disabled={validForm}> {/* Désactivation du formulaire si les champs ne sont pas valides. */}
          {/* Div contenant le nom de l'utilisateur, le prénom, l'email et le mot de passe, ainsi que le bouton de modification de l'avatar. */}
          {!isLoading && userLogged ? <Avatar dataUser={{ ...userLogged, isProfile: true }} fileAvatar={fileAvatar} OnChange={this.OnChange} deleteAvatar={this.deleteAvatar} /> : null}
          <div className="names-content">
            <label htmlFor="Prenom">Prénom</label>
            <input id='Prenom' name='firstname' type='text' placeholder='Prénom'
              value={valueFirstname} onChange={this.OnChange} required /> {/* OnChange est appelé lorsque l'utilisateur change la valeur du champ input. */}

            <label htmlFor="Nom">Nom</label>
            <input id='Nom' name='lastname' type='text' placeholder='Nom'
              value={valueLastname} onChange={this.OnChange} required />
          </div>
          <label htmlFor="Tasks">tâche</label>
          <input id='Tasks' name='tasks' type='text' readOnly
            label='Tâche' value={curTask} onClick={this.OnClickTask} />

          <label htmlFor="Email">email</label>
          {/* Si l'email est valide, on affiche l'email de l'utilisateur. Sinon, on affiche un message d'erreur. */}
          <input id='Email' name='email' type='email' placeholder='Ex : example@groupomania.com' // On met le champ email en readOnly pour ne pas pouvoir le modifier.
            label='Adresse email' value={valueEmail} onChange={this.OnChange} required /> {/* On peut modifier l'email de l'utilisateur  en cliquant sur le champ email. */}

          {/* Réinitialisation du mot de passe de l'utilisateur*/}
          <label htmlFor="NewPassword">password</label>
          <input id='NewPassword' name='password' type='password' placeholder='Nouveau mot de passe'
            label='Mot de passe' onChange={this.OnChange} />
          <input type='submit' disabled={validForm} label='Mettre à jour' value='Mettre à jour' />
        </form>

        <h3>Supprimer le compte !</h3>
        <input type='button' onClick={this.delete} label='Delete' value='Supprimer le compte!' />
      </div>
    </>)
  }
}
