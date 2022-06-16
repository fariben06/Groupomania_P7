import React from "react"; // Importer React depuis le répertoire node_modules (React est un module)
import { Link } from "react-router-dom"; // Importer Link depuis le répertoire node_modules (Link est un module) (react-router-dom = module)
import App from "../App"; // Importer App depuis le répertoire src (./ = src/)
import "./Header.css"; // Importer le fichier CSS depuis le répertoire src (./ = src/)

// Créer une class Header qui hérite de React.Component 
export default class Header extends React.Component {
  render() {                  // Rendu du composant Header (render = fonction)
    return (<>
      <header>  {/*Début du header */}
        <Link onClick={App.ReloadApp} to={'./'}><div className="logo"><span className="hidden">home</span></div></Link >
        <h1>Groupomania</h1>   {/* Titre du site */}
      </header>
    </>)
  }
}
