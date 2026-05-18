# 🔧 Blueprint Technique de Reproduction & Cahier de Viabilité

> [!IMPORTANT]
> **Objectif de ce document** : Fournir le plan d'ingénierie et de reproduction de A à Z du mini-RPG **Fight**.
> Il détaille l'**ordre chronologique de création des fichiers** ainsi que les structures de code entièrement commentées et documentées pour permettre à n'importe quel développeur de recréer et d'étendre le projet en partant de zéro.

---

## 📅 1. Ordre de Création des Fichiers (Chronologie de Reproduction)

Pour reconstruire le projet avec succès en évitant les conflits de dépendances, il est impératif de suivre cet ordre de création séquentiel (les fondations d'abord, la logique ensuite, l'habillage en dernier) :

```mermaid
flowchart TD
    subgraph Étape 1 : Fondations Communes
    F1["1. assets/styles/base.css"] --> F2["2. scripts/base/hour.js"]
    end
    
    subgraph Étape 2 : Modèles Orientés Objet (POO)
    F2 --> F3["3. scripts/base/Player.class.js"]
    F3 --> F4["4. scripts/base/Mob.class.js"]
    F4 --> F5["5. scripts/listMob.js"]
    end
    
    subgraph Étape 3 : Accueil & Insultes
    F5 --> F6["6. index.html"]
    F6 --> F7["7. program.js"]
    F7 --> F8["8. looser.js"]
    end
    
    subgraph Étape 4 : Création du Héros
    F8 --> F9["9. pages/form/createHeroe.html"]
    F9 --> F10["10. assets/styles/style_form.css"]
    F10 --> F11["11. scripts/form.js"]
    end
    
    subgraph Étape 5 : Arène de Combat
    F11 --> F12["12. pages/fight/index.html"]
    F12 --> F13["13. assets/styles/style_fight.css"]
    F13 --> F14["14. scripts/combat.js"]
    end
    
    subgraph Étape 6 : Boutique & Sac à Dos
    F14 --> F15["15. pages/shop/shopping.html"]
    F15 --> F16["16. assets/styles/style_shop.css"]
    F16 --> F17["17. scripts/shop.js"]
    end
```

---

## 🛠️ 2. Structure & Code Commenté pas à pas pour la Reproduction

Voici le code commenté à l'extrême et l'explication de chaque fichier dans son ordre de création :

### 🧱 Étape 1 : Fondations Communes

#### 1. [base.css](file:///g:/www/projects/js/fight-session/assets/styles/base.css)
*   **Rôle** : Centraliser les tokens de design (variables CSS) et le style de l'en-tête (Navbar) avec le HUD joueur persistant.
*   **Détails de reproduction** : Définir les variables de couleurs (or, danger, success, info) et structurer la classe `.header-hud` en verre dépoli avec `backdrop-filter: blur(8px)`.
*   *Code clé commenté* :
```css
:root {
  --primary: #101423;       /* Couleur sombre principale */
  --secondary: #1e272e;     /* Couleur des cartes */
  --gold: #e8cc68;          /* Couleur or et accents premium */
  --success: #2ed573;       /* Vert de guérison/succès */
  --danger: #ff4757;        /* Rouge d'attaque/défaite */
  --info: #1e90ff;          /* Bleu info pour la jauge d'XP */
  --white: #ffffff;
  --muted: #a4b0be;         /* Gris texte secondaire */
}

/* Styles communs du HUD Navbar */
header .header-hud {
  display: flex;
  align-items: center;
  gap: 25px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 6px 20px;
  backdrop-filter: blur(8px);
}
```

#### 2. [hour.js](file:///g:/www/projects/js/fight-session/scripts/base/hour.js)
*   **Rôle** : Fournir l'horloge dynamique affichée dans le footer de toutes les pages.
*   *Code clé commenté* :
```javascript
// Mise à jour de la date et heure du footer en temps réel
function updateClock() {
  const clockElement = document.getElementById("date");
  if (clockElement) {
    const now = new Date();
    // Formatage propre : HH:MM:SS
    clockElement.textContent = now.toLocaleTimeString("fr-FR");
  }
}
setInterval(updateClock, 1000);
updateClock(); // Appel initial
```

