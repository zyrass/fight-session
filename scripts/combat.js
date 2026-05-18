/**
 * @file combat.js
 * @description Moteur de combat principal de l'application (pages/fight/index.html).
 * Récupère le personnage du LocalStorage, instancie Player, génère procéduralement un ennemi,
 * gère la boucle de combat tour par tour, met à jour le DOM en temps réel, affiche des logs
 * dynamiques de combat, gère la victoire/défaite et persiste la progression.
 */

import Player from "./class/Player.class.js";
import ListMob from "./listMob.js";

// =========================================================================
// 1. CHARGEMENT ET SÉCURISATION DU HÉROS
// =========================================================================

const pseudo = localStorage.getItem("pseudo");
if (!pseudo) {
  // Pas de personnage créé -> redirection immédiate à l'accueil
  alert("Pas de héros détecté ! Redirection vers l'accueil.");
  location.href = "../../index.html";
}

// Reconstruction de l'instance de combat du joueur à partir du cache LocalStorage
const player = new Player(
  pseudo,
  localStorage.getItem("avatar"),
  localStorage.getItem("type")
);

// Restauration de l'état dynamique (vie courante, force augmentée, or, XP, série)
player.life = parseInt(localStorage.getItem("life")) || player.life;
player.strong = parseInt(localStorage.getItem("strong")) || player.strong;
player.gold = parseInt(localStorage.getItem("gold")) || 0;
player.experience = parseInt(localStorage.getItem("experience")) || 0;
player.series = parseInt(localStorage.getItem("series")) || 0;
player.level = parseInt(localStorage.getItem("level")) || 1;

const lifeMax = parseInt(localStorage.getItem("lifeMax")) || player.life;

// =========================================================================
// 2. GÉNÉRATION DE L'IA (MONSTRE ADAPTÉ AU NIVEAU)
// =========================================================================

let mobPrototype;

// Système d'équilibrage : le monstre est choisi selon le niveau du joueur
if (player.level <= 2) {
  // Bas niveau -> Mobs Normaux (ex: Abeille_White)
  const list = ListMob.normal;
  mobPrototype = list[Math.floor(Math.random() * list.length)];
} else if (player.level <= 5) {
  // Niveau intermédiaire -> Mobs Élite (ex: Lapin_Elite)
  const list = ListMob.elite;
  mobPrototype = list[Math.floor(Math.random() * list.length)];
} else {
  // Haut niveau -> Mobs Boss (ex: Cerf_Boss)
  const list = ListMob.boss;
  mobPrototype = list[Math.floor(Math.random() * list.length)];
}

// Clonage de l'instance pour isoler le combat
const mob = {
  name: mobPrototype.name,
  avatar: mobPrototype.avatar,
  type: mobPrototype.type,
  level: mobPrototype.level,
  life: mobPrototype.life,
  lifeMax: mobPrototype.life,
  strong: mobPrototype.strong,
  gold: mobPrototype.gold,
  experience: mobPrototype.experience,
  attack: () => mobPrototype.attack()
};

// =========================================================================
// 3. RACCORDEMENT ET SÉLECTION DES ÉLÉMENTS DU DOM
// =========================================================================

// --- CÔTÉ JOUEUR (GAUCHE) ---
const playerTitle = document.querySelector("#combat .left .card h3");
const playerLifeBarVal = document.querySelector("#combat .left .card .stats .lifebar div span:first-of-type");
const playerLifeBarMax = document.querySelector("#combat .left .card .stats .lifebar div span:last-of-type");
const playerForce = document.querySelector("#combat .left .card .stats .force span:last-of-type");
const playerSeries = document.querySelector("#combat .left .card .stats .series span");
const playerCard = document.querySelector("#combat .left .card");

// --- CÔTÉ ENNEMI (DROITE) ---
const mobTitle = document.querySelector("#combat .right .card h3");
const mobLifeProgress = document.querySelector("#combat .right .card .stats .lifebar progress");
const mobForce = document.querySelector("#combat .right .card .stats .force span:first-of-type");
const mobCard = document.querySelector("#combat .right .card");

