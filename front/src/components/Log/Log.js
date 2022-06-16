import React from "react"; // Importer React pour utiliser les fonctionnalités de React dans le code JavaScript
import axios from "axios"; // Importer axios pour utiliser les fonctionnalités de axios pour les requêtes HTTP
import App from "../App"; // Importer App pour afficher la page d'accueil de l'application
import "./Log.css"; // Importer le fichier CSS pour la page de connexion de l'application

// Création de la classe Log pour la page de connexion de l'application
export default class Log extends React.Component {
  constructor(props) { // Constructeur de la classe Log
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Définition du state de la classe Log
      isLoading: false, // Active pour toutes les requêtes HTTP
      curPage: 'Login' // Page actuelle de la classe Log
    }
    this.navigateTo = this.navigateTo.bind(this); // Définition de la fonction navigateTo pour changer de page de la classe Log
  }

  // Modification de la page à afficher (curPage) en fonction de l'id de la page cliquée.
  navigateTo(event) {
    const myPage = event.target.value; // Récupération de l'id de la page cliquée
    this.setState({ curPage: myPage }); // Modification de la page actuelle de la classe Log
  }

  // Mise en place du composant selon la page actuelle. (curPage)
  setComponent() {
    const { curPage } = this.state; // Récupération de la page actuelle de la classe Log
    switch (curPage) { // Switch sur la page actuelle de la classe Log
      case 'Login': // Si la page actuelle de la classe Log est la page de connexion (Login)
        return (<><Login navigateTo={this.navigateTo} /></>); // Mise en place du composant Login
      case 'Register': // Si la page actuelle de la classe Log est la page d'inscription (Register)
        return (<><Register navigateTo={this.navigateTo} /></>); // Mise en place du composant Register
      default: // Sinon (par défaut)
        break; // Pas de changement de page de la classe Log (par défaut)
    }
  }

  // Fonction render de la classe Log (affichage de la page de connexion de l'application)
  render() {
    const { isLoading } = this.state; // Récupération de l'état de la classe Log (isLoading)
    return (<>                    {/* Début du composant Log */}

      {!isLoading ? (<>           {/* Début du composant Log */}
        {this.setComponent()}     {/* Mise en place du composant selon la page actuelle de la classe Log */}
      </>) : (<></>)}

    </>)
  }
}
// Fin de la classe Log 

// Mise en place du composant Login pour la page de connexion de l'application
class Login extends React.Component {
  constructor(props) { // Constructeur de la classe Login
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Définition du state de la classe Login
      // ENTRÉES DE VALEURS DES INPUTS DE LA PAGE DE CONNEXION DE L'APPLICATION
      valueEmail: '',                 // Adresse Email de l'utilisateur
      valuePassword: '',              // Mot de passe de l'utilisateur

      // FORMULAIRE VALABLE OU PAS, [Email, Mot de passe]     
      inputValid: [false, false],     // Inputs valides ou non
      validForm: true,                // Formulaire valide ou non
      // OPTIONS DE LA PAGE DE CONNEXION DE L'APPLICATION
      isLoading: false,               // Chargement de la page de connexion de l'application (true/false)            
      inAction: false,                // Action en cours (true/false)               
      error: ''                       // Erreur de connexion (message d'erreur)
    }