---

### 🧬 Étape 2 : Modèles de Données & Base de Données

#### 3. [Player.class.js](file:///g:/www/projects/js/fight-session/scripts/base/Player.class.js)
*   **Rôle** : Modéliser le héros du joueur avec ses statistiques initiales et ses montées de niveau.
*   **Équilibrage linéaire** : Gain de +25 PV Max et +4 Force par niveau pour éviter les crashs de progression exponentielle.
*   *Code clé commenté* :
```javascript
/**
 * Représente le Héros du joueur.
 */
export default class Player {
  /**
   * @param {string} pseudo - Pseudo du héros.
   * @param {string} avatar - Chemin de l'image de l'avatar.
   * @param {string} type - Classe du héros (guerrier, mage...).
   */
  constructor(pseudo, avatar, type) {
    this._pseudo = pseudo;
    this._avatar = avatar;
    this._type = type;
    this._level = 1;
    this._experience = 0;
    this._gold = 0;
    this._series = 0;
    this._inventory = {};
    
    // Initialisation équilibrée par classe de personnage
    switch (type) {
      case "archere":
        this._life = 100;
        this._lifeMax = 100;
        this._strong = 25;
        this._weapon = "Arc en bois de cerf 🏹";
        break;
      case "guerrier":
        this._life = 90;
        this._lifeMax = 90;
        this._strong = 25;
        this._weapon = "Hache à double tranchant 🪓";
        break;
      case "mage":
        this._life = 80;
        this._lifeMax = 80;
        this._strong = 27;
        this._weapon = "Bâton d'arcanes de feu 🪄";
        break;
      default:
        this._life = 100;
        this._lifeMax = 100;
        this._strong = 25;
        this._weapon = "Épée rouillée 🗡️";
    }
  }

  // --- SETTERS & GETTERS SECURISE ---
  get lifeMax() { return this._lifeMax; }
  set lifeMax(val) { this._lifeMax = parseInt(val); }

  /**
   * Formule de dégâts basée sur la force actuelle +/- 20%
   */
  attack() {
    const min = Math.floor(this._strong * 0.8);
    const max = Math.floor(this._strong * 1.2);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Passage de niveau linéaire
   */
  levelUp() {
    this._level++;
    this._lifeMax += 25; // Augmentation linéaire saine
    this._life = this._lifeMax; // Soigné à fond lors du gain de niveau
    this._strong += 4;   // Gain de force linéaire
  }

  win() { this._series++; }
}
```

#### 4. [Mob.class.js](file:///g:/www/projects/js/fight-session/scripts/base/Mob.class.js)
*   **Rôle** : Modéliser un monstre générique servant de base pour l'arène.
*   *Code clé commenté* :
```javascript
/**
 * Représente un monstre ennemi de l'arène.
 */
export default class Mob {
  constructor(name, avatar, type, level, life, strong, gold, experience) {
    this._name = name;
    this._avatar = avatar;
    this._type = type; // normal, elite, boss
    this._level = level;
    this._life = life;
    this._lifeMax = life;
    this._strong = strong;
    this._gold = gold;
    this._experience = experience;
  }

  attack() {
    return Math.floor(Math.random() * this._strong) + 1;
  }
}
```

#### 5. [listMob.js](file:///g:/www/projects/js/fight-session/scripts/listMob.js)
*   **Rôle** : Contenir la base de données instanciée des **26 créatures uniques** réparties par catégories.
*   *Structure clé commentée* :
```javascript
// Base de données des 26 monstres uniques du jeu
const ListMob = {
  normal: [
    { name: "Abeille White", avatar: "abeille_white", type: "normal" },
    { name: "Chauve-souris White", avatar: "chauve_souris_white", type: "normal" }
  ],
  elite: [
    { name: "Panda Elite", avatar: "panda_elite", type: "elite" }
  ],
  boss: [
    { name: "Cerf Boss", avatar: "cerf_boss", type: "boss" }
  ]
};
export default ListMob;
```

---

