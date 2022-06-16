import React from "react"; // Importer React depuis le répertoire node_modules (React est un module)
import axios from "axios"; // Importer axios depuis le répertoire node_modules (axios est un module)
import App from "../App"; // Importer App depuis le répertoire src (./ = src/)
import Comment from "./Comment"; // Importer Comment depuis le répertoire src (./ = src/)
import Avatar from "../Avatar/Avatar"; // Importer Avatar depuis le répertoire src (./ = src/)
import "./Comments.css"; // Importer le fichier CSS depuis le répertoire src (./ = src/)

// Exporter le composant Comments qui va afficher les commentaires de l'article  dans la page article.
export default class Comments extends React.Component {
    constructor(props) { // Constructeur du composant Comments
        super(props);    // Appel du constructeur de la classe parente (React.Component)
        this.state = {   // Initialisation des variables du composant
            // Données du composant Comments
            userLogged: props.userLogged, // Utilisateur connecté (userLogged)
            articleId: props.articleId,   // Id de l'article concerné par les commentaires
            comments: props.comments,     // Commentaires de l'article (comments)
            valueComment: '',             // Valeur du commentaire (input) (valueComment)
            fileUpload: null,             // Fichier uploadé (image) (null = pas de fichier)
            // Options du composant Comments
            isClicked: false,             // Afficher/Cacher les options (isClicked) (false = caché) 
            isValid: true,                // Validation du commentaire (isValid) (true = valide)
            isLoading: false              // Chargement (isLoading) (false = pas chargé)
        }
        // URL des commentaires de l'article (commentUrl)
        this.commentUrl = 'http://localhost:8080/api/comments';
        // OnClick du bouton d'options (onOptionsClick)
        this.OnSubmitComment = this.OnSubmitComment.bind(this); // OnSubmitComment = fonction du composant Comments
        this.OnChange = this.OnChange.bind(this); // OnChange = fonction du composant Comments
        this.onDeleteClick = this.onDeleteClick.bind(this); // onDeleteClick = fonction du composant Comments
        this.onOptionsClick = this.onOptionsClick.bind(this); // onOptionsClick = fonction du composant Comments
    }

    // Gestion de l'envoi du commentaire (submit).
    OnSubmitComment(event) {
        const { userLogged, articleId, valueComment, fileUpload } = this.state; // Récupération des données du composant
        // L'objet contient des formes de valeur (value)
        const formData = new FormData();            // Création d'un objet FormData
        formData.append("userId", userLogged.id);   // Ajout de l'id de l'utilisateur (userId)
        formData.append("comment", valueComment);   // Ajout du commentaire (comment)
        formData.append("image", fileUpload);       // Ajout de l'image (image)
        formData.append("articleId", articleId);    // Ajout de l'id de l'article (articleId)

        event.preventDefault();                     // Annulation de l'action par défaut (submit)
        // Post request (envoi du commentaire) (commentUrl = url des commentaires)
        axios.post(this.commentUrl, formData, {
            headers: {                              // Ajout des headers
                Authorization: "Bearer " + sessionStorage.getItem("token") // Ajout du token
            }
        }).then(() => { App.ReloadApp(); })       // Rafraichissement de la page (App.ReloadApp)
            .catch(error => {
                console.error('Erreur Ajouter un commentaire');
                console.warn(error); // Affiche l'erreur dans la console
            });
    }

    // Gestion des events du composant Comments (change) (OnChange = fonction du composant Comments)
    OnChange(event) {
        const myState = event.target.name; // Récupération du nom de l'input (myState)
        switch (myState) { // Switch sur le nom de l'input
            case 'comment':
                if (event.target.value.length) { // Si le commentaire est non vide (event.target.value.length) 
                    event.target.className = "valid"; // Ajout de la class "valid" (className = class) (valid = class)
                    this.setState({ isValid: false }); // Modification du state (isValid) (false = invalide)
                }
                else { // Si le commentaire est vide
                    // Suppression de la class "valid" (className = class) (valid = class)
                    event.target.className = "";
                    // Modification du state (isValid) (true = valide)
                    this.setState({ isValid: true });
                }
                // Modification du state (valueComment) (event.target.value = valeur) 
                this.setState({ valueComment: event.target.value });
                break; // Sort de la fonction OnChange

            case 'image':  // Si l'input est image
                // Modification du state (fileUpload) (event.target.files[0] = fichier)
                this.setState({ fileUpload: event.target.files[0] });
                break; // Sort de la fonction OnChange
            default: // Si l'input n'est pas image (default) ou si l'input n'existe pas (undefined)
                console.error('Rien ici !');
                break;
        }
    }

