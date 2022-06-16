import React from "react"; // Importer React pour utiliser les fonctionnalités de React 
import { createRoot } from 'react-dom/client'; // Importer createRoot pour créer un noveau root dans le DOM de React
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importer Routes pour créer des routes dans le DOM et Route pour créer une route
import App from './components/App'; // Importer App pour créer un nouveau root dans le DOM et afficher le contenu de App.js
import './index.css'; // Importer le fichier index.css pour le rendu du DOM dans le navigateur

// Créer un nouveau root dans le DOM de React
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);  // Créer un nouveau root dans le DOM de React 
root.render( // Rendre le contenu de App.js dans le DOM
  //<React.StrictMode> 
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<App />} />        {/* Créer une route pour la page d'accueil */}
      <Route path="*" element={<>                 {/* Créer une route pour toutes les autres pages */}
        <main>
          <section className='error'>             {/* Créer une section pour afficher un message d'erreur */}
            <h2>ERROR 404</h2>                    {/* Créer un titre pour afficher un message d'erreur */}
            <p>Il n'y a rien ici!</p>             {/* Créer un paragraphe pour afficher un message d'erreur */}
            <a href="./../">Go to Main page</a>   {/* Créer un lien pour aller à la page d'accueil */}
          </section>
        </main>
      </>} />
    </Routes>
  </BrowserRouter>
  //</React.StrictMode> 
);
