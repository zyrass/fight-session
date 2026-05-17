/**
 * @class Player
 * @description Représente le héros incarné par le joueur dans le mini-RPG "Fight".
 * Gère les statistiques de base (points de vie, force, expérience), l'équipement,
 * l'inventaire et les méthodes d'action (attaquer, monter de niveau, enregistrer une victoire).
 */
class Player {
  // =========================================================================
  // PROPRIÉTÉS PRIVÉES
  // =========================================================================
  
  /** @type {string} Le pseudonyme choisi par le joueur */
  _pseudo;
  
  /** @type {string} Le chemin de l'image de l'avatar du joueur */
  _avatar;
  
  /** @type {string} La classe de personnage (ex: archère, guerrier, mage...) */
  _type;
  
  /** @type {number} Les points de vie actuels/maximums du joueur */
  _life;
  
  /** @type {number} La force de base du joueur servant à calculer les dégâts */
  _strong;
  
  /** @type {string} Le nom de l'arme équipée, propre au type de héros */
  _weapon;
  
  /** @type {Object} L'inventaire contenant les potions et autres objets achetés */
  _inventory = {};
  
  /** @type {number} Le niveau actuel du joueur (commence au niveau 1) */
  _level = 1;
  
  /** @type {number} Les points d'expérience accumulés en terrassant des monstres */
  _experience = 0;
  
  /** @type {number} La fortune du joueur (monnaie en pièces d'or ou devises) */
  _gold = 0;
  
  /** @type {number} La série actuelle de combats gagnés d'affilée */
  _series = 0;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  /**
   * Crée une instance de héros.
   * @param {string} pseudo Le pseudonyme du héros (entre 3 et 11 caractères).
   * @param {string} avatar Le nom de fichier ou chemin de l'avatar.
   * @param {string} type La classe/type de héros choisie par le joueur.
   */
  constructor(pseudo, avatar, type) {
    this._pseudo = pseudo;
    this._avatar = avatar;
    this._type = type;

    // Détermination des points de vie, de la force et de l'arme selon la classe choisie.
    switch (type) {
      case "archere":
        this._life = 100;
        this._strong = Math.floor(this._life / 4); // Force de base = 25
        this._weapon = "arc";
        break;
      case "assassin":
        this._life = 80;
        this._strong = Math.floor(this._life / 3); // Force de base = 26
        this._weapon = "dagues";
        break;
      case "astrologue":
        this._life = 120;
        this._strong = Math.floor(this._life / 5); // Force de base = 24
        this._weapon = "cartes";
        break;
      case "barde":
        this._life = 125;
        this._strong = Math.floor(this._life / 4.8); // Force de base = 26
        this._weapon = "harpe";
        break;
      case "guerrier":
        this._life = 90;
        this._strong = Math.floor(this._life / 3.5); // Force de base = 25
        this._weapon = "hache";
        break;
      case "invocateur":
        this._life = 150;
        this._strong = Math.floor(this._life / 6); // Force de base = 25
        this._weapon = "livre ancien";
        break;
      case "mage":
        this._life = 80;
        this._strong = Math.floor(this._life / 2.9); // Force de base = 27
        this._weapon = "bâton";
        break;
      case "ninja":
        this._life = 90;
        this._strong = Math.floor(this._life / 3.4); // Force de base = 26
        this._weapon = "shuriken";
        break;
      case "soigneur":
        this._life = 180;
        this._strong = Math.floor(this._life / 7); // Force de base = 25
        this._weapon = "sceptre";
        break;
      default:
        // Classe par défaut si le type n'est pas reconnu (le vagabond sans arme)
        this._life = 50;
        this._strong = Math.floor(this._life / 2); // Force de base = 25
        this._weapon = "poing";
        break;
    }
  }

  // =========================================================================
  // GETTERS (RÉCUPÉRATEURS)
  // =========================================================================

  /**
   * Obtient le pseudo du joueur.
   * @returns {string} Le pseudo.
   */
  get pseudo() {
    return this._pseudo;
  }

  /**
   * Obtient le chemin de l'avatar du joueur.
   * @returns {string} L'avatar.
   */
  get avatar() {
    return this._avatar;
  }

  /**
   * Obtient la classe/type de héros.
   * @returns {string} Le type de classe.
   */
  get type() {
    return this._type;
  }

  /**
   * Obtient les points de vie actuels.
   * @returns {number} Les points de vie.
   */
  get life() {
    return this._life;
  }