    // URL de récupération des données de l'utilisateur (API) (localhost:8080/api/user)
    this.userUrl = 'http://localhost:8080/api/user';
    // URL de connexion de l'utilisateur (authentification) (localhost:8080/api/auth)
    this.authUrl = 'http://localhost:8080/api/auth/login';
    // OnClick de la page de connexion de l'application (navigateTo) (Login) (localhost:8080/api/auth)
    this.postLogin = this.postLogin.bind(this); // Définition de la fonction postLogin pour la page de connexion de l'app.
    this.OnChange = this.OnChange.bind(this); // Définition de la fonction OnChange pour la page de connexion de l'app.
  }

  // Requête d'authentification de l'utilisateur (POST) (localhost:8080/api/auth)
  async postLogin(event) { // Fonction postLogin pour la page de connexion de l'app.
    event.preventDefault(); // Empêche le rechargement de la page lors du clic sur le bouton de connexion de l'application
    // Modification du state de la classe Login (validForm, inAction, error)
    // pour afficher le chargement de la page de connexion de l'application
    this.setState({ validForm: true, inAction: true, error: '' });
    // Récupération des valeurs des inputs de la page de connexion de l'application, (valueEmail, valuePassword)
    const { valueEmail, valuePassword } = this.state;
    const dataPost = { // Définition des données de la requête POST
      email: valueEmail, // Adresse Email de l'utilisateur
      password: valuePassword // Mot de passe de l'utilisateur
    };

    // Post request de la requête d'authentification de l'utilisateur (POST) (localhost:8080/api/auth)
    await axios.post(this.authUrl, dataPost).then((res) => {
      this.setToken(res.data.token); // Définition du token de l'utilisateur (res.data.token)

      // Définition de l'URL de récupération des données de l'utilisateur (API) (localhost:8080/api/user)
      const getUserUrl = this.userUrl + '?id=' + res.data.userId;
      // Récupération des données de l'utilisateur (API) (localhost:8080/api/user)
      axios.get(getUserUrl).then((user) => {
        // Modification du state de la classe Log (userLogged, inAction, curPage) pour afficher la page d'accueil de l'application (Home)
        this.setState({ userLogged: user.data.user, inAction: false, curPage: 'Home' });
        App.ReloadApp(); // Rafraichissement de la page de l'application
      })
        // Si une erreur est survenue (localhost:8080/api/user)
        .catch((_error) => {
          console.warn('ERROR');
          // Modification du state de la classe Log (error, inAction) pour afficher le message d'erreur de connexion de l'app.
          this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Erreur interne!' });
        });
    })
      .catch((err) => {
        console.error('Erreur de demande de connexion !');
        console.log(err.reason); // Affichage de l'erreur de connexion de l'utilisateur
        // Modification du state de la classe Log (error, inAction) pour afficher le message d'erreur de connexion de l'app.
        this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Adresse Email / Mot de passe incorrect!' });
      });
  }

  // Pour tout changement apporter aux inputs de la page de connexion de l'application (OnChange)
  OnChange(event) {
    const myCase = event.target.name; // Récupération du nom de l'input (myCase)
    switch (myCase) { // Switch sur le nom de l'input (myCase)
      case 'email': // Si le nom de l'input est email (myCase)
        // Appel de la fonction checkForm pour vérifier la validité des inputs de la page de connexion de l'application
        this.checkForm(event.target);
        this.setState({ valueEmail: event.target.value }); // Définition de la valeur de l'input email (valueEmail)
        break; // Fin du switch

      case 'password': // Si le nom de l'input est password (myCase)
        // Appel de la fonction checkForm pour vérifier la validité des inputs de la page de connexion de l'application
        this.checkForm(event.target);
        // Définition de la valeur de l'input password (valuePassword)
        this.setState({ valuePassword: event.target.value });
        break; // Fin du switch
      default: // Si le nom de l'input n'est pas email ou password (myCase) (default)
        // Affichage d'un message d'erreur pour le nom de l'input
        console.error('Nothing here!');
        break; // Fin du switch 
    }
  }

  // Verification des inputs valides de la page de connexion de l'application (checkForm)
  checkForm(target) {
    const { inputValid } = this.state; // Récupération du state de la classe Login (inputValid)
    const inputName = target.name; // Récupération du nom de l'input (inputName)
    let inputs = [...inputValid]; // Récupération du state de la classe Login (inputValid)
    let pos = 0; // Définition de la position de l'input (pos) (0) pour la première position de l'input (inputValid)
    switch (inputName) { // Switch sur le nom de l'input (inputName) (email, password)
      default: // Si le nom de l'input n'est pas email ou password (inputName) (default)
        console.error('Nom de champ inconnu !');
        break; // Fin du switch

      case 'email': // Email
        let regEmail = new RegExp(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g); // Regex pour email valide (avec @ et .). (regEmail) 
        pos = 0; // Position du champ dans le tableau inputValid (email).
        if (!target.value.match(regEmail)) { // Si l'email n'est pas valide (pas de @ et pas de .) alors erreur.
          // Changer le style et le message d'erreur pour le champ email (inputValid[0]) et le formulaire (validForm).
          target.className = "error";
          inputs[pos] = false; // Champ email invalide.
          this.setState({ inputValid: inputs }); // Mise à jour du tableau inputValid.
        }
        else {
          // Changer le  style et le message d'erreur pour le champ email (inputValid[0]) et le formulaire (validForm).
          target.className = "valid";
          inputs[pos] = true; // Champ email valide.
          this.setState({ inputValid: inputs }); // Mise à jour du tableau inputValid.
        }
        break; // Fin de l'email.

      case 'password': // Le mot de passe.
        pos = 1; // Position du champ password dans le tableau inputValid
        if (target.value.length >= 4) { // Minimum 4 caractères pour le mot de passe (en plus de l'@mail)
          // Modifie le style et définit la forme valide sur true si toutes les entrées sont valides (true).
          target.className = "valid";
          inputs[pos] = true; // Champ password valide.
          this.setState({ inputValid: inputs }); // Mise à jour du tableau inputValid.
        }
        else {
          // Changer le style et le message d'erreur si le mot de passe n'est pas valide
          target.className = "error";
          inputs[pos] = false; // Champ password invalide.
          // Change la valeur du tableau inputValid pour le champ password
          this.setState({ inputValid: inputs }); // Mise à jour du tableau inputValid.
        }
        // Si le mot de passe est vide, on change le style et le message d'erreur.
        if (target.value.length === 0) {
          // Changer le style et le message d'erreur pour le champ password (inputValid[1]) et le formulaire (validForm).
          target.className = "";
          inputs[pos] = true; // Champ password valide.
          this.setState({ inputValid: inputs }); // Mise à jour du tableau inputValid.
        };
        break; // Fin du cas password.
    }

    if (inputs.every(element => element === true))
      this.setState({ validForm: false });
    else
      this.setState({ validForm: true });
  }

  // Insertion du jeton dans la session storage du navigateur (pour la suite) et redirection vers la page d'accueil.
  setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
  }

  //  page de connexion de l'utilisateur (Login) et de son profil (Home)  
  render() {
    const { isLoading, validForm, error } = this.state;
    return (<>

      {/* Si le formulaire est valide, on peut lancer la requête d'authentification. */}
      {!isLoading ? (<>
        <div className='login'>
          <h2><i className='fa-solid fa-user-lock'></i> Connectez-vous !</h2>
          {error || error !== '' ? <p className="error">{error}</p> : null} {/* Si erreur, afficher le message d'erreur. */}
          <form onSubmit={this.postLogin} disabled={validForm}> {/* Si le formulaire est invalide, on ne peut pas lancer la requête d'authentification. */}
            <label htmlFor="Email">Email</label>
            <input id="Email" name='email' type='email' placeholder='Ex : example@groupomania.com'
              onChange={this.OnChange} label='Adresse email' required />      {/* Input email */}
            <label htmlFor="Password">Mot de passe</label>                  {/* Input password */}
            <input id="Password" name='password' type='password' placeholder='mot de passe'
              onChange={this.OnChange} label='Mot de passe' required />
            <input type='submit' disabled={validForm} label='Connexion' value='Connexion' />      {/* Bouton connexion */}
          </form>
        </div>

        {/* Bouton inscription */}
        <div className="sign">
          <h3>Vous n'êtes pas encore membre ?</h3>  {/* Si le formulaire est invalide, on affiche le message d'erreur. */}
          <button value={'Register'} onClick={this.props.navigateTo} >Inscription</button> {/* Bouton inscription */}
        </div>
      </>) : (<></>)}

    </>)
  }
}

