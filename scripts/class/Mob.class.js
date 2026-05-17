/**
 * @class Mob
 * @description Représente un monstre/ennemi généré aléatoirement pour combattre le joueur.
 * Dispose de trois catégories de rareté (normal, élite, boss) qui déterminent l'échelle
 * de ses statistiques de combat, de son gain d'or et d'expérience.
 */
class Mob {
  // =========================================================================
  // PROPRIÉTÉS PRIVÉES
  // =========================================================================

  /** @type {string} Nom d'affichage de la créature */
  _name;

  /** @type {string} Chemin vers l'image d'illustration du monstre */
  _avatar;

  /** @type {number} Butin en pièces d'or obtenu si terrassé */
  _gold;

  /** @type {number} Points d'expérience rapportés au héros s'il gagne */
  _experience;

  /** @type {string} Rareté du monstre : "normal", "elite" ou "boss" */
  _type;

  /** @type {number} Le niveau calculé de la créature (détermine la puissance globale) */
  _level;

  /** @type {number} Points de vie actuels/maximums de la créature */
  _life;

  /** @type {number} Force de frappe servant de plafond au calcul des dégâts */
  _strong;

  // =========================================================================
  // CONSTRUCTEUR AVEC CALIBRAGE DE TYPE ET NIVEAU
  // =========================================================================

  /**
   * Crée une instance de monstre et calcule dynamiquement ses statistiques
   * selon son type (rareté).
   * @param {string} name Nom de la créature.
   * @param {string} avatar Nom de fichier ou chemin de l'illustration.
   * @param {string} type Rareté de la créature ("normal", "elite", "boss").
   */
  constructor(name, avatar, type) {
    this._name = name;
    this._avatar = avatar;
    this._type = type;

    // Détermination dynamique des caractéristiques basées sur le type (rareté)
    switch (type) {
      case "normal":
        // Créatures de base (Niveau 1 à 25)
        this._level = Math.floor(Math.random() * (25 - 1 + 1)) + 1;
        this._gold = Math.floor(this._level / 2 + 1);
        this._experience = Math.floor(this._level / 2 + 5);
        this._life = Math.floor(this._level * 2 + 25);
        this._strong = Math.floor(this._level / 2 + 10);
        break;

      case "elite":
        // Créatures plus coriaces (Niveau 26 à 50)
        this._level = parseInt(Math.floor(Math.random() * (50 - 26 + 1)) + 26);
        this._gold = Math.floor(this._level / 2 + 8);
        this._experience = Math.floor(this._level / 2 + 16);
        this._life = Math.floor(this._level * 2 + 50);
        this._strong = Math.floor(this._level / 2 + 26);
        break;

      case "boss":
        // Ennemis redoutables de fin de parcours (Niveau 51 à 75)
        this._level = parseInt(Math.floor(Math.random() * (75 - 51 + 1)) + 51);
        this._gold = Math.floor(this._level / 2 + 16);
        this._experience = Math.floor(this._level / 2 + 32);
        this._life = Math.floor(this._level * 2 + 75);
        this._strong = Math.floor(this._level / 2 + 51);
        break;

      default:
        // Valeurs de secours si type invalide
        this._level = 1;
        this._gold = 1;
        this._experience = 1;
        this._life = 10;
        this._strong = 5;
        break;
    }
  }

  // =========================================================================
  // GETTERS (RÉCUPÉRATEURS)
  // =========================================================================

  /** @returns {string} Le nom du monstre */
  get name() {
    return this._name;
  }

  /** @returns {string} Le chemin de l'avatar */
  get avatar() {
    return this._avatar;
  }

  /** @returns {number} Les pièces d'or gagnées à sa mort */
  get gold() {
    return this._gold;
  }

  /** @returns {number} Les points d'expérience rapportés */
  get experience() {
    return this._experience;
  }

  /** @returns {string} Le type de monstre (normal, elite, boss) */
  get type() {
    return this._type;
  }

  /** @returns {number} Le niveau du monstre */
  get level() {
    return this._level;
  }

  /** @returns {number} Les points de vie */
  get life() {
    return this._life;
  }

  /** @returns {number} La force de frappe */
  get strong() {
    return this._strong;
  }

  // =========================================================================
  // SETTERS (MODIFICATEURS DE CARACTÉRISTIQUES)
  // =========================================================================

  /**
   * Modifie le nom du monstre et remplace automatiquement les espaces par des underscores.
   * Capped à 11 caractères max.
   * @param {string} newValue
   */
  set name(newValue) {
    if (typeof newValue === "string" && newValue.length <= 11) {
      this._name = newValue.replace(" ", "_");
    }
  }

  /**
   * Modifie le chemin de l'avatar.
   * @param {string} newAvatar
   */
  set urlAvatar(newAvatar) {
    if (typeof newAvatar === "string") {
      this._avatar = newAvatar;
    }
  }

  /**
   * Modifie la bourse d'or portée par le monstre.
   * @param {number} newGold
   */
  set gold(newGold) {
    if (typeof newGold === "number") {
      this._gold = newGold;
    }
  }

  /**
   * Modifie l'expérience rapportée.
   * @param {number} newExperience
   */
  set experience(newExperience) {
    if (typeof newExperience === "number") {
      this._experience = newExperience;
    }
  }

  /**
   * Modifie le niveau du monstre (converti de force en entier).
   * @param {number} newLevel
   */
  set level(newLevel) {
    if (typeof newLevel === "number" || !isNaN(newLevel)) {
      this._level = parseInt(newLevel);
    }
  }

  /**
   * Modifie les points de vie du monstre (converti en entier).
   * @param {number} newLife
   */
  set life(newLife) {
    if (typeof newLife === "number" || !isNaN(newLife)) {
      this._life = parseInt(newLife);
    }
  }

  /**
   * Modifie la force du monstre (CORRIGÉ : newLife remplacé par newStrong).
   * @param {number} newStrong
   */
  set strong(newStrong) {
    if (typeof newStrong === "number" || !isNaN(newStrong)) {
      this._strong = parseInt(newStrong);
    }
  }

  // =========================================================================
  // MÉTHODES DE COMBAT
  // =========================================================================

  /**
   * Génère une valeur de dégâts aléatoire infligée par la créature lors d'un tour.
   * La formule calcule un nombre aléatoire compris entre :
   * - Un minimum de : Force / 2
   * - Un maximum de : Force
   * @returns {number} Les dégâts de l'attaque.
   */
  attack() {
    if (this._type) {
      /**
       * CALCUL DE DÉGÂTS :
       * 1 - Force maximum
       * 2 - Force divisée par 2 comme minimum
       * 3 - Génération aléatoire dans cet intervalle inclusif
       */
      const minDmg = Math.floor(this._strong / 2);
      const maxDmg = this._strong;
      return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
    }
    return 0;
  }
}

export default Mob;
