/**
 * @file hour.js
 * @description Gère l'horloge en temps réel dans le pied de page (footer) de l'application.
 * Met à jour le texte du conteneur "#date" toutes les secondes au format français HH:MM:SS.
 */

// Sélection de l'élément DOM qui affichera l'heure
const date = document.getElementById("date");

// Vérifie si l'élément date existe sur la page courante pour éviter les erreurs JS silencieuses
if (date) {
  // Lance une boucle répétitive de rafraîchissement toutes les 1000 millisecondes (1 seconde)
  setInterval(() => {
    // Injecte l'heure courante localisée en français
    date.textContent = new Date().toLocaleTimeString("fr", {
      hour: "2-digit",   // Affichage sur deux chiffres (ex: 08, 14)
      minute: "2-digit", // Affichage sur deux chiffres
      second: "2-digit", // Affichage sur deux chiffres
    });
  }, 1000);
}