  /**
   * Obtient la force actuelle.
   * @returns {number} La force.
   */
  get strong() {
    return this._strong;
  }

  /**
   * Obtient l'arme équipée.
   * @returns {string} L'arme du héros.
   */
  get weapon() {
    return this._weapon;
  }

  /**
   * Obtient le contenu de l'inventaire.
   * @returns {Object} L'inventaire (potions, équipements).
   */
  get inventory() {
    return this._inventory;
  }

  /**
   * Obtient le niveau actuel.
   * @returns {number} Le niveau (1 à n).
   */
  get level() {
    return this._level;
  }

  /**
   * Obtient le score d'expérience cumulé.
   * @returns {number} L'expérience.
   */
  get experience() {
    return this._experience;
  }

  /**
   * Obtient la bourse de pièces d'or du joueur.
   * @returns {number} L'or.
   */
  get gold() {
    return this._gold;
  }

  /**
   * Obtient la série actuelle de victoires consécutives.
   * @returns {number} La série de victoires.
   */
  get series() {
    return this._series;
  }

  // =========================================================================
  // SETTERS (MODIFICATEURS AVEC CONTRÔLE DE TYPE)
  // =========================================================================

  /**
   * Définit un nouveau pseudonyme si valide.
   * @param {string} newPseudo Le nouveau pseudo.
   */
  set pseudo(newPseudo) {
    if (typeof newPseudo === "string") {
      this._pseudo = newPseudo;
    }
  }

  /**
   * Définit une nouvelle image d'avatar.
   * @param {string} newAvatar Le chemin ou fichier du nouvel avatar.
   */
  set avatar(newAvatar) {
    if (typeof newAvatar === "string") {
      this._avatar = newAvatar;
    }
  }

  /**
   * Modifie les points de vie du joueur.
   * @param {number} newLife Les nouveaux points de vie.
   */
  set life(newLife) {
    if (typeof newLife === "number") {
      this._life = newLife;
    }
  }

  /**
   * Modifie la valeur de force du joueur.
   * @param {number} newStrong La nouvelle force.
   */
  set strong(newStrong) {
    if (typeof newStrong === "number") {
      this._strong = newStrong;
    }
  }

  /**
   * Modifie le niveau du joueur.
   * @param {number} newLevel Le nouveau niveau.
   */
  set level(newLevel) {
    if (typeof newLevel === "number") {
      this._level = newLevel;
    }
  }

  /**
   * Modifie la quantité d'expérience cumulée.
   * @param {number} newExperience La nouvelle expérience.
   */
  set experience(newExperience) {
    if (typeof newExperience === "number") {
      this._experience = newExperience;
    }
  }

  /**
   * Modifie la bourse d'or du joueur.
   * @param {number} newGold Le nouveau montant en or.
   */
  set gold(newGold) {
    if (typeof newGold === "number") {
      this._gold = newGold;
    }
  }

  /**
   * Modifie la série actuelle de victoires.
   * @param {number} newSeries La nouvelle série de victoires.
   */
  set series(newSeries) {
    if (typeof newSeries === "number") {
      this._series = newSeries;
    }
  }

  // =========================================================================
  // MÉTHODES DE JEU (LOGIQUE MÉTIER)
  // =========================================================================

  /**
   * Génère une valeur de dégâts aléatoire infligée par le joueur lors d'un tour de combat.
   * La formule calcule un nombre aléatoire compris entre :
   * - Un minimum de : Force / 2
   * - Un maximum de : Force
   * @returns {number} La quantité de dégâts infligée.
   */
  attack() {
    if (this._type) {
      /**
       * CALCUL DE DÉGÂTS :
       * 1 - Force de départ comme borne maximale
       * 2 - Force divisée par 2 comme borne minimale
       * 3 - Génération aléatoire dans cet intervalle inclusif
       */
      const minDmg = Math.floor(this._strong / 2);
      const maxDmg = this._strong;
      return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
    }
    return 0;
  }

  /**
   * Fait monter le joueur de niveau.
   * Augmente le niveau de 1, ajoute 50% de la vie maximale précédente,
   * et augmente la force de : Force actuelle + 5 points fixes.
   */
  levelUp() {
    this._level += 1;
    this._life += Math.floor(this._life / 2);
    this._strong += this._strong + 5;
  }

  /**
   * Enregistre une victoire de combat dans la série en cours du héros.
   */
  win() {
    this._series += 1;
  }
}

export default Player;
