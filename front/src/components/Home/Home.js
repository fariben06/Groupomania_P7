import React from "react"; // Importer React depuis le répertoire node_modules (React est un module)
import axios from "axios"; // Importer axios depuis le répertoire node_modules (axios est un module)
import App from "../App";  // Importer App depuis le répertoire src (./ = src/)
import Avatar from "../Avatar/Avatar"; // Importer Avatar depuis le répertoire src (./ = src/)
import Articles from "../Articles/Articles"; // Importer Articles depuis le répertoire src (./ = src/)
import Profile from "../Profile/Profile"; // Importer Profile depuis le répertoire src (./ = src/)
import Admin from "../Admin/Admin"; // Importer Admin depuis le répertoire src (./ = src/) 
import "./Home.css"; // Importer le fichier CSS depuis le répertoire src (./ = src/)

// Exporter le composant Home (export default)
export default class Home extends React.Component {
  constructor(props) {   // Constructeur du composant Home
    super(props);        // Appel du constructeur du composant parent (React.Component)
    this.state = {       // Définition du state du composant Home
      // Données de l'utilisateur connecté.
      articles: props.articles,      // Liste des articles de l'utilisateur connecté.
      userLogged: props.userLogged,  // Utilisateur connecté (objet) à partir du state du composant App.
      tasksList: null,               // Liste des emplois de l'utilisateur connecté (objet) (à récuperér dans le state)
      // Option de la page actuelle (Home, Profile, Admin).
      isLoading: false,              // Indicateur de chargement (à récuperér dans le state) (true = chargement en cours)
      curPage: 'Home'                // Page actuelle (Home, Profile, Admin)  (à récuperér dans le state) (Home = page d'accueil)
    }
    // Url de récuperation des tâches de l'utilisateur connecté.
    this.taskUrl = 'http://localhost:8080/api/tasks';
    // OnClick du composant Home (navigateTo) (navigateTo = fonction)  
    this.navigateTo = this.navigateTo.bind(this);
    // OnClick du composant Home (logout) (logout = fonction)   
    this.logout = this.logout.bind(this);
  }

  // Fonction appelée après le rendu du composant (componentDidMount = fonction)
  componentDidMount() {
    this.getTasks(); // Récuperation des tâches de l'utilisateur connecté.
  }

  // Fonction récuperant les tâches de l'utilisateur connecté.
  async getTasks() {
    const { curTaskId } = this.state; // Récuperation de l'id de la tâche en cours (curTaskId)
    this.setState({ isLoading: true }); // Mise en place du loader (isLoading)
    // Récuperation des tâches de l'utilisateur connecté (res = objet) (await = attendre) (axios = module) (this.taskUrl = url)
    let tasks = await axios.get(this.taskUrl).then((res) => {
      // Pour chaque tâche de l'utilisateur connecté (task = objet) (index = entier) (tasks = tableau)
      res.data.tasks.forEach((task, index) => {
        // Si l'id de la tâche en cours est égal à l'id de la tâche récuperée (curTaskId)
        if (task.id === curTaskId) this.setState({ curPosTask: index });
      });
      // Retourner le tableau des tâches de l'utilisateur connecté (tasks = tableau)
      return res.data.tasks;
    })
    // Mise en place du tableau des tâches de l'utilisateur connecté (tasksList = tableau) (isLoading = false)
    this.setState({ tasksList: tasks, isLoading: false });
  }

  // Modification de la page à afficher (curPage)
  navigateTo(event) {
    const myPage = event.target.id; // Récuperation de l'id de la page à afficher (myPage)
    this.setState({ curPage: myPage }); // Mise en place de la page à afficher (curPage)
  }

  // Déconnexion de l'utilisateur connecté (logout = fonction)
  logout() {
    if (window.confirm('Vous êtes sur le point de vous déconnectez...\nÊtes vous sûre ?')) {
      sessionStorage.clear(); // Suppression de la session utilisateur (sessionStorage = objet) (clear = fonction) 
      App.ReloadApp(); // Rechargement de la page (App = module) (ReloadApp = fonction)
    }
  }

  // Mise en place du composant selon la page actuelle. (curPage)
  setComponent() {
    // Récuperation des données du composant Home (curPage, articles, tasksList, userLogged) (state = objet)
    const { curPage, articles, tasksList, userLogged } = this.state;
    // Switch sur la page actuelle (curPage)
    switch (curPage) {
      // Page d'accueil (Home)
      case 'Home':
        // Retourner le composant Articles (Articles = module) (articles = tableau) (userLogged = objet) (navigateTo = fonction) (logout = fonction)
        return (<><Articles articles={articles} userLogged={userLogged} navigateTo={this.navigateTo} logout={this.logout} /></>);
      // Page Profil (Profile)
      case 'Profile':
        // Retourner le composant Profile (Profile = module) (userLogged = objet) (navigateTo = fonction) (logout = fonction)
        return (<><Profile userLogged={userLogged} tasksList={tasksList} navigateTo={this.navigateTo} logout={this.logout} /></>);
      // Page Admin (Admin) 
      case 'Admin':
        // Retourner le composant Admin (Admin = module) (userLogged = objet) (navigateTo = fonction) (logout = fonction)
        return (<><Admin userLogged={userLogged} tasksList={tasksList} navigateTo={this.navigateTo} logout={this.logout} /></>);
      // Page par défaut (Home)
      default:
        break; // Ne rien faire (break = fin de la boucle)
    }
  }

  // Rendu du composant Home (render = fonction)
  render() {
    // Récuperation des données du composant Home (isLoading, curPage, userLogged) (state = objet)
    const { isLoading, curPage, userLogged } = this.state;
    // Si le composant est en cours de chargement (isLoading = true)
    return (<>
      <nav>
        {/*Si l'utilisateur est connecté (userLogged = objet) (isClickable = true) (navigateTo = fonction) (logout = fonction)*/}
        {userLogged ? <Avatar dataUser={userLogged} isClickable={true} navigateTo={this.navigateTo} logout={this.logout} /> : null}
      </nav>

      {!isLoading && curPage ? (<>        {/*Si le composant n'est pas en cours de chargement (isLoading = false)*/}
        {this.setComponent()}             {/*Mise en place du composant selon la page actuelle (curPage)*/}
      </>) : (<></>)}

    </>)
  }
}
