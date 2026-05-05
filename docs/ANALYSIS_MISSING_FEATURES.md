# Analyse de Conformité aux Exigences (Fonctionnalités Manquantes)

Ce document valide l'adéquation entre les exigences formulées et la solution technique proposée.

## 1. Gestion de l'Historique et des Données Personnelles

### Exigence Utilisateur
> *"Il devra être possible d’ajouter un stagiaire avec ses données personnelles ainsi que les dates du stage. A noter qu’un même stagiaire peut réaliser plusieurs stages à différentes périodes."*

### Solution Technique (Validée)

Notre modèle de données actuel (Table unique `internship`) **ne respecte pas** cette exigence. Nous devons extraire l'identité du stagiaire.

**Modèle Cible (Schéma Entité-Association)** :
1.  **Entité `PERSON` (Le Stagiaire)** :
    *   Stocke l'identité unique : `Nom`, `Prénom`, `Email`.
    *   Clé d'unicité : L'adresse email.
2.  **Entité `INTERNSHIP` (La Période de Stage)** :
    *   Stocke uniquement les données temporelles : `Date Début`, `Date Fin`.
    *   Liée à une `PERSON` par clé étrangère (`person_id`).

**Workflow d'Ajout (Interface Unique)** :
Le formulaire restera simple pour l'utilisateur ("Ajouter un stagiaire") mais le Backend gérera la complexité :
1.  L'utilisateur saisit : Nom, Prénom, Email, Dates.
2.  **Séquence Backend** :
    *   Si l'email existe déjà -> On récupère l'id de la personne existante (et on met à jour son nom si nécessaire).
    *   Si l'email est nouveau -> On crée une nouvelle `PERSON`.
    *   Enfin, on crée une entrée `INTERNSHIP` liée à cet id.

---

## 2. Modification et Suppression

### Exigence Utilisateur
> *"On pourra également modifier l’ensemble des informations de ces stagiaires. Une fonctionnalité de suppression permettra d’effacer les données d’un stagiaire."*

### Solution Technique

*   **Modification** :
    *   Modifier le Nom/Prénom/Email -> Impacte la table `PERSON` (mise à jour globale pour tous les stages de cette personne).
    *   Modifier les Dates -> Impacte uniquement la table `INTERNSHIP` ciblée.
*   **Suppression** :
    *   **Supprimer un stage spécifique** : Supprime uniquement la ligne dans `INTERNSHIP`.
    *   **Supprimer un stagiaire (Personne)** : L'action de suppression sur l'entité `PERSON` déclenchera un **CASCADE DELETE** en base de données, supprimant instantanément **tous** ses stages associés (`INTERNSHIP`) et les liens avec les activités. Cela garantit un nettoyage complet ("effacer les données d'un stagiaire").

---

## 3. Identification des États (Terminé, En cours, À venir)

### Exigence Utilisateur
> *"Une liste permettra d’identifier clairement les stages terminés, les stages en cours et les stages à venir (par stage, on entend une personne pour une période définie)."*

### Solution Technique

Cette distinction sera purement **calculée** (pas de champ "Statut" stocké en dur en base pour éviter les données périmées).

**Règles de Gestion (Calculées à la volée)** :
*   🟢 **En cours** : `DateDébut <= AUJOURD'HUI <= DateFin`
*   🔴 **Terminé** : `DateFin < AUJOURD'HUI`
*   🔵 **À venir** : `DateDébut > AUJOURD'HUI`

**Implémentation** :
*   Le Backend enverra les dates brutes.
*   Le Frontend (Vue.js) utilisera une propriété calculée (`computed`) pour attribuer un badge/couleur dynamique à chaque ligne de la liste.
*   Le tri par défaut mettra en avant les stages "En cours".