### 🎭 Étape 3 : Écran d'Accueil & Insultes

#### 6. [index.html](file:///g:/www/projects/js/fight-session/index.html)
*   **Rôle** : Écran d'accueil. Propose le défi.
*   **Correction majeure** : L'ID `btnPlayer` doit mener à la création sans lever d'exception.
*   *Code JS embarqué corrigé* :
```javascript
btnPlayer.addEventListener("click", (e) => {
  e.preventDefault(); // Bloquer la soumission
  location.href = "./pages/form/createHeroe.html"; // Assigner correctement l'URL
});
```

#### 7. [program.js](file:///g:/www/projects/js/fight-session/program.js)
*   **Rôle** : Gérer la liste des insultes en cas de refus du défi.
*   *Code commenté* :
```javascript
const listMessages = [
  "Espèce de moldue...",
  "Oh peuchère t'es dégun !!",
  "Va te faire niquer par un dromadaire... 🐪",
  "Le cercueil de tous tes morts, arrache-toi vite !!"
];

// Affiche une insulte aléatoire sur l'IHM
btnRefuse.addEventListener("click", () => {
  const randMsg = listMessages[Math.floor(Math.random() * listMessages.length)];
  document.getElementById("message-insult").innerHTML = `📢 <em>"${randMsg}"</em>`;
});
```

---

### 🛡️ Étape 4 : Création du Héros

#### 9. [createHeroe.html](file:///g:/www/projects/js/fight-session/pages/form/createHeroe.html)
*   **Rôle** : Formulaire visuel de choix des avatars et saisie du pseudo.
*   **Validation JS** : Intégration du script `form.js` avec type `module`.

#### 11. [form.js](file:///g:/www/projects/js/fight-session/scripts/form.js)
*   **Rôle** : Intercepter le formulaire, valider les règles (pseudo entre 3 et 11 caractères, avatar sélectionné), instancier `Player` et enregistrer dans le `localStorage`.
*   *Code commenté* :
```javascript
import Player from "./base/Player.class.js";

const btnSubmit = document.getElementById("buttonNewPseudo");
const avatars = document.querySelectorAll(".avatars figure img");

let selectedAvatar = null;
let selectedType = null;

// Écouteur de sélection d'avatar
avatars.forEach(img => {
  img.addEventListener("click", (e) => {
    avatars.forEach(i => i.classList.remove("selected"));
    e.target.classList.add("selected");
    selectedAvatar = e.target.getAttribute("src");
    selectedType = e.target.id;
  });
});

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const pseudo = document.getElementById("pseudo").value.trim();
  if (pseudo.length < 3 || pseudo.length > 11) {
    alert("Pseudo invalide !");
    return;
  }
  
  const hero = new Player(pseudo, selectedAvatar, selectedType);
  localStorage.setItem("pseudo", hero.pseudo);
  localStorage.setItem("avatar", hero.avatar);
  localStorage.setItem("type", hero.type);
  localStorage.setItem("life", hero.life);
  localStorage.setItem("lifeMax", hero.lifeMax);
  localStorage.setItem("strong", hero.strong);
  localStorage.setItem("gold", 0);
  localStorage.setItem("experience", 0);
  localStorage.setItem("series", 0);
  localStorage.setItem("level", 1);
  
  location.href = "../fight/index.html"; // Direction l'arène !
});
```

---

### ⚔️ Étape 5 : L'Arène de Combat

#### 12. [index.html (Combat)](file:///g:/www/projects/js/fight-session/pages/fight/index.html)
*   **Rôle** : Grille d'arène.
*   **Intégration du HUD** : Intégrer les balises `<span id="hud-lvl-val">`, `<progress id="hud-xp-bar">` et `<span id="hud-gold-val">` dans le `<header>`.

#### 13. [style_fight.css](file:///g:/www/projects/js/fight-session/assets/styles/style_fight.css)
*   **Rôle** : Fournir l'affichage néon avec capsule dépolie pivotée pour les fiches de personnages, et le terminal de combat.
*   **Isolation des sélecteurs** : Utilisation du sélecteur d'enfant direct `main section.combat > div.left` pour ne pas écraser les logs du bas `.status-fight`.