// --- INTERACTION ET DIALOGUES DE COMBAT ---
const btnFight = document.querySelector("#combat > button");
const logPlayer = document.querySelector("#combat .status-fight .right ul"); // Dégâts infligés
const logMob = document.querySelector("#combat .status-fight .left ul");     // Dégâts subis

// --- OVERLAYS FIN DE COMBAT ---
const winOverlay = document.querySelector("#combat .win");
const looseOverlay = document.querySelector("#combat .loose");

// =========================================================================
// 4. SYNC INITIALE DU HÉROS ET DU MONSTRE DANS LE DOM
// =========================================================================

// Joueur
playerTitle.textContent = `${player.pseudo} (Lvl ${player.level})`;
playerLifeBarVal.textContent = player.life;
playerLifeBarMax.textContent = lifeMax;
playerForce.textContent = player.strong;
playerSeries.textContent = player.series;

// Application de l'avatar du joueur en arrière-plan de sa carte
playerCard.style.backgroundImage = `url(../../${player.avatar})`;
playerCard.style.backgroundSize = "cover";
playerCard.style.backgroundPosition = "center";

// Ennemi
mobTitle.textContent = `${mob.name.replace("_", " ")} (Lvl ${mob.level})`;
mobLifeProgress.setAttribute("max", mob.lifeMax);
mobLifeProgress.setAttribute("value", mob.life);
mobForce.textContent = mob.strong;

// Application de l'avatar du monstre en arrière-plan de sa carte
mobCard.style.backgroundImage = `url(../../assets/images/mobs/${mob.avatar}.jpeg)`;
mobCard.style.backgroundSize = "cover";
mobCard.style.backgroundPosition = "center";

// Historique des tours de jeu
let turnCount = 1;
const historyPlayer = [];
const historyMob = [];

// =========================================================================
// 5. FONCTIONS COMPLÉMENTAIRES (LOGS, VICTOIRE, DÉFAITE)
// =========================================================================

/**
 * Met à jour le journal de combat dans le DOM.
 * @param {HTMLElement} logElement Conteneur UL.
 * @param {Array} historyArray Tableau contenant l'historique des actions.
 */
