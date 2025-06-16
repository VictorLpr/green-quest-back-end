# 🌿 Green Quest – Back-end API

API Node.js permettant aux utilisateurs de déclarer leurs collectes de déchets, de cumuler des points, et de les convertir en dons pour des associations. Elle gère aussi les villes, les types de déchets, les utilisateurs (volontaires), et un système de classement (leaderboard).

---

## 📦 Stack technique

- **Langage :** JavaScript (Node.js)
- **Framework :** Express
- **Base de données :** PostgreSQL (hébergée sur Neon)
- **Authentification :** via bcrypt (hash de mot de passe)
- **Autres outils :**
  - `dotenv` : gestion des variables d’environnement
  - `pg` : connecteur PostgreSQL
  - `cors` : autorisation des requêtes cross-origin

---

## 🚀 Installation et démarrage

```bash
git clone https://github.com/laanatri/green-quest-back-end
cd green-quest-back-end
npm install
```

Crée un fichier `.env` à la racine :

```env
DATABASE_URL=postgresql://user:password@host/dbname
```

Lance le serveur :

```bash
node app.js
```

Le serveur écoute sur le port `5001`.

---

## 📁 Structure du projet

```
├── app.js
├── db.js
├── routes/
│   ├── associations.js
│   ├── cities.js
│   ├── collections.js
│   ├── donations.js
│   ├── leaderboard.js
│   ├── volunteers.js
│   └── wastes.js
└── utils/
    ├── city.js
    ├── helpers.js
    └── middleware.js
```

---

## 🔐 Authentification

- Authentification via la route `POST /volunteers/login`
- Vérification du mot de passe avec `bcrypt.compare`
- Les mots de passe sont stockés de manière sécurisée via hash (`bcrypt`)

---

## 🧐 Fonctionnalités clés

- 📍 **Détection ou création automatique de ville** (middleware `getOrCreateCity`)
- ♻️ **Déclaration de collecte** : avec ville, type de déchet, et attribution de points
- 🎁 **Don** : échange de points contre des dons à des associations
- 🏆 **Leaderboard** : classement par montant total de dons
- 🔎 **Recherche** de volontaires par nom ou ville
- ✏️ **Mise à jour / suppression** de volontaires

---

## 🔄 Endpoints de l'API

### 🔐 Authentification

- `POST /volunteers/login` → Connexion d'un utilisateur

---

### 👤 Utilisateurs (volunteers)

- `GET /volunteers` → Liste tous les utilisateurs
- `GET /volunteers/:username` → Détails d’un utilisateur par pseudo
- `POST /volunteers` → Création d’un nouvel utilisateur
- `PATCH /volunteers/:id` → Mise à jour d’un utilisateur
- `DELETE /volunteers/:username` → Suppression d’un utilisateur

---

### 🏣 Villes (cities)

- `GET /cities` → Liste des villes ayant au moins un volontaire

---

### 🗑️ Déchets (wastes)

- `GET /wastes` → Liste des types de déchets avec leurs valeurs en points

---

### 📦 Collectes (collections)

- `POST /collections` → Enregistre une collecte
  - Body :
    ```json
    {
      "volunteerId": 1,
      "quantitiesArray": [
        { "wasteId": 2, "wastePoints": 10, "quantity": 3 }
      ],
      "city": {
        "title": "Paris",
        "zipcode": "75000",
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
    ```
- `GET /collections/:id/:date` → Donne le détail des collectes par utilisateur et par mois

---

### 💝 Dons (donations)

- `GET /donations` → Liste des dons
- `POST /donations` → Enregistre un don (et sa valeur)
  - Body :
    ```json
    {
      "volunteerId": 1,
      "associationId": 2,
      "value": 50
    }
    ```

---

### 🏅 Classement (leaderboard)

- `GET /leaderboard` → Récupère le classement des volontaires selon le montant total de dons

---

### 🏢 Associations

- `GET /associations` → Liste des associations

---

## 🔧 Middleware personnalisé

- `utils/city.js` : Middleware pour retrouver ou créer une ville en base, utilisé automatiquement à la création d’un utilisateur ou d’une collecte
- `utils/helpers.js` : Fonction utilitaire pour le hash des mots de passe
- `utils/middleware.js` : Middleware pour rechercher un utilisateur par username

---

## 👥 Auteurs

- Edwige Saves – [@Edwige08](https://github.com/Edwige08)
- Faty Diarra – [@fatydm](https://github.com/fatydm)
- Victor Lepron – [@VictorLpr](https://github.com/VictorLpr)
- Adélaïde Laanatri – [@laanatri](https://github.com/laanatri)

---

## 🦖 Améliorations possibles

- Ajout de tests unitaires (Jest, Supertest)
- Gestion d’erreurs centralisée
- Ajout d’un système de session ou de token (JWT)
- Pagination et filtres sur les listes (volunteers, donations, etc.)