    // Suppression d'un commentaire (onDeleteClick = fonction du composant Comments) (commentId = id du commentaire)
    async onDeleteClick(event) {
        const commentId = event.target.value; // Récupération de l'id du commentaire (commentId)
        if (window.confirm('Êtes vous sûre ?')) { // Confirmation de la suppression du commentaire (window.confirm)
            // Delete request (suppression du commentaire) (commentUrl = url des commentaires)
            await axios.delete(this.commentUrl + '/' + commentId, { // await = attendre la réponse de la requête
                headers: {                // Ajout des headers
                    // Ajout du token (Authorization = header)                            
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                }
            }).then(() => App.ReloadApp()); // Rafraichissement de la page (App.ReloadApp)
        }
    }

    // Afficher/Cacher les options (onOptionsClick = fonction du composant Comments)
    onOptionsClick() {
        const { isClicked } = this.state; // Récupération du state (isClicked) (false = caché)
        switch (isClicked) { // Switch sur le state (isClicked) 
            // Masquer les options.
            default: // Si le state est caché (default)
            case true: // Si le state est caché (true)
                this.setState({ isClicked: false }); // Modification du state (isClicked) (false = caché)
                break; // Sort de la fonction onOptionsClick

            // Afficher les options (isClicked = true)
            case false: // Si le state est affiché (false)
                this.setState({ isClicked: true }); // Modification du state (isClicked) (true = affiché)
                break; // Sort de la fonction onOptionsClick
        }
    }

    // Convertisseur de date (convertDate = fonction du composant Comments) (date = date à convertir)
    convertDate(myDate) {
        const start = new Date(myDate).getTime(); // Récupération de la date (start) (new Date(myDate).getTime())
        const current = Date.now(); // Récupération de la date actuelle (current) (Date.now())
        const result = new Date(current - start); // Calcul de la différence entre la date actuelle et la date (result) (current - start)
        let since = new Date(result); // Création d'un objet Date (since) (result)
        if (since.getFullYear() <= 1970) // Si l'année est inférieure à 1970, on affiche l'année (getFullYear)
            if (since.getMonth() + 1 <= 1) // Si le mois est inférieur à 1, on affiche le mois (getMonth)
                if (since.getDate() <= 1) // Si le jour est inférieur à 1, on affiche le jour (getDate)
                    if (since.getHours() <= 1) // Si l'heure est inférieur à 1, on affiche l'heure (getHours)
                        if (since.getMinutes() < 1) // Si les minutes sont inférieures à 1, on affiche les minutes (getMinutes)
                            since = new Date(result).getSeconds() + 'sec.'; // Si les secondes sont inférieures à 1, on affiche les secondes (getSeconds)
                        else since = since.getMinutes() + 'min.'; // Sinon, on affiche les minutes (getMinutes)
                    else since = since.getHours() + 'h.'; // Sinon, on affiche les heures (getHours)
                else since = since.getDate() + 'j.'; // Sinon, on affiche les jours (getDate)
            else since = since.getMonth() + 1 + 'm.'; // Sinon, on affiche les mois (getMonth)
        else since = since.getFullYear() + 'y.'; // Sinon, on affiche les années (getFullYear)

        return `${since}`;  // Renvoi de la date convertie (since) (since = date convertie)
    }

    // Rendu du composant Comments (render)
    render() {
        const { userLogged, comments } = this.state; // Récupération du state (userLogged) (comments)
        const { isValid, valueComment } = this.state // Récupération du state (isValid) (valueComment)
        return (<>
            {comments ? comments.map((comment, i) => ( // Pour chaque commentaire (comment)
                // Rendu du commentaire (Comment) (key = id du commentaire) (userLogged = utilisateur connecté) 
                // (comment = commentaire) (onDeleteClick = fonction du composant Comments)
                <Comment key={'comment-' + comment.id} userLogged={userLogged} comment={comment} onDeleteClick={this.onDeleteClick} />
            )) : (<></>)}

            {/* Rendu du formulaire d'ajout de commentaire, utilisateur connecté, avatar */}
            <form className="addComment" onSubmit={this.OnSubmitComment} disabled={isValid}>
                <Avatar key={'avatar-' + userLogged.id} dataUser={{ ...userLogged, isProfile: false }} />
                <label htmlFor="comment">comment</label>
                <input id="comment" type='text' name="comment" placeholder='Ecrivez un commentaire...'
                    value={valueComment} onChange={this.OnChange} />
                <button aria-label="sendComment" disabled={isValid}>
                    <i className="fa-solid fa-paper-plane" alt="sendComment"></i>
                </button>
                <input type='hidden' name="userId" value={userLogged.id} />
            </form>
        </>)
    }
}
