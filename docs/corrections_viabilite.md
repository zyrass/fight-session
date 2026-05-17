# 🔧 Audit Technique des Corrections & Cahier de Viabilité

> [!IMPORTANT]
> **Objectif du document** : Décrire précisément chaque correction de code et chaque script à implémenter pour rendre le mini-RPG **Fight** 100% jouable, interactif et exempt de crashs. Ce document sert de guide technique de développement (Blueprint).

---

## 1. Correction des Fichiers Existants (Sécurisation)

### 🔴 index.html (Écran d'accueil)
- **Problème** : Le clic sur « J'accepte le défi » lève une exception `TypeError: location.href is not a function`.
- **Fichier** : [index.html](file:///g:/www/projects/js/fight-session/index.html)
- **Code défectueux (Ligne 65-67)** :
  ```javascript
  btnPlayer.addEventListener("click", (e) => {
    location.href("/pages/form/createHeroe.html");
  });
  ```
- **Correction à appliquer** :
  ```javascript
  btnPlayer.addEventListener("click", (e) => {
    e.preventDefault(); // Sécurité pour empêcher la soumission du formulaire parent
    location.href = "./pages/form/createHeroe.html";
  });
  ```

---

### 🟡 base.css (Feuille de styles de base)
- **Problème** : Variables CSS non définies dans `:root`, empêchant la coloration des balises `<strong>` (informations) et `<em>` (insultes).
- **Fichier** : [base.css](file:///g:/www/projects/js/fight-session/assets/styles/base.css)
- **Correction à appliquer** : Ajouter les variables manquantes dans le bloc `:root` (Lignes 6-33) :
  ```css
  :root {
    /* ... variables existantes ... */
    --info-strong: #1e90ff; /* Bleu info brillant */
    --danger-em: #ff4757;    /* Rouge danger vif */
  }
  ```

---

## 2. Implémentation de la Logique de Création du Héros

### 🟢 pages/form/createHeroe.html & createHeroe.js
- **Problème** : L'écran de création du personnage est statique, aucun script n'écoute les choix d'avatar ni ne valide le pseudo. De plus, il y a une coquille dans l'ID de l'image de l'assassin (`id="assasin"` au lieu de `id="assassin"` avec deux 's').
- **Correction HTML** :
  1. Modifier l'ID de l'image de l'assassin (Ligne 56) : `id="assassin"`.
  2. Ajouter le script de gestion à la fin de la balise `<body>` (ou dans le `<head>` avec l'attribut `defer`) :
     ```html
     <script src="../../scripts/form.js" type="module"></script>
     ```

- **Nouveau Fichier** : Créer `scripts/form.js` avec la logique d'écoute et d'enregistrement :
  ```javascript
  import Player from "./class/Player.class.js";

  const inputPseudo = document.getElementById("pseudo");
  const btnSubmit = document.getElementById("buttonNewPseudo");
  const avatars = document.querySelectorAll(".avatars figure img");

  let selectedAvatar = null;
  let selectedType = null;

  // Écoute de la sélection de l'avatar et du type
  avatars.forEach((avatarImg) => {
    avatarImg.addEventListener("click", (e) => {
      // Retirer la surbrillance des autres avatars
      avatars.forEach(img => img.style.border = "none");
      // Mettre en surbrillance l'avatar sélectionné
      e.target.style.border = "3px solid var(--gold)";
      
      selectedAvatar = e.target.getAttribute("src"); // Récupère le chemin d'image
      selectedType = e.target.id;                    // Récupère l'ID (ex: "guerrier")
    });
  });

  // Validation et instanciation au clic
  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const pseudo = inputPseudo.value.trim();

    if (pseudo.length < 3 || pseudo.length > 11) {
      alert("Votre pseudo doit comporter entre 3 et 11 caractères !");
      return;
    }

    if (!selectedAvatar || !selectedType) {
      alert("Veuillez sélectionner un avatar de héros !");
      return;
    }

    // Instanciation de notre classe Player
    const player = new Player(pseudo, selectedAvatar, selectedType);

    // Sauvegarde persistante des caractéristiques dans le LocalStorage
    localStorage.setItem("pseudo", player.pseudo);
    localStorage.setItem("avatar", player.avatar);
    localStorage.setItem("type", player.type);
    localStorage.setItem("life", player.life);
    localStorage.setItem("lifeMax", player.life); // Stocke aussi la vie maximale
    localStorage.setItem("strong", player.strong);
    localStorage.setItem("gold", 0);
    localStorage.setItem("experience", 0);
    localStorage.setItem("series", 0);
    localStorage.setItem("weapon", player.weapon);
    localStorage.setItem("inventory", JSON.stringify({}));

    // Redirection vers l'arène de combat
    location.href = "../fight/index.html";
  });
  ```

---

## 3. Rendre l'Arène de Combat Opérationnelle

### 🟢 pages/fight/index.html & combat.js
- **Problème** : Cette page n'a aucun CSS lié et aucune logique interactive. L'arène s'affiche brute et inerte.
- **Correction HTML** :
  1. Ajouter les liens CSS manquants dans le `<head>` de [pages/fight/index.html](file:///g:/www/projects/js/fight-session/pages/fight/index.html) :
     ```html
     <link rel="stylesheet" href="../../assets/styles/base.css" />
     <link rel="stylesheet" href="../../assets/styles/style_fight.css" />
     ```
  2. Charger le script de combat à la fin du `<body>` :
     ```html
     <script src="../../scripts/combat.js" type="module"></script>
     ```

- **Nouveau Fichier** : Créer `scripts/combat.js` pour gérer la boucle d'affrontement :
  ```javascript
  import Player from "./class/Player.class.js";
  import ListMob from "./listMob.js";

  // Récupération des données du joueur
  const pseudo = localStorage.getItem("pseudo");
  if (!pseudo) {
    // Si aucun personnage n'est enregistré, retour à l'accueil
    location.href = "../../index.html";
  }

  // Reconstruction de l'instance Player
  const player = new Player(pseudo, localStorage.getItem("avatar"), localStorage.getItem("type"));
  player.life = parseInt(localStorage.getItem("life"));
  player.strong = parseInt(localStorage.getItem("strong"));
  player.gold = parseInt(localStorage.getItem("gold"));
  player.experience = parseInt(localStorage.getItem("experience"));
  player.series = parseInt(localStorage.getItem("series"));

  // Sélection d'un Monstre aléatoire adapté au niveau (normal pour l'instant)
  const availableMobs = ListMob.normal;
  const mobPrototype = availableMobs[Math.floor(Math.random() * availableMobs.length)];
  // Cloner le monstre pour le combat
  const mob = {
    name: mobPrototype.name,
    avatar: mobPrototype.avatar,
    type: mobPrototype.type,
    level: mobPrototype.level,
    life: mobPrototype.life,
    lifeMax: mobPrototype.life,
    strong: mobPrototype.strong,
    attack: () => mobPrototype.attack(),
    gold: mobPrototype.gold,
    experience: mobPrototype.experience
  };

  // --- Sélecteurs DOM de Combat ---
  const playerTitle = document.querySelector("#combat .left .card h3");
  const playerLifeBarVal = document.querySelector("#combat .left .card .stats .lifebar div span:first-child");
  const playerLifeBarMax = document.querySelector("#combat .left .card .stats .lifebar div span:last-child");
  const playerForce = document.querySelector("#combat .left .card .stats .force span:last-child");
  const playerSeries = document.querySelector("#combat .left .card .stats .series span");
  const playerCard = document.querySelector("#combat .left .card");

  const mobTitle = document.querySelector("#combat .right .card h3");
  const mobLifeProgress = document.querySelector("#combat .right .card .stats .lifebar progress");
  const mobForce = document.querySelector("#combat .right .card .stats .force span:first-child");
  const mobCard = document.querySelector("#combat .right .card");

  const btnFight = document.querySelector("#combat > button");
  const logPlayer = document.querySelector("#combat .status-fight .right ul");
  const logMob = document.querySelector("#combat .status-fight .left ul");

  const winOverlay = document.querySelector("#combat .win");
  const looseOverlay = document.querySelector("#combat .loose");

  // --- Initialisation de l'affichage ---
  playerTitle.textContent = player.pseudo;
  playerLifeBarVal.textContent = player.life;
  playerLifeBarMax.textContent = localStorage.getItem("lifeMax");
  playerForce.textContent = player.strong;
  playerSeries.textContent = player.series;
  playerCard.style.backgroundImage = `url(../../${player.avatar})`;
  playerCard.style.backgroundSize = "cover";

  mobTitle.textContent = mob.name;
  mobLifeProgress.setAttribute("max", mob.lifeMax);
  mobLifeProgress.setAttribute("value", mob.life);
  mobForce.textContent = mob.strong;
  mobCard.style.backgroundImage = `url(../../assets/images/mobs/${mob.avatar}.jpeg)`; // Adapter l'extension
  mobCard.style.backgroundSize = "cover";

  let turnCount = 1;
  const historyPlayer = [];
  const historyMob = [];

  // Mettre à jour l'historique dans le DOM
  function updateLogs(logElement, historyArray) {
    logElement.innerHTML = "";
    historyArray.slice(-5).reverse().forEach((action) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>Tour n°${action.turn}</span> <span>${action.desc}</span>`;
      logElement.appendChild(li);
    });
  }

  // --- Boucle de Combat au clic sur Fight ---
  btnFight.addEventListener("click", () => {
    if (player.life <= 0 || mob.life <= 0) return;

    // 1. Attaque du Joueur
    const pDmg = player.attack();
    mob.life = Math.max(0, mob.life - pDmg);
    mobLifeProgress.setAttribute("value", mob.life);
    historyPlayer.push({ turn: turnCount, desc: `Tu as infligé ${pDmg} dégâts !` });
    updateLogs(logPlayer, historyPlayer);

    // Vérification de la mort du monstre
    if (mob.life <= 0) {
      handleVictory();
      return;
    }

    // 2. Réplique du Monstre
    const mDmg = mob.attack();
    player.life = Math.max(0, player.life - mDmg);
    playerLifeBarVal.textContent = player.life;
    historyMob.push({ turn: turnCount, desc: `${mob.name} t'a causé ${mDmg} dégâts !` });
    updateLogs(logMob, historyMob);

    // Vérification de la mort du joueur
    if (player.life <= 0) {
      handleDefeat();
      return;
    }

    turnCount++;
  });

  // --- Fin de Combat : Victoire ---
  function handleVictory() {
    player.win(); // Incrémente la série de victoires
    player.gold += mob.gold;
    player.experience += mob.experience;

    // Passage de niveau si assez d'XP (palier de 50 XP par exemple)
    let leveledUp = false;
    if (player.experience >= player.level * 50) {
      player.levelUp();
      leveledUp = true;
    }

    // Sauvegarde de l'état du joueur
    localStorage.setItem("life", player.life);
    localStorage.setItem("gold", player.gold);
    localStorage.setItem("experience", player.experience);
    localStorage.setItem("series", player.series);
    localStorage.setItem("strong", player.strong);
    if (leveledUp) {
      localStorage.setItem("lifeMax", player.life); // Nouvelle vie max après levelUp
    }

    // Affichage de l'Overlay Victoire
    winOverlay.style.display = "flex";
    winOverlay.querySelector("p").innerHTML = `
      Excellent, tu triomphes de <strong>${mob.name}</strong> !<br/>
      +${mob.gold} 💵 Or<br/>
      +${mob.experience} XP EXP<br/>
      Série de victoires : ${player.series}<br/>
      ${leveledUp ? "⭐ <strong>NIVEAU SUPÉRIEUR !</strong> ⭐" : ""}
    `;

    // Brancher les boutons d'overlay
    winOverlay.querySelector(".actions button:first-child").addEventListener("click", () => {
      location.href = "../shop/shopping.html"; // Accéder au Magasin
    });
    winOverlay.querySelector(".actions button:last-child").addEventListener("click", () => {
      location.reload(); // Prochain combat
    });
  }

  // --- Fin de Combat : Défaite ---
  function handleDefeat() {
    looseOverlay.style.display = "flex";
    looseOverlay.querySelector("p").innerHTML = `
      Ah ouais... Tu t'es fait pété comme une merde par <strong>${mob.name}</strong>...<br/>
      Fin de ta série de <strong>${player.series}</strong> victoires.
    `;

    // Vider la mémoire de la partie
    localStorage.clear();

    looseOverlay.querySelector(".actions button:first-child").addEventListener("click", () => {
      location.href = "../../index.html"; // Retour à l'accueil
    });
    looseOverlay.querySelector(".actions button:last-child").addEventListener("click", () => {
      location.href = "../form/createHeroe.html"; // Recommencer un personnage
    });
  }
  ```

---

## 4. Activation de la Boutique de Potions

### 🟢 pages/shop/shopping.html & shop.js
- **Problème** : Les cartes de potions ont des prix statiques et des boutons "+1" inertes. L'inventaire ne se met pas à jour et ne permet pas d'utiliser les potions pour regagner de la vie.
- **Correction HTML** :
  1. Lier un script de boutique à la fin du `<body>` de `shopping.html` :
     ```html
     <script src="../../scripts/shop.js" type="module"></script>
     ```

- **Nouveau Fichier** : Créer `scripts/shop.js` pour synchroniser l'or et gérer l'achat/consommation :
  ```javascript
  const pseudo = localStorage.getItem("pseudo");
  if (!pseudo) {
    location.href = "../../index.html";
  }

  let gold = parseInt(localStorage.getItem("gold")) || 0;
  let life = parseInt(localStorage.getItem("life")) || 0;
  let lifeMax = parseInt(localStorage.getItem("lifeMax")) || 100;
  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  // Sélecteurs
  const shopTitle = document.querySelector("main h1");
  const inventoryList = document.querySelector("main .inventory ul");

  // Ajouter l'affichage de l'or du joueur
  const goldIndicator = document.createElement("div");
  goldIndicator.className = "player-gold";
  goldIndicator.innerHTML = `Ta bourse : <strong>${gold} 💵</strong> | Vie actuelle : <strong>${life}/${lifeMax} ❤️</strong>`;
  shopTitle.after(goldIndicator);

  // Configuration des potions disponibles
  const potions = [
    { id: "potion_25", name: "Potion de vie presque vide", healPercent: 25, price: 125 },
    { id: "potion_50", name: "Potion de vie à moitié pleine", healPercent: 50, price: 240 },
    { id: "potion_75", name: "Potion de vie presque pleine", healPercent: 75, price: 360 },
    { id: "potion_100", name: "Potion de vie parfaite", healPercent: 100, price: 490 }
  ];

  // Configurer les écouteurs sur les boutons d'achat des cartes du shop
  const buyButtons = document.querySelectorAll(".card_container-shop button");
  buyButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const potion = potions[index];
      if (gold >= potion.price) {
        gold -= potion.price;
        inventory[potion.id] = (inventory[potion.id] || 0) + 1;

        // Sauvegarder
        localStorage.setItem("gold", gold);
        localStorage.setItem("inventory", JSON.stringify(inventory));

        // Mettre à jour l'IHM
        goldIndicator.innerHTML = `Ta bourse : <strong>${gold} 💵</strong> | Vie actuelle : <strong>${life}/${lifeMax} ❤️</strong>`;
        renderInventory();
      } else {
        alert("Pas assez d'argent, va te faire péter contre d'autres monstres !");
      }
    });
  });

  // Affichage dynamique et consommation de l'inventaire
  function renderInventory() {
    inventoryList.innerHTML = "";
    let isEmpty = true;

    for (const key in inventory) {
      if (inventory[key] > 0) {
        isEmpty = false;
        const potionConfig = potions.find(p => p.id === key);
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${potionConfig.name} (x${inventory[key]})</span>
          <div>
            <button class="use-btn" data-id="${key}">Boire 🧪</button>
          </div>
        `;
        inventoryList.appendChild(li);
      }
    }

    if (isEmpty) {
      inventoryList.innerHTML = "<li><em>Ton inventaire est désespérément vide...</em></li>";
    }

    // Brancher la consommation
    document.querySelectorAll(".use-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const potionId = e.target.getAttribute("data-id");
        const potion = potions.find(p => p.id === potionId);

        if (life >= lifeMax) {
          alert("Tu es déjà en pleine forme, garde tes précieuses potions !");
          return;
        }

        // Calcul du soin
        const healAmount = Math.floor(lifeMax * (potion.healPercent / 100));
        life = Math.min(lifeMax, life + healAmount);
        inventory[potionId]--;

        // Sauvegarder
        localStorage.setItem("life", life);
        localStorage.setItem("inventory", JSON.stringify(inventory));

        // Actualiser l'IHM
        goldIndicator.innerHTML = `Ta bourse : <strong>${gold} 💵</strong> | Vie actuelle : <strong>${life}/${lifeMax} ❤️</strong>`;
        renderInventory();
      });
    });
  }

  // Lancer le premier rendu de l'inventaire
  renderInventory();

  // Ajouter un bouton de retour au combat
  const returnBtn = document.createElement("button");
  returnBtn.textContent = "⚔️ Retourner au Combat ⚔️";
  returnBtn.style.margin = "20px 0";
  returnBtn.addEventListener("click", () => {
    location.href = "../fight/index.html";
  });
  document.querySelector("main").appendChild(returnBtn);
  ```

---

## 5. Conclusion de Viabilité
En implémentant ces 3 scripts complémentaires (`form.js`, `combat.js`, `shop.js`) et en effectuant les corrections HTML/CSS spécifiées, le projet **Fight** passe d'un excellent concept inachevé à un **jeu web rétro interactif fluide, addictif et parfaitement fonctionnel**.
