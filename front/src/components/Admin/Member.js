import React from "react"; // Importer React pour pouvoir utiliser les fonctionnalités de React
import axios from "axios"; // Importer axios pour pouvoir utiliser les fonctionnalités de axios
import App from "../App";  // Importer App pour pouvoir utiliser les fonctionnalités de App
import Avatar from "../Avatar/Avatar"; // Importer Avatar pour pouvoir utiliser les fonctionnalités de Avatar

// Page Member (Admin) 
export default class Member extends React.Component {
  constructor(props) { // Constructeur du composant (Admin)
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // On définit l'état du composant (Admin)
      isLoading: false, // Si le composant est en chargement (Admin)
      userLogged: props.userLogged, // Si l'utilisateur est connecté (Admin)
      member: props.member, // Données du membre (Admin) 
    };
    this.userUrl = 'http://localhost:8080/api/user'; // Url du serveur (Admin) 
    // On récupère les données du membre (Admin) depuis le serveur (Admin)
    this.OnSetAdmin = this.OnSetAdmin.bind(this);  // On lie la fonction OnSetAdmin au composant (Admin)
    this.OnDeleteUser = this.OnDeleteUser.bind(this); // On lie la fonction OnDeleteUser au composant (Admin)
  }

  // Fonction de suppression d'un utilisateur (Admin)
  async OnDeleteUser() {
    const { member } = this.state; // Données du membre (Admin).
    if (window.confirm(`Vous êtes sur le point de supprimer définitivement le compte de :\n${member.id} - ${member.firstname} ${member.lastname}\nÊtes vous sûre ?`)) {
      await axios.delete(this.userUrl + '/' + member.id + '/' + 0, { // On envoie les données au serveur pour les modifier (Admin).
        headers: { // On envoie le token d'authentification (Admin) pour autoriser la requête (Admin).
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      }).then(() => App.ReloadApp()); // On recharge la page (Admin).
    }
  }

  // Fonction de modification des droits (Admin)
  async OnSetAdmin() {
    const { member } = this.state; // Données du membre (Admin).
    if (member.isAdmin) {          // Si le membre est admin (Admin) 
      let newData = { ...member, isAdmin: 0 }; // On crée un nouveau membre avec les données du membre (Admin) et le nouveau statut admin (Admin)
      // On demande confirmation de la suppression des droits admin (0) du membre 
      if (window.confirm(`Vous êtes sur le point de retirer les droits à :\n${member.firstname} ${member.lastname}\nÊtes vous sûre ?`)) {
        await axios.put(this.userUrl + '/' + member.id + '/' + 0, newData, { // On lui retire les droits admin (Admin) 
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token") // On envoie le token d'authentification (Admin) pour autoriser la requête (Admin).
          }
        }).then(() => App.ReloadApp()); // On recharge la page (Admin).
      }
    }

  }

  render() { // Rendu du composant (Admin) 
    const { isLoading, userLogged, member } = this.state; // Données de l'état membre (Admin).
    return (<>
      {!isLoading && userLogged && member ? ( // Si l'utilisateur est connecté et que le membre existe 
        <div className="member" key={'Member-' + member.id}>       {/* On crée un composant membre */}
          <Avatar key={member.id} dataUser={{ ...member, isProfile: false }} />    {/* On crée un avatar du membre */}
          <p>{member.firstname} {member.lastname}</p>     {/* On affiche le nom du membre */}
          <div>

            {!member.isDelete ? (<>      {/* Si le membre n'est pas supprimé */}

              {member.id === 1 ? (<>     {/* Si le membre est l'administrateur */}
                {/* On ne peut pas le supprimer */}
                <button className="edit actived" disabled={member.isAdmin} aria-label="editAdmin" value={member.id}>
                  <i className="fa-solid fa-tower-observation"></i>  {/* On affiche un icone de la tour de observation */}
                </button>
              </>) : (<>
                {member.isAdmin ? (<>    {/* Si le membre est admin */}
                  <button className="edit actived" aria-label="editAdmin" onClick={this.OnSetAdmin} >  {/* On affiche un bouton pour retirer les droits d'admin */}
                    <i className="fa-solid fa-tower-observation"></i>        {/* On affiche un icone de la tour de observation */}
                  </button>
                </>) : (<>

                </>)}
                {/* On affiche un bouton pour supprimer le membre */}
                <button className="delete" aria-label="delUser" onClick={this.OnDeleteUser} >
                  <i className="fa-solid fa-trash"></i> {/* On affiche un icone de la poubelle */}
                </button>
              </>)}

            </>) : (<>
              {/* Si le membre est supprimé */} {/* On affiche un message de confirmation */}
              <button className="delete" aria-label="delUser" onClick={this.OnDeleteUser} >
                <i className="fa-solid fa-trash"></i> {/* On affiche un icone de la poubelle */}
              </button>
            </>)}


          </div>
        </div>
      ) : 'Erreur lors du chargement du membre !'}
    </>)
  }
}