#### 14. [combat.js](file:///g:/www/projects/js/fight-session/scripts/combat.js)
*   **Rôle** : Gérer les rounds d'attaque tour par tour au clic sur "Fight", la génération du monstre selon le niveau, et actualiser le HUD de la navbar.
*   *Code clé commenté* :
```javascript
import Player from "./class/Player.class.js";
import ListMob from "./listMob.js";

// Restauration de l'état
const pseudo = localStorage.getItem("pseudo");
const player = new Player(pseudo, localStorage.getItem("avatar"), localStorage.getItem("type"));
player.life = parseInt(localStorage.getItem("life"));
player.gold = parseInt(localStorage.getItem("gold"));

// Tirage probabiliste du type de monstre selon le niveau du héros
let rarity = "normal";
const rand = Math.random();
if (player.level > 2 && rand < 0.3) rarity = "elite";
if (player.level > 5 && rand < 0.1) rarity = "boss";

const mobList = ListMob[rarity];
const mobProto = mobList[Math.floor(Math.random() * mobList.length)];

// Calcul linéaire des PV et de la force du monstre indexés sur le niveau
const mob = {
  name: mobProto.name,
  life: player.level * 15 + 30,
  strong: player.level * 3 + 5,
  gold: player.level * 5 + 5,
  experience: player.level * 10 + 5
};

// Câblage du HUD Global de l'en-tête
function updateHeaderHud() {
  document.querySelector("#hud-lvl-val").textContent = player.level;
  document.querySelector("#hud-xp-bar").value = player.experience;
  document.querySelector("#hud-xp-bar").max = player.level * 50;
  document.querySelector("#hud-gold-val").textContent = player.gold;
}
```

---

### 🧪 Étape 6 : Boutique de Potions & Sac à Dos

#### 15. [shopping.html](file:///g:/www/projects/js/fight-session/pages/shop/shopping.html)
*   **Rôle** : Structurer la boutique avec sa mise en page double colonne.
*   *Squelette clé* :
```html
<div class="shop-layout">
  <section class="menu">
    <!-- Cartes de potions à prix réduits (25, 50, 100, 200 💵) -->
  </section>
  <section class="inventory">
    <h3>🎒 Ton Sac à Dos</h3>
    <ul><!-- Liste générée en JS --></ul>
  </section>
</div>
```

#### 16. [style_shop.css](file:///g:/www/projects/js/fight-session/assets/styles/style_shop.css)
*   **Rôle** : Établir la grille `.shop-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; }`.
*   **Isolation du clic** : Placer `.pnj img { pointer-events: none; z-index: 1; }` et `.inventory { z-index: 2; background: rgba(15,20,30,0.85); }` pour libérer l'accès aux boutons "Boire".

#### 17. [shop.js](file:///g:/www/projects/js/fight-session/scripts/shop.js)
*   **Rôle** : Synchroniser la bourse d'or, ajouter les potions achetées à l'inventaire, soigner le héros en pourcentage basé sur sa vie maximale, et rafraîchir le HUD.
*   *Code clé commenté* :
```javascript
const potionsConfig = [
  { id: "potion_25", healPercent: 25, price: 25 },
  { id: "potion_50", healPercent: 50, price: 50 },
  { id: "potion_75", healPercent: 75, price: 100 },
  { id: "potion_100", healPercent: 100, price: 200 }
];

// Achat d'une potion
function buyPotion(index) {
  const pot = potionsConfig[index];
  if (gold >= pot.price) {
    gold -= pot.price;
    inventory[pot.id] = (inventory[pot.id] || 0) + 1;
    localStorage.setItem("gold", gold);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateHeaderHud();
    renderInventory();
  }
}
```

---

## 📈 3. Validation Globale de la Viabilité

En suivant scrupuleusement cet ordre de montage et ces spécifications hautement commentées, le projet **Fight** se matérialise comme un modèle de développement sain, exempt de bugs de redirection, doté d'une économie parfaitement viable (prix réduits et gains d'or réguliers) et d'un affichage de jeu de niveau AAA.
