import React from "react"; // Importer React pour pouvoir utiliser les fonctionnalités de React
import axios from "axios"; // Importer axios pour pouvoir utiliser les fonctionnalités de axios 
import App from "../App";  // Importer App pour pouvoir utiliser les fonctionnalités de App 
import Avatar from "../Avatar/Avatar"; // Importer Avatar pour pouvoir utiliser les fonctionnalités de Avatar
import Options from "../Options/Options"; // Importer Options pour pouvoir utiliser les fonctionnalités de Options 

// Exporter le composant Comment qui va afficher les commentaires de l'utilisateur connecté dans la page commentaires.
export default class Comments extends React.Component {
    constructor(props) { // Constructeur du composant Comment (Comment)
        super(props);    // Appel du constructeur de la classe parente (React.Component)
        this.state = {   // Définition du state du composant Comment (Comment)
            // Données du commentaire (comment)
            userLogged: props.userLogged, // Utilisateur connecté (userLogged)
            comment: props.comment, // Commentaire (comment) (comment)
            valueComment: props.comment.comment, // Commentaire (valueComment) (valeur du commentaire)
            fileUpload: null, // Fichier uploadé (fileUpload) (fichier uploadé) (null) 
            // Options du commentaire (options)
            editComment: false, // Edition du commentaire (editComment) (false) (non édité)
            isEdited: false, // Edition du commentaire (isEdited) (false) (non édité)
            isClicked: false, // Afficher/Cacher les options (isClicked) (false) (non cliqué)
            isValid: false, // Validation du commentaire (isValid) (false) (non validé)
            isLoading: false // Chargement du commentaire (isLoading) (false) (non chargé)
        }
        // Request Url du commentaire (commentUrl) (url du commentaire)
        this.commentUrl = 'http://localhost:8080/api/comments';
        // (onOptionsClick) onClick du bouton options 
        this.onOptionsClick = this.onOptionsClick.bind(this);
        // OnClick du bouton d'édition du commentaire (onEditClick)
        this.onEditClick = this.onEditClick.bind(this);
        // OnChange du champ de commentaire (OnChange)
        this.OnChange = this.OnChange.bind(this);
    }