function updateLogs(logElement, historyArray) {
  logElement.innerHTML = "";
  // Récupère les 5 dernières actions pour un affichage dynamique non-saturé
  const recentActions = historyArray.slice(-5).reverse();
  
  recentActions.forEach((action) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>Tour n°${action.turn}</span> <span>${action.desc}</span>`;
    logElement.appendChild(li);
  });
}

/**
 * Déclenche les animations et la persistance lors d'une victoire du joueur.
 */
function handleVictory() {
  player.win(); // Augmente la série de victoires de 1
  player.gold += mob.gold;
  player.experience += mob.experience;

  // Calcul du seuil d'expérience nécessaire pour passer au niveau supérieur (50 XP par niveau)
  const experienceRequired = player.level * 50;
  let leveledUp = false;
  let oldLifeMax = lifeMax;
  let oldStrong = player.strong;

  if (player.experience >= experienceRequired) {
    player.levelUp(); // Déclenche les gains de vie (+50%) et de force (+force +5)
    leveledUp = true;
    player.experience = player.experience - experienceRequired; // Garde le surplus d'XP
  }

  // Sauvegarde globale de l'état
  localStorage.setItem("gold", player.gold);
  localStorage.setItem("experience", player.experience);
  localStorage.setItem("series", player.series);
  localStorage.setItem("level", player.level);

  if (leveledUp) {
    localStorage.setItem("life", player.life);     // Soigné au max après un levelUp
    localStorage.setItem("lifeMax", player.life);  // Nouvelle vie max
    localStorage.setItem("strong", player.strong);  // Nouvelle force
  } else {
    // Si pas de montée de niveau, sa vie courante reste blessée suite aux combats
    localStorage.setItem("life", player.life);
  }

  // Configuration de l'overlay de victoire
  winOverlay.querySelector("h3").textContent = "VICTOIRE GLORIEUSE ! 🎉";
  
  let victoryText = `
    Excellent, tu as écrasé <strong>${mob.name.replace("_", " ")}</strong> !<br/><br/>
    💰 Or récolté : +${mob.gold} 💵<br/>
    🌟 EXP gagnée : +${mob.experience} points<br/>
    🔥 Série de victoires actuelle : <strong>${player.series}</strong> combat(s)<br/>
  `;

  if (leveledUp) {
    victoryText += `
      <br/>⭐ <strong>NIVEAU SUPÉRIEUR ! (Lvl ${player.level})</strong> ⭐<br/>
      💖 Vie max augmentée : ${oldLifeMax} ❤️ -> ${player.life} ❤️<br/>
      💪 Force accrue : ${oldStrong} 💪 -> ${player.strong} 💪
    `;
  }

  winOverlay.querySelector("p").innerHTML = victoryText;
  winOverlay.style.display = "flex";

  // Configuration des boutons de redirection
  const btnGoShop = winOverlay.querySelector(".actions button:first-child");
  const btnNextFight = winOverlay.querySelector(".actions button:last-child");

  btnGoShop.textContent = "Visiter le Magasin 🛒";
  btnGoShop.onclick = () => {
    location.href = "../shop/shopping.html";
  };

  btnNextFight.textContent = "Prochain Combat ⚔️";
  btnNextFight.onclick = () => {
    location.reload();
  };
}

/**
 * Gère l'overlay et la réinitialisation lors de la défaite du joueur.
 */
function handleDefeat() {
  looseOverlay.querySelector("h3").textContent = "TU T'ES FAIT DÉFONCER ! 💀";
  
  looseOverlay.querySelector("p").innerHTML = `
    Ah ouais... Tu t'es fait éclater comme un gros nul par <strong>${mob.name.replace("_", " ")}</strong>...<br/>
    Ta série s'arrête brutalement à <strong>${player.series}</strong> victoires consécutives.<br/><br/>
    <em>Retourne t'entraîner, baltringue !</em>
  `;

  // Nettoyage de la partie en cours dans le LocalStorage
  localStorage.clear();

  looseOverlay.style.display = "flex";

  const btnScores = looseOverlay.querySelector(".actions button:first-child");
  const btnRestart = looseOverlay.querySelector(".actions button:last-child");

  btnScores.textContent = "Menu Principal 🏠";
  btnScores.onclick = () => {
    location.href = "../../index.html";
  };

  btnRestart.textContent = "Recréer un Héros 🛡️";
  btnRestart.onclick = () => {
    location.href = "../form/createHeroe.html";
  };
}

// =========================================================================
// 6. BOUCLE DE COMBAT (ÉCOUTEUR D'ÉVÉNEMENT)
// =========================================================================

btnFight.addEventListener("click", () => {
  // Empêcher d'attaquer si l'un des deux combattants est déjà mort
  if (player.life <= 0 || mob.life <= 0) return;

  // --- TOUR DU JOUEUR ---
  const playerDamage = player.attack();
  mob.life = Math.max(0, mob.life - playerDamage);
  
  // Met à jour la barre de vie du monstre
  mobLifeProgress.setAttribute("value", mob.life);
  
  // Log de l'attaque du joueur
  historyPlayer.push({
    turn: turnCount,
    desc: `Tu infliges <strong>${playerDamage}</strong> dégâts à ${mob.name.replace("_", " ")} !`
  });
  updateLogs(logPlayer, historyPlayer);

  // Vérification de la mort du monstre
  if (mob.life <= 0) {
    handleVictory();
    return;
  }

  // --- TOUR DU MONSTRE (RÉPLIQUE) ---
  const mobDamage = mob.attack();
  player.life = Math.max(0, player.life - mobDamage);
  
  // Met à jour l'affichage de vie du joueur
  playerLifeBarVal.textContent = player.life;
  
  // Log de l'attaque du monstre
  historyMob.push({
    turn: turnCount,
    desc: `<strong>${mob.name.replace("_", " ")}</strong> te cause <strong>${mobDamage}</strong> dommages !`
  });
  updateLogs(logMob, historyMob);

  // Vérification de la mort du joueur
  if (player.life <= 0) {
    handleDefeat();
    return;
  }

  // Passage au tour suivant
  turnCount++;
});