// Page d'inscription de l'utilisateur (Register) et de son profil (Home)
class Register extends React.Component {
  constructor(props) {  // Constructeur de la classe Register (page d'inscription)
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Initialisation des variables de la classe Register
      valueFirst: '', // Valeur du champ firstName (prénom)
      valueLast: '', // Valeur du champ lastName (nom de famille)
      valueEmail: '', // Valeur du champ email (adresse email)
      valuePassword: '', // Valeur du champ password (mot de passe)

      // Formulaire valide ou non (true ou false) [prénom, nom, email, mot de passe]
      inputValid: [false, false, false, false],
      validForm: true,   // Formulaire valide ou non (true ou false)
      isLoading: false,  // Chargement du formulaire (true ou false) (pour afficher le loader)
      inAction: false,   // Action en cours (true ou false) (pour afficher le loader)
      error: ''          // Error message (si erreur)
    }

    this.userUrl = 'http://localhost:8080/api/user';  // Url de l'API pour les utilisateurs (inscription)
    this.signUrl = 'http://localhost:8080/api/auth/sign'; // Url de l'API pour les connexions (connexion)
    this.postLogin = this.postLogin.bind(this); // Appel de la fonction postLogin (connexion) via le this (this = Register)
    this.OnChange = this.OnChange.bind(this); // Appel de la fonction OnChange (changement d'input) via le this (this = Register)
  }


  // Requête d'inscription de l'utilisateur (inscription)
  async postLogin(event) {  // Appel de la fonction postLogin (connexion) via le this (this = Register)
    event.preventDefault(); // Annulation de l'action par défaut du formulaire
    this.setState({ validForm: true, inAction: true }); // Changement du formulaire en cours (true) et du loader en cours (true) (pour afficher le loader)
    const { valueFirst, valueLast, valueEmail, valuePassword } = this.state; // Récupération des valeurs des champs du formulaire (prénom, nom, email, mot de passe)
    const dataPost = { // Création de l'objet JSON pour la requête d'inscription (inscription)
      firstname: valueFirst,  // Prénom de l'utilisateur (prénom)
      lastname: valueLast,    // Nom de famille de l'utilisateur (nom de famille)
      email: valueEmail,      // Adresse email de l'utilisateur (adresse email)
      password: valuePassword // Mot de passe de l'utilisateur (mot de passe)
    };

    // Publier la demande d'inscription (inscription) à l'API (inscription) et récupérer la réponse (inscription) 
    await axios.post(this.signUrl, dataPost).then((res) => {
      this.setToken(res.data.token); // Insertion du jeton dans la session storage du navigateur (pour la suite) (inscription)

      const getUserUrl = this.userUrl + '?id=' + res.data.userId; // Création de l'url de la requête de récupération du profil de l'utilisateur (inscription)
      axios.get(getUserUrl).then((user) => { // Publier la demande de récupération du profil de l'utilisateur (inscription) à l'API (inscription) et récupérer la réponse (inscription)
        this.setState({ userLogged: user.data.user, inAction: false, curPage: 'Home' }); // Changement de la page en cours (Home) (inscription) et du loader en cours (false) (pour cacher le loader) (inscription)
        App.ReloadApp(); // Rafraichissement de la page (inscription)
      })
        .catch((_error) => { // Si erreur (inscription)  
          console.warn('ERROR'); // Affichage d'un message d'erreur (inscription)
          // Changement de la page en cours (Home) (inscription) et du loader en cours (false) (pour cacher le loader) (inscription) et affichage du message d'erreur (inscription)
          this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Erreur interne!' });
        });
    })
      .catch((err) => { // Si erreur (inscription)
        console.error('Erreur de demande de connexion !'); // Affichage d'un message d'erreur (inscription)
        console.log(err); // Affichage de l'erreur (inscription) (pour débug) 
        // Changement de la page en cours (Home) (inscription) et du loader en cours (false) (pour cacher le loader) (inscription) et affichage du message d'erreur (inscription)
        this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Adresse Email déjà existante!' });
      });
  }

  // Changement de la valeur d'un champ du formulaire (changement d'input) 
  OnChange(event) {
    const myCase = event.target.name; // Récupération du nom du champ (changement d'input)
    switch (myCase) { // Switch sur le nom du champ (changement d'input) (prénom, nom, email, mot de passe)
      case 'firstname': // Si le champ est prénom (changement d'input) (prénom)
        this.checkForm(event.target); // Appel de la fonction checkForm (changement d'input) (prénom)
        this.setState({ valueFirst: event.target.value }); // Changement de la valeur du champ (changement d'input) (prénom)
        break; // Sortie de la condition (changement d'input) (prénom)

      case 'lastname': // Si le champ est nom de famille (changement d'input) (nom de famille)
        this.checkForm(event.target); // Appel de la fonction checkForm (changement d'input) (nom de famille)
        this.setState({ valueLast: event.target.value }); // Changement de la valeur du champ (changement d'input) (nom de famille) 
        break; // Sortie de la condition (changement d'input) (nom de famille)
      case 'email': // Si le champ est email (changement d'input) (email)
        this.checkForm(event.target); // Appel de la fonction checkForm (changement d'input) (email)
        this.setState({ valueEmail: event.target.value }); // Changement de la valeur du champ (changement d'input) (email)
        break;  // Sortie de la condition (changement d'input) (email)

      case 'password': // Si le champ est mot de passe (changement d'input) (mot de passe)
        this.checkForm(event.target); // Appel de la fonction checkForm (changement d'input) (mot de passe)
        this.setState({ valuePassword: event.target.value }); // Changement de la valeur du champ (changement d'input) (mot de passe)
        break; // Sortie de la condition (changement d'input) (mot de passe)

      default: // Si le champ n'est pas prénom, nom de famille, email ou mot de passe (changement d'input) (autre champ) 
        console.error('Rien ici!'); // Affichage d'un message d'erreur Rien ici (changement d'input) (autre champ)
        break; // Sortie de la condition (changement d'input) (autre champ)
    }
  }


  // Verification des inputs valides (changement d'input) (prénom, nom, email, mot de passe)
  checkForm(target) {
    const { inputValid } = this.state; // Récupération de l'état de l'input (changement d'input) (prénom, nom, email, mot de passe)
    const inputName = target.name; // Récupération du nom du champ (changement d'input) (prénom, nom, email, mot de passe)
    let inputs = [...inputValid]; // Création d'un nouveau tableau avec les valeurs de inputValid (changement d'input) (prénom, nom, email, mot de passe)
    let pos = 0;  // Création d'une variable de position (changement d'input) (prénom, nom, email, mot de passe) (0)
    switch (inputName) { // Switch sur le nom du champ (changement d'input) (prénom, nom, email, mot de passe)
      default:  // Si le champ n'est pas prénom, nom de famille, email ou mot de passe (changement d'input) (autre champ)
        console.error('Nom de champ inconnu!'); // Affichage d'un message d'erreur Nom de champ inconnu (changement d'input) (autre champ)
        break; // Sortie de la condition (changement d'input) (autre champ)

      case 'firstname': // Si le champ est prénom (changement d'input) (prénom)
      case 'lastname': // Si le champ est nom de famille (changement d'input) (nom de famille)
        pos = 0; // Changement de la valeur de la variable de position (changement d'input) (prénom, nom de famille) (0) 
        if (inputName === 'lastname') pos = 1; // Si le champ est nom de famille (changement d'input) (nom de famille) (1)  
        if (target.value.length >= 2) { // Si la longueur du champ est supérieure ou égale à 2 (changement d'input) (prénom, nom de famille) (2)
          target.className = "valid"; // Changement du style du champ (changement d'input) (prénom, nom de famille) (valid)
          inputs[pos] = true; // Changement de la valeur de l'input (changement d'input) (prénom, nom de famille) (true)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (prénom, nom de famille)
        }
        else {
          target.className = "error";  // Changement du style du champ (changement d'input) (prénom, nom de famille) (error)
          inputs[pos] = false; // Changement de la valeur de l'input (changement d'input) (prénom, nom de famille) (false)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (prénom, nom de famille)
        }
        break; // Sortie de la condition (changement d'input) (prénom, nom de famille)

      case 'email': // Si le champ est email (changement d'input) (email)
        // Expression régulière pour vérifier si l'email est valide (changement d'input) (email) (regExp)
        let regEmail = new RegExp(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g);
        pos = 2; // Changement de la valeur de la variable de position (changement d'input) (email) (2) 
        if (!target.value.match(regEmail)) { // Si l'email n'est pas valide (changement d'input) (email) (match) (regExp)
          target.className = "error"; // Changement du style du champ (changement d'input) (email) (error)
          inputs[pos] = false; // Changement de la valeur de l'input (changement d'input) (email) (false)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (email)
        }
        else {
          target.className = "valid"; // Changement du style du champ (changement d'input) (email) (valid)
          inputs[pos] = true; // Changement de la valeur de l'input (changement d'input) (email) (true)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (email)
        }
        break; // Sortie de la condition (changement d'input) (email)

      case 'password': // Si le champ est mot de passe (changement d'input) (mot de passe)
        pos = 3; // Changement de la valeur de la variable de position (changement d'input) (mot de passe) (3)
        if (target.value.length >= 4) { // Si la longueur du champ est supérieure ou égale à 4 (changement d'input) (mot de passe) (4)
          target.className = "valid"; // Changement du style du champ (changement d'input) (mot de passe) (valid)
          inputs[pos] = true; // Changement de la valeur de l'input (changement d'input) (mot de passe) (true)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (mot de passe)
        }
        else {
          target.className = "error"; // Changement du style du champ (changement d'input) (mot de passe) (error)
          inputs[pos] = false; // Changement de la valeur de l'input (changement d'input) (mot de passe) (false)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (mot de passe)
        }
        if (target.value.length === 0) { // Si la longueur du champ est égale à 0 (changement d'input) (mot de passe) (0)  
          target.className = ""; // Changement du style du champ (changement d'input) (mot de passe) ()
          inputs[pos] = true; // Changement de la valeur de l'input (changement d'input) (mot de passe) (true)
          this.setState({ inputValid: inputs }); // Changement de l'état de l'input (changement d'input) (mot de passe)
        };
        break; // Sortie de la condition (changement d'input) (mot de passe)
    }

    if (inputs.every(element => element === true)) // Si tous les inputs sont valides (changement d'input) (tous les inputs) (every)
      this.setState({ validForm: false }); // Changement de l'état du formulaire (changement d'input) (tous les inputs) (false)
    else
      this.setState({ validForm: true }); // Changement de l'état du formulaire (changement d'input) (tous les inputs) (true)
  }

  // Fonction qui permet de stocker le jeton dans la session (changement d'input) (jeton) (sessionStorage)
  setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken)); // Stocke le jeton dans la session (changement d'input) (jeton) (sessionStorage)
  }

  render() { // Fonction qui permet de rendre le composant (rendu)
    const { isLoading, validForm, error } = this.state; // Déclaration des variables (rendu) (isLoading, validForm, error) 
    return (<>      {/* Début du rendu (rendu) */}
      {/* Formulaire d'inscription pour devenir membre (rendu) (isLoading) */}
      {!isLoading ? (<>
        <div className='login'> {/* Début de la div (rendu) (isLoading) */}
          <h2><i className='fa-solid fa-door-open'></i> Inscrivez-vous !</h2> {/* Titre (rendu) (isLoading) */}
          {error || error !== '' ? <p className="error">{error}</p> : null} {/* Message d'erreur (rendu) (isLoading) (error) */}
          <form onSubmit={this.postLogin} disabled={validForm}> {/* Début du formulaire (rendu) (isLoading) (validForm) */}
            <label htmlFor="Prenom">Prénom</label> {/* Label (rendu) (isLoading) (validForm) (Prenom) */}
            <input id='Prenom' name='firstname' type='text' placeholder='Prénom' // Input (rendu) (isLoading) (validForm) (Prenom)
              label='Prénom' onChange={this.OnChange} required />  {/* Input (rendu) (isLoading) (validForm) (Prenom) (onChange) (required) */}

            <label htmlFor="Nom">Nom</label>  {/* Label (rendu) (isLoading) (validForm) (Nom) */}
            <input id='Nom' name='lastname' type='text' placeholder='Nom'  // Input (rendu) (isLoading) (validForm) (Nom)
              label='Nom' onChange={this.OnChange} required /> {/* Input (rendu) (isLoading) (validForm) (Nom) (onChange) (required) */}

            <label htmlFor="Email">Email</label> {/* Label (rendu) (isLoading) (validForm) (Email) */}
            <input id='Email' name='email' type='email' placeholder='Ex : example@groupomania.com' // Input (rendu) (isLoading) (validForm) (Email)
              label='Adresse email' onChange={this.OnChange} required /> {/* Input (rendu) (isLoading) (validForm) (Email) (onChange) (required) */}

            <label htmlFor="Password">Mot de passe</label> {/* Label (rendu) (isLoading) (validForm) (Password) */}
            <input id='Password' name='password' type='password' placeholder='mot de passe' // Input (rendu) (isLoading) (validForm) (Password)
              label='Mot de passe' onChange={this.OnChange} required />
            <input type='submit' disabled={validForm} label='Inscription' value='Inscription' /> {/* Input (rendu) (isLoading) (validForm) (Password) (onChange) (required) */}
          </form>
        </div>

        <div className="sign"> {/* Début de la div (rendu) (isLoading) */}
          <h3>Vous êtes déjà membre ?</h3> {/* Titre (rendu) (isLoading) */}
          <button value={'Login'} onClick={this.props.navigateTo} >Connexion</button> {/* Bouton (rendu) (isLoading) (Login) */}
        </div>
      </>) : (<></>)}

    </>)
  }
}