    // Modification d'un commentaire (editComment)
    async onEditClick(event) {
        event.preventDefault(); // Empêcher le rechargement de la page (preventDefault)
        // Récupération des données du commentaire (valueComment) (fichier uploadé)
        const { valueComment, fileUpload } = this.state;
        // Récupération des données du commentaire (comment) (édition du commentaire) (édité)
        const { comment, editComment, isEdited } = this.state;

        // Si le commentaire est édité (editComment) (édité)
        if (editComment) {
            if (isEdited) {
                // L'objet contient des formes de valeur (value)
                const formData = new FormData();
                formData.set("comment", valueComment);  // Commentaire (comment) (valeur du commentaire)
                // Si un fichier est uploadé (fileUpload) (fichier uploadé) (fichier uploadé) 
                if (fileUpload != null) formData.append("image", fileUpload);
                // Demande de mise à jour du commentaire (commentUrl) (url du commentaire)
                await axios.put(this.commentUrl + '/' + comment.id, formData, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token") // Ajout du token dans les headers (Authorization)
                    }
                }).then(() => App.ReloadApp()); // Rafraichissement de la page (App.ReloadApp)
            }
            // Annulation de l'édition du commentaire (editComment) (édité) (false) (non édité)
            else this.setState({ editComment: false, isEdited: false });
        }
        // Edition du commentaire (editComment) (false) (non édité) (true) (édité)
        else this.setState({ editComment: true });
    }

    // Gestion des events du champ de commentaire (OnChange)
    OnChange(event) {
        const { comment } = this.state; // Récupération des données du commentaire (comment) (commentaire)
        const myState = event.target.name; // Récupération du nom du champ (myState) (nom du champ)
        switch (myState) { // Switch sur le nom du champ (myState)
            case 'comment':
                if (event.target.value.length) { // Si le champ de commentaire contient du texte (event.target.value.length) (texte)
                    event.target.className = "valid"; // Ajout de la classe valid (event.target.className) (valid)
                    this.setState({ isValid: false, isEdited: true }); // Modification du state (isValid) (false) (non validé) (true) (édité)
                }
                else {
                    event.target.className = ""; // Suppression de la classe (event.target.className) (aucune classe)
                    this.setState({ isValid: true }); // Modification du state (isValid) (true) (validé)
                }
                // Si le commentaire a été modifié (isEdited) (true) (édité)
                if (comment.comment !== event.target.value) this.setState({ isEdited: true });
                else this.setState({ isEdited: false }); // Modification du state (isEdited) (false) (non édité)
                this.setState({ valueComment: event.target.value }); // Modification du state (valueComment) (valeur du commentaire)
                break; // Sortie du switch
            case 'image':
                this.setState({ fileUpload: event.target.files[0] }); // Modification du state (fileUpload) (fichier uploadé)
                break; // Sortie du switch
            default: // Par défaut (default) (aucun)
                console.error('Rien ici !'); // Erreur (console.error) (rien ici)
                break;
        }
    }

    // Afficher/Cacher les options (isClicked) (false) (non cliqué) (true) (cliqué)
    onOptionsClick() {
        const { isClicked } = this.state; // Récupération du state (isClicked) (false) (non cliqué) (true) (cliqué)
        switch (isClicked) { // Switch sur le state (isClicked) (false) (non cliqué) (true) (cliqué)
            // Masquer les options.
            default: // Par défaut (default) (aucun)
            case true:
                this.setState({ isClicked: false }); // Modification du state (isClicked) (false) (non cliqué)
                break; // Sortie du switch
            // Afficher les options 
            case false: // (false) (non cliqué)
                this.setState({ isClicked: true }); // Modification du state (isClicked) (true) (cliqué)
                break; // Sortie du switch
        }
    }

    // Convertisseur de date (dateConverter) (convertisseur de date) (convertisseur de date)
    convertDate(myDate) {
        const start = new Date(myDate).getTime(); // Récupération de la date (start) (date)
        const current = Date.now(); // Récupération de la date actuelle (current) (date actuelle)
        const result = new Date(current - start); // Calcul de la différence de date (result) (différence de date)
        let since = new Date(result); // Conversion de la différence de date en date (since) (date) (différence de date)
        if (since.getFullYear() <= 1970) // Si l'année est inférieure à 1970 (since.getFullYear() <= 1970) (année inférieure à 1970)
            if (since.getMonth() + 1 <= 1) // Si le mois est inférieur à 1 (since.getMonth() + 1 <= 1) (mois inférieur à 1)
                if (since.getDate() <= 1) // Si le jour est inférieur à 1 (since.getDate() <= 1) (jour inférieur à 1)
                    if (since.getHours() <= 1) // Si l'heure est inférieure à 1 (since.getHours() <= 1) (heure inférieure à 1)
                        if (since.getMinutes() < 1) // Si les minutes sont inférieures à 1 (since.getMinutes() < 1) (minutes inférieures à 1)
                            since = new Date(result).getSeconds() + 'sec.'; // Conversion de la différence de date en secondes (since) (secondes) (différence de date)
                        else since = since.getMinutes() + 'min.'; // Conversion de la différence de date en minutes (since) (minutes) (différence de date)
                    else since = since.getHours() + 'h.'; // Conversion de la différence de date en heures (since) (heures) (différence de date)
                else since = since.getDate() + 'j.'; // Conversion de la différence de date en jours (since) (jours) (différence de date)
            else since = since.getMonth() + 1 + 'm.'; // Conversion de la différence de date en mois (since) (mois) (différence de date)
        else since = since.getFullYear() + 'y.'; // Conversion de la différence de date en années (since) (années) (différence de date)

        return `${since}`; // Retourne la différence de date (since) (différence de date)
    }

    // Rendu du composant (render) (rendu du composant)  
    render() {
        // Récupération des données du state (userLogged) (utilisateur connecté) (commentaire) (false) (non cliqué) (true) (cliqué)
        const { userLogged, comment, isClicked } = this.state;
        // Récupération des données du state (isValid) (false) (non validé) (true) (validé)
        const { editComment, isValid, valueComment } = this.state;
        return (<>
            {/*Création du div (key={'div-comment'}) (div) (commentaire)*/}
            <div key={'div-comment'} className="comment">
                {/*Création de l'avatar (key={'avatar-' + comment.id}) (avatar) (commentaire) (utilisateur)*/}
                <Avatar key={'avatar-' + comment.id} dataUser={{ ...comment.user, isProfile: false }} />
                <div className="comment-content">
                    <h3>{comment.user.firstname} {comment.user.lastname}</h3>
                    {editComment ? (<>
                        <form onSubmit={this.onEditClick} className="editComment" disabled={isValid}>
                            <label htmlFor="comment">comment</label>
                            <input id="comment" type='text' name="comment" placeholder='Ecrivez un commentaire...'
                                value={valueComment} onChange={this.OnChange} />
                            <button aria-label="sendComment" disabled={isValid}>
                                <i className="fa-solid fa-paper-plane" alt="sendComment"></i>
                            </button>
                        </form>
                    </>) : (<><p>{comment.comment}</p></>)}
                    <h4>{comment.user.task.tasks} | <i className="fa-solid fa-clock"></i> {this.convertDate(comment.postDate)}</h4>
                </div>
                {/* Si l'utilisateur est l'auteur du commentaire ou un admin, on affiche les options */}
                {!editComment && (comment.authorId === userLogged.id || userLogged.isAdmin) ? (<>
                    <div className="article-options" onClick={this.onOptionsClick}>
                        <i className="fa-solid fa-ellipsis"></i>
                        {isClicked ? (<> {/* Si les options sont affichées, on affiche le menu */}
                            {/* On affiche les options pour le commentaire de l'utilisateur */}
                            <Options onEditClick={this.onEditClick} onDeleteClick={this.props.onDeleteClick} for={'Comment'} commentId={comment.id} />
                        </>) : null}
                    </div>
                </>) : (<><div className="article-no-options"></div></>)} {/* Sinon, on ne fait rien */}
            </div>
        </>)
    }
}
