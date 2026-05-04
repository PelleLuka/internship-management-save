# CA TIC WorkXP Admin — Documentation technique

**Auteur :** Luka Pellegrinelli
**Numéro du candidat :** 155072
**Date de création :** [DATE DE DÉBUT DU TPI]
**Dernière édition :** [DATE DE REMISE]

---

## Table des matières
<!-- Généré automatiquement dans Word -->

---

## 1. Résumé du rapport

**Situation de départ :**

Le Centre d'Apprentissage TIC (CA TIC) de la HEIA-FR organise régulièrement des stages
de découverte du métier d'informaticien-ne CFC à destination des jeunes du cycle
d'orientation (CO). Ces stages, d'une durée de 1 à 2 jours, permettent aux participants de
réaliser divers ateliers pratiques.

Jusqu'alors, le suivi de ces stages était assuré via Microsoft OneNote : la liste des
stagiaires et les ateliers réalisés étaient consignés manuellement dans des notes non
structurées. Ce fonctionnement ne permettait pas de centraliser efficacement les données,
d'identifier clairement les stages terminés ou en cours, ni de générer automatiquement les
certificats de stage.

**Mise en œuvre :**

Pour répondre à ces besoins, une application web d'administration a été développée sous
le nom « CA TIC WorkXP Admin ». Elle repose sur une architecture trois tiers : une
interface Vue.js 3 pour l'administrateur, une API REST Express.js côté serveur, et une
base de données relationnelle MariaDB. L'ensemble est conteneurisé via Docker Compose
pour garantir un environnement reproductible.

L'application couvre cinq modules fonctionnels :
- **Gestion des stagiaires** : création, modification, suppression et consultation avec
  calcul automatique du statut (À venir / En cours / Terminé)
- **Catalogue des ateliers** : gestion complète avec description, document annexe et
  catégories associées
- **Gestion des catégories** : classification des ateliers par domaine
- **Association ateliers ↔ stages** : attribution flexible de plusieurs ateliers à un stage
- **Génération du certificat** : production d'un PDF personnalisé depuis un template DOCX
  via carbone.js

**Résultats :**

Toutes les exigences fonctionnelles définies dans le cahier des charges ont été
implémentées et validées. L'interface permet à l'équipe CA TIC de gérer l'ensemble du
cycle de vie d'un stage depuis une seule application. Les contraintes métier critiques sont
appliquées côté serveur (suppression d'un atelier bloquée s'il est lié à un stage actif,
suppression d'une catégorie bloquée si des ateliers lui sont associés). La qualité du code
est assurée par des tests automatisés : scénarios de bout en bout Playwright et tests
fonctionnels API via Postman/Newman.

---

## 2. Préambule

### 2.1 Introduction

Le projet « CA TIC WorkXP Admin » est un travail de CFC réalisé dans le cadre de la
formation d'informaticien d'entreprise à la Haute école d'ingénierie et d'architecture de
Fribourg (HEIA-FR). Il vise à développer une application web permettant au Centre
d'Apprentissage TIC (CA TIC) de centraliser la gestion des stages de découverte de
l'informatique destinés aux jeunes du cycle d'orientation (CO).

Ce document propose un suivi détaillé de l'analyse, de la conception et de la réalisation
du projet.

### 2.2 Organisation

**Candidat :** Luka Pellegrinelli, HEIA-FR
**Chef de projet :** Joël Dacomo, HEIA-FR
**Expert principal :** > ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Prénom Nom, Organisation
**Expert secondaire :** > ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Prénom Nom, Organisation

### 2.3 Environnement de travail

#### Matériel

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Liste du/des machine(s) utilisée(s)
> Exemple : MacBook Pro 16-inch 2023, macOS Sequoia 15.x

#### Logiciels et systèmes

Les logiciels et outils suivants sont utilisés :

- Visual Studio Code
- Git 2.x
- GitLab HEIA-FR
- Docker Desktop
- Node.js v20+
- Postman
- Pencil (outil de design, fichier WorkXPAdmin.pen)
- Claude Code (assistant IA — voir section 2.5)
- Suite Microsoft Office M365

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Ajuster les versions exactes et ajouter tout outil manquant

#### Accès

Les accès suivants sont accordés :

- Réseau de la HEIA-FR
- GitLab de la HEIA-FR (dépôt du projet)

### 2.4 Déroulement du projet

#### Méthode de travail

Pour ce projet, une version adaptée de la méthode waterfall (méthode en cascade) a été
choisie. Cette approche progresse de manière linéaire en suivant les étapes d'analyse,
de conception, de réalisation, puis de tests.

L'adaptation principale consiste à effectuer des tests à la fin de chaque fonctionnalité
développée, plutôt qu'une phase unique de tests en fin de projet. Cette organisation
permet de s'assurer que chaque composant est pleinement opérationnel avant de passer
au suivant, améliorant ainsi la qualité et la stabilité du système tout au long du cycle
de développement.

#### Sauvegarde des données

Les documents produits au cours du projet sont versionnés quotidiennement via Git et
déposés sur le GitLab de la HEIA-FR. Le code source bénéficie ainsi d'un historique
complet et d'une sauvegarde centralisée conforme à la politique de l'établissement.

#### Journal de bord

Un journal de bord détaillé est maintenu afin de suivre jour après jour l'avancement du
projet, les difficultés rencontrées et les résultats obtenus. Il couvre l'intégralité de la
durée du TPI et figure en annexe de ce document.

#### Glossaire

Un lexique figure en annexe de ce rapport ; il fournit les définitions des termes
techniques et des acronymes employés.

#### Planification

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Insérer ici le diagramme de Gantt (planification
> initiale + planification courante superposées). Outil recommandé : Excel ou Google Sheets.
> Granularité : demi-journées. Phases : Administratif, Analyse, Conception, Réalisation,
> Tests, Documentation.

### 2.5 Déclarations

#### Connaissances préalables

Le candidat possède les compétences techniques suivantes :

- Node.js
- Vue.js
- Express.js
- REST / RESTful
- MariaDB / SQL
- Git
- Docker

#### Travaux préparatoires

Les mockups de l'application ont été réalisés avant le démarrage du TPI à l'aide de
l'outil Pencil (fichier `WorkXPAdmin.pen`). Ce fichier a servi de référence visuelle
tout au long du développement.

#### Utilisation des modèles d'entreprise

Les modèles d'entreprise suivants sont utilisés :

- Documentation technique et journal de bord (modèle GED du CA TIC)
- Conventions de codage et de VCS : https://api-ti.pages.forge.hefr.ch

#### Intelligence artificielle

Dans ce projet, l'intelligence artificielle (Claude Code) est employée comme outil
d'assistance et non comme substitut aux compétences humaines. Elle est utilisée pour
aider à des tâches telles que la vérification des fautes d'orthographe, la suggestion
de corrections grammaticales, l'amélioration de la clarté des textes et des suggestions
de code. Il ne s'agit en aucun cas d'un remplacement des compétences du candidat.

---

## 3. Cahier des charges

Ce chapitre décrit la consigne du travail telle qu'elle a été communiquée au début du
projet dans le cahier des charges officiel.

### Donnée du problème

Le Centre d'Apprentissage TIC (CA TIC) de la HEIA-FR organise régulièrement des stages
de découverte du métier d'informaticien-ne CFC. Ces stages, d'une durée de 1 à 2 jours
en général, sont destinés aux jeunes du cycle d'orientation. Durant ces stages, les
participants réalisent divers ateliers afin de découvrir les multiples aspects de ce métier.

Actuellement, la liste des stagiaires ainsi que les travaux qu'ils ont réalisés sont notés
dans un document OneNote. L'inscription à ces stages se fait par email, par téléphone ou
directement via la plateforme FriStages (hors périmètre du projet).

Le but est de développer une application web permettant de répertorier de manière
centralisée les données de ces stages. Le système doit analyser les besoins et en tenir
compte afin de rendre le produit évolutif. L'application se limitera dans cette première
phase à gérer une liste de stagiaires, une liste d'ateliers et l'établissement des
certificats de stage.

**Technologies imposées :** VueJS, ExpressJS et MariaDB.

### Description et objectifs du projet

L'application web d'administration des stages découverte de l'informatique au CA TIC
devra offrir les fonctionnalités suivantes :

- **Gestion des stagiaires** : interfaces permettant d'ajouter un stagiaire avec ses données
  personnelles ainsi que les dates du stage. Un même stagiaire peut réaliser plusieurs
  stages à différentes périodes. Modification de l'ensemble des informations. Suppression
  d'un stagiaire. Liste permettant d'identifier clairement les stages terminés, en cours
  et à venir.

- **Gestion des ateliers** : interfaces permettant d'ajouter un atelier composé d'un nom,
  d'une description, d'une ou plusieurs catégories et facultativement d'un document PDF.
  Modification et suppression des ateliers (seuls les ateliers sans stagiaires peuvent être
  supprimés).

- **Gestion des catégories** : interfaces permettant d'ajouter, de modifier et de supprimer
  des catégories. Seules les catégories sans ateliers peuvent être supprimées.

- **Génération du certificat** : fonctionnalité permettant de générer et d'imprimer le
  certificat de stage. Le candidat fait une proposition de format et de contenu selon son
  analyse des besoins.

- **Association ateliers ↔ stages** : il doit être facile et pratique de définir et
  visualiser quels ateliers ont été réalisés par chaque stagiaire.

Les données seront stockées dans une base de données MariaDB. Un concept de tests
automatisés du backend devra être mis en place afin de garantir la non-régression de
l'application.

### Exigences fonctionnelles

| Exigence fonctionnelle | Description | Priorité | Temps estimé |
|---|---|---|---|
| Gestion des stagiaires | Analyse, conception, implémentation, documentation et tests de fonctionnement | Haute | 2 jours |
| Gestion des ateliers | Analyse, conception, implémentation, documentation et tests de fonctionnement | Haute | 2 jours |
| Gestion des catégories | Analyse, conception, implémentation, documentation et tests de fonctionnement | Moyenne | 1 jour |
| Génération du certificat | Analyse, conception, implémentation, documentation et tests de fonctionnement | Basse | 1 jour |
| Association des ateliers et stagiaires | Analyse, conception, implémentation, documentation et tests de fonctionnement | Haute | 1.5 jour |
| Automatisation des tests | Automatiser les tests de fonctionnement de l'application | Moyenne | 1.5 jour |
| Gestion de projet | Planification, journal de travail, réunions avec les experts, finalisation et envoi des documents sur PkOrg, etc. | Haute | 1 jour |

### Infrastructure nécessaire

Pour la réalisation du projet, l'apprenti-e dispose de l'infrastructure suivante :

- 1 laptop (réalisation et déploiement du code en local)
- Tous logiciels nécessaires pour la réalisation de ce projet
- Accès au code de la partie existante du projet
- GitLab de la HEFR

### Délais

Le projet y compris la remise du projet aux experts se terminera le **2 juin 2026 à 17
heures**. Le dernier délai pour la présentation du projet est fixé au **17 juin 2026 à
12h00**.

## 4. Analyse

### 4.1 État initial

Le Centre d'Apprentissage TIC (CA TIC) de la HEIA-FR organise des stages de découverte
de l'informatique pour les jeunes du cycle d'orientation (CO). Ces stages d'une durée de 1
à 2 jours accueillent des groupes d'élèves qui réalisent divers ateliers pratiques.

Jusqu'alors, le suivi administratif de ces stages était assuré manuellement via Microsoft
OneNote. Pour chaque période de stage, une note recensait la liste des participants ainsi
que les ateliers qu'ils avaient choisi de réaliser. Ce système présentait plusieurs
limitations :

- Aucune centralisation structurée : les données étaient réparties dans de multiples notes
  sans lien entre elles
- Pas de vue d'ensemble sur l'historique des stages par personne
- Identification du statut des stages (passé, en cours, à venir) laborieuse
- Génération du certificat de stage entièrement manuelle
- Risque d'erreurs humaines et de pertes de données

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Insérer ici la capture d'écran OneNote fournie
> dans le CdC pour illustrer l'état initial.

*Figure 1 — Extrait de l'outil OneNote actuel utilisé par le CA TIC (source : CdC)*

### 4.2 État désiré

Pour répondre à ces problématiques, le CA TIC souhaite disposer d'une application web
d'administration permettant de centraliser toutes les données relatives aux stages. Cette
application doit être utilisable par l'équipe du CA TIC sans formation préalable.

L'état désiré se compose des éléments suivants :

**Gestion des stagiaires :**
Une interface affiche l'ensemble des stages sous forme de cartes avec un indicateur
visuel de statut calculé automatiquement (À venir / En cours / Terminé). L'administrateur
peut créer, modifier et supprimer des stagiaires. Une même personne peut effectuer
plusieurs stages à des périodes distinctes.

**Gestion du catalogue des ateliers :**
Un catalogue centralisé répertorie tous les ateliers disponibles. Chaque atelier possède
un titre, une description optionnelle, des catégories associées et un document annexe
facultatif (documentation de l'atelier). Les ateliers liés à des stages actifs ne peuvent
pas être supprimés.

**Gestion des catégories :**
Les ateliers sont classifiés par catégories (ex : Programmation, Web, Systèmes). Les
catégories sans ateliers peuvent être supprimées.

**Association ateliers ↔ stages :**
Depuis la fiche d'un stagiaire, l'administrateur peut consulter et modifier la liste des
ateliers réalisés durant son stage.

**Génération du certificat :**
Un bouton sur chaque carte de stage permet de générer et prévisualiser le certificat PDF
correspondant. Le template est personnalisable par l'administrateur via la page Paramètres.

*Figure 2 — Schéma de principe de fonctionnement*

```
[Administrateur CA TIC] → [Interface Vue.js] → [API Express.js] → [MariaDB]
                                                      ↓
                                              [Fichiers uploads]
                                         (documents ateliers + template certificat)
```

### 4.3 Public cible

L'application est destinée exclusivement à l'équipe du Centre d'Apprentissage TIC (CA
TIC) de la HEIA-FR. Il s'agit d'une interface d'administration interne, sans accès public.

Les utilisateurs sont les formateurs professionnels et les responsables administratifs du
CA TIC. L'application doit être suffisamment intuitive pour être utilisée sans formation
préalable ni documentation spécifique.

### 4.4 Besoins

#### 4.4.1 Cas d'utilisation

Un diagramme de cas d'utilisation représente le comportement fonctionnel du système
du point de vue de l'utilisateur.

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Insérer ici le diagramme UML de cas
> d'utilisation. À créer avec Draw.io ou PlantUML. L'acteur unique est
> « Administrateur CA TIC ». Les cas d'utilisation principaux sont :
> - Gérer les stagiaires (créer, modifier, supprimer, consulter)
> - Gérer les ateliers (créer, modifier, supprimer, upload document)
> - Gérer les catégories (créer, modifier, supprimer)
> - Associer des ateliers à un stage
> - Générer le certificat PDF d'un stage

*Figure 3 — Diagramme de cas d'utilisation*

**Explications :**

L'administrateur CA TIC est le seul acteur du système. Il dispose d'un accès complet
à toutes les fonctionnalités. La base de données est un acteur secondaire qui répond
aux requêtes du backend.

#### 4.4.2 Description

Les besoins de l'administrateur proviennent du cahier des charges.

**Ajouter un stagiaire**

| | |
|---|---|
| **Quoi** | Créer une fiche de stage avec les informations personnelles (prénom, nom, email) et les dates de stage |
| **Pourquoi** | Enregistrer un nouveau stage dans le système |
| **Comment** | Formulaire modal accessible depuis la page des stages |
| **Contrainte** | La date de fin doit être postérieure ou égale à la date de début |

**Modifier un stagiaire**

| | |
|---|---|
| **Quoi** | Mettre à jour les informations d'un stage existant |
| **Pourquoi** | Corriger une erreur ou mettre à jour les données d'un stagiaire |
| **Comment** | Bouton d'édition sur la carte du stage, ouvre le même formulaire modal pré-rempli |

**Supprimer un stagiaire**

| | |
|---|---|
| **Quoi** | Supprimer définitivement un stage et ses associations avec les ateliers |
| **Pourquoi** | Retirer un stage obsolète ou erroné |
| **Comment** | Bouton de suppression avec dialog de confirmation |
| **Remarque** | La suppression d'un stage supprime en cascade ses associations dans `internship_activity` |

**Consulter la liste des stages**

| | |
|---|---|
| **Quoi** | Afficher la liste de tous les stages sous forme de cartes avec statut visuel |
| **Pourquoi** | Permettre à l'administrateur d'avoir une vue d'ensemble des stages |
| **Comment** | Page principale `/internships` avec cartes desktop et mobile |
| **Remarque** | Le statut (À venir / En cours / Terminé) est calculé côté frontend à partir des dates |

**Ajouter un atelier**

| | |
|---|---|
| **Quoi** | Créer un atelier avec titre, description optionnelle et catégories |
| **Pourquoi** | Enrichir le catalogue des ateliers disponibles |
| **Comment** | Formulaire modal accessible depuis la page des ateliers |
| **Contrainte** | Le titre est obligatoire (max 255 caractères) |

**Modifier un atelier**

| | |
|---|---|
| **Quoi** | Mettre à jour le titre, la description, les catégories ou le document d'un atelier |
| **Pourquoi** | Maintenir le catalogue à jour |
| **Comment** | Carte dépliable : édition inline des catégories, zone document toujours visible |

**Supprimer un atelier**

| | |
|---|---|
| **Quoi** | Supprimer un atelier du catalogue (soft delete : `visible = 0`) |
| **Pourquoi** | Retirer un atelier obsolète |
| **Comment** | Bouton de suppression sur la carte |
| **Contrainte** | Impossible si l'atelier est lié à au moins un stage (HTTP 409 retourné) |
| **Remarque** | La suppression est un soft delete pour préserver l'intégrité référentielle |

**Uploader un document sur un atelier**

| | |
|---|---|
| **Quoi** | Attacher un fichier de documentation à un atelier |
| **Pourquoi** | Fournir aux stagiaires la documentation associée à l'atelier |
| **Comment** | Zone drag & drop dans la section « Documentation » de la carte dépliée |
| **Contrainte** | Formats acceptés : PDF, DOCX, ODT, PPTX, TXT, XLSX, ODS. Taille max : 10 MB |

**Ajouter une catégorie**

| | |
|---|---|
| **Quoi** | Créer une nouvelle catégorie pour classifier les ateliers |
| **Pourquoi** | Organiser le catalogue par domaine (Programmation, Web, Systèmes, etc.) |
| **Comment** | Bouton « Nouvelle catégorie » sur la page `/categories` |

**Supprimer une catégorie**

| | |
|---|---|
| **Quoi** | Supprimer une catégorie du système |
| **Pourquoi** | Retirer une catégorie inutilisée |
| **Comment** | Bouton de suppression sur la carte de la catégorie |
| **Contrainte** | Impossible si la catégorie est liée à au moins un atelier (contrainte FK RESTRICT) |

**Associer des ateliers à un stage**

| | |
|---|---|
| **Quoi** | Lier un ou plusieurs ateliers à un stage spécifique |
| **Pourquoi** | Enregistrer les ateliers réalisés par un stagiaire durant son stage |
| **Comment** | Popover « Ajouter un atelier » accessible depuis la carte dépliée du stage |

**Générer le certificat PDF d'un stage**

| | |
|---|---|
| **Quoi** | Produire un certificat PDF personnalisé pour un stage |
| **Pourquoi** | Attester officiellement les ateliers réalisés durant le stage |
| **Comment** | Bouton « Aperçu du certificat » sur la carte du stage → page de prévisualisation |
| **Contrainte** | Requiert qu'un template DOCX soit uploadé dans la page Paramètres |

**Synthèse**

| Besoin | Administrateur CA TIC |
|---|---|
| Gérer les stagiaires (CRUD) | X |
| Consulter les statuts de stage | X |
| Gérer les ateliers (CRUD + document) | X |
| Gérer les catégories (CRUD) | X |
| Associer ateliers ↔ stages | X |
| Générer le certificat PDF | X |
| Configurer le template certificat | X |

### 4.5 Fonctionnement

Cette section analyse les différentes variantes envisagées pour répondre aux besoins,
en justifiant les choix retenus.

#### 4.5.1 Architecture de l'application

Plusieurs architectures sont envisageables pour structurer une application web. Voici les
variantes étudiées :

| Variante | Description | Avantages | Inconvénients |
|---|---|---|---|
| **Monolithique** | Frontend et backend dans un seul projet Node.js avec rendu serveur (SSR) | Simple à déployer, un seul processus | Couplage fort, difficile à faire évoluer, technologies imposées mal adaptées |
| **Architecture 3-tiers séparée** | Frontend SPA Vue.js indépendant + API REST Express.js + MariaDB | Séparation des responsabilités, indépendance de déploiement, technologies imposées parfaitement adaptées | Légèrement plus complexe à configurer |

**Barème des critères de comparaison**

| Critère | 1 : Bas | 2 : Moyen | 3 : Haut |
|---|---|---|---|
| Adéquation aux technologies imposées | Mal adaptée | Partiellement | Parfaitement adaptée |
| Maintenabilité | Difficile | Moyenne | Bonne séparation |
| Complexité de mise en place | Très complexe | Moyenne | Simple |

**Matrice de comparaison**

| Architecture | Adéquation | Maintenabilité | Complexité | Note* |
|---|---|---|---|---|
| Monolithique | 1 | 1 | 3 | 1.6 |
| **3-tiers séparée** | **3** | **3** | **2** | **2.7** |

*Pondération : Adéquation 40%, Maintenabilité 40%, Complexité 20%*

**Conclusion :** L'architecture 3-tiers séparée est retenue. Elle correspond exactement
aux technologies imposées (Vue.js frontend, Express.js backend, MariaDB base de données)
et offre une séparation claire des responsabilités facilitant la maintenance et les
évolutions futures.

#### 4.5.2 Stockage des documents d'ateliers

Chaque atelier peut avoir un document annexe attaché (PDF, DOCX, etc.).

| Variante | Description | Avantages | Inconvénients |
|---|---|---|---|
| **Stockage en base de données (BLOB)** | Le fichier est encodé et stocké directement dans MariaDB | Pas de gestion filesystem | Performances dégradées, taille DB importante, MariaDB mal adapté |
| **Filesystem + référence en DB** | Le fichier est stocké sur le serveur, son chemin est enregistré en DB | Performances optimales, gestion Docker volume simple, standard industriel | Gestion de la cohérence fichier/DB |

**Conclusion :** Le stockage sur filesystem avec référence en base de données est retenu.
Les fichiers sont nommés `<uuid>-<nom-sanitisé>.<ext>` pour éviter les collisions et les
path traversal attacks. Un volume Docker nommé `uploads_data` assure la persistance
entre les redémarrages.

#### 4.5.3 Format du certificat de stage

Le CdC demande au candidat de proposer un format pour le certificat.

| Variante | Description | Avantages | Inconvénients |
|---|---|---|---|
| **HTML → PDF (Puppeteer)** | Génération d'une page HTML puis conversion en PDF via un navigateur headless | Contrôle précis de la mise en page | Dépendance Chromium (~300 MB), template modifiable uniquement par développeur |
| **DOCX template → PDF (carbone.js)** | Template Word avec balises `{variable}`, injection des données par carbone.js, conversion PDF via LibreOffice | Template modifiable par l'admin dans Word sans toucher au code, standard documentaire | LibreOffice requis dans le conteneur (+300 MB) |

**Conclusion :** La solution carbone.js est retenue. Elle permet à l'administrateur du CA
TIC de personnaliser le certificat (logo, textes, mise en page) directement dans Microsoft
Word, sans intervention du développeur. Un template de démonstration est livré avec
le projet.

### 4.6 Technologies utilisées

Le tableau ci-dessous recense les technologies du projet avec la justification de leur
pertinence.

| Technologie | Rôle | Justification |
|---|---|---|
| **Vue.js 3** (Composition API) | Framework frontend SPA | Réactivité fine, Composition API modulaire, HMR rapide via Vite. Technologie imposée par le CdC, maîtrisée par le candidat. |
| **Vite** | Bundler et serveur de développement | Démarrage instantané, Hot Module Replacement ultra-rapide, configuration minimale. |
| **Express.js** | Framework API REST backend | Minimaliste et flexible, excellent écosystème npm, structure MVC simple. Technologie imposée par le CdC. |
| **MariaDB** | Base de données relationnelle | Données structurées avec relations N:M, contraintes d'intégrité référentielle (FK RESTRICT/CASCADE). Technologie imposée par le CdC. |
| **Docker + Docker Compose** | Conteneurisation | Environnement reproductible sur n'importe quelle machine, isolation des services, volumes persistants pour les fichiers uploadés. |
| **Tailwind CSS** | Framework CSS utilitaire | Cohérence visuelle sans CSS custom à maintenir, classes utilitaires directement dans les templates Vue. |
| **Biome** | Linter et formatter | Outil tout-en-un remplaçant ESLint + Prettier, ultra-rapide, tri automatique des imports. |
| **Playwright** | Tests de bout en bout (E2E) | Simulation d'un vrai navigateur, scénarios utilisateurs complets, support multi-navigateurs. |
| **Postman / Newman** | Tests fonctionnels API | Validation du contrat d'interface de l'API REST, exécution en ligne de commande via Newman. |
| **carbone.js** | Templating et génération PDF | Injection de données dans un template DOCX Word, conversion en PDF via LibreOffice. Zéro service externe. |
| **multer** | Upload de fichiers | Middleware Express standard pour la gestion des fichiers multipart/form-data. |
| **Lucide Vue** | Bibliothèque d'icônes | Icônes SVG légères et cohérentes avec le design. |

---

## 5. Conception

### 5.1 Schéma d'architecture

L'application suit une architecture trois tiers conteneurisée via Docker Compose.

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Insérer ici le diagramme d'architecture.
> À créer avec Draw.io. Contenu : 3 boîtes (Frontend Vue.js :8081, Backend Express :3000,
> MariaDB :3306) + volume uploads_data + flèches HTTP/SQL étiquetées.

*Figure 4 — Schéma d'architecture 3-tiers*

**Description des composants :**

| Composant | Technologie | Port | Rôle |
|---|---|---|---|
| Frontend | Vue.js 3 + Vite | 8081 | Interface SPA, rendu côté client, appels API via Axios |
| Backend | Node.js + Express.js | 3000 | API REST, logique métier, accès DB, gestion fichiers |
| Base de données | MariaDB | 3306 | Stockage persistant des données relationnelles |
| Volume `uploads_data` | Docker volume | — | Persistance des fichiers uploadés (documents + template certificat) |

Le navigateur charge l'application Vue.js qui communique exclusivement avec le backend
via des requêtes HTTP/JSON (API REST). Le backend accède à MariaDB via un pool de
connexions et au filesystem via le volume Docker monté sur `/app/uploads`.

### 5.2 Diagrammes de séquences

Les diagrammes de séquences illustrent les flux d'interactions entre les composants pour
les opérations principales.

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Créer les diagrammes avec PlantUML ou
> SequenceDiagram.org. Insérer les images ci-dessous.

**Séquence 1 — Création d'un stagiaire**

Acteurs : Administrateur, Vue.js, Express API, MariaDB

1. Administrateur remplit le formulaire et clique « Enregistrer »
2. Vue.js → `POST /api/internships` avec `{ firstName, lastName, email, startDate, endDate }`
3. Express valide les données (dates cohérentes, champs obligatoires)
4. Express → MariaDB : `INSERT INTO person` puis `INSERT INTO internship`
5. MariaDB → Express : `{ insertId: N }`
6. Express → Vue.js : `201 Created { id, firstName, lastName, ... }`
7. Vue.js recharge la liste et ferme le formulaire

*Figure 5 — Diagramme de séquence : création d'un stagiaire*

**Séquence 2 — Upload d'un document sur un atelier**

1. Administrateur glisse un fichier dans la zone upload
2. Vue.js → `POST /api/activities/:id/document` (multipart/form-data)
3. Express/multer valide le type MIME et la taille (max 10 MB)
4. multer stocke le fichier dans `/app/uploads/activities/<uuid>-<nom>.<ext>`
5. Express → MariaDB : `UPDATE activity SET document_url = ?`
6. Express → Vue.js : `200 OK { documentUrl: "..." }`
7. Vue.js met à jour la zone document de la carte

*Figure 6 — Diagramme de séquence : upload d'un document*

**Séquence 3 — Génération du certificat PDF**

1. Administrateur clique « Aperçu du certificat » sur une carte de stage
2. Vue.js navigue vers `/certificate/:id`
3. `CertificateView.vue` → `GET /api/internships/:id/certificate`
4. Express récupère les données du stage et les ateliers associés depuis MariaDB
5. Express lit le template `/app/uploads/certificate/template.docx`
6. carbone.js injecte les données dans le template DOCX
7. LibreOffice convertit le DOCX en PDF
8. Express → Vue.js : stream binaire PDF (Content-Type: application/pdf)
9. Vue.js crée un Blob URL et l'affiche dans un `<iframe>`

*Figure 7 — Diagramme de séquence : génération du certificat PDF*

### 5.3 Base de données

La base de données relationnelle MariaDB contient 5 tables liées par des contraintes
d'intégrité référentielle.

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Insérer ici le schéma MCD/MLD. À créer avec
> DbDiagram.io ou Draw.io.

*Figure 8 — Modèle relationnel de la base de données*

#### Table `person`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique |
| `first_name` | VARCHAR(80) | NOT NULL | Prénom du stagiaire |
| `last_name` | VARCHAR(80) | NOT NULL | Nom du stagiaire |
| `email` | VARCHAR(254) | NOT NULL | Email de contact |

#### Table `internship`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique |
| `person_id` | INT | FK → person(id) CASCADE | Référence à la personne |
| `start_date` | DATE | NOT NULL | Date de début du stage |
| `end_date` | DATE | NOT NULL, CHECK ≥ start_date | Date de fin du stage |

La suppression d'une personne supprime en cascade tous ses stages (`ON DELETE CASCADE`).
Le statut du stage (À venir / En cours / Terminé) est calculé côté frontend à partir des
dates, sans être stocké en base.

#### Table `activity`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique |
| `title` | VARCHAR(255) | NOT NULL | Titre de l'atelier |
| `description` | TEXT | NULL | Description détaillée |
| `document_url` | VARCHAR(500) | NULL | Chemin vers le fichier document |
| `visible` | BOOLEAN | DEFAULT true | Soft delete : false = supprimé |

#### Table `category`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(100) | NOT NULL | Nom de la catégorie |
| `description` | TEXT | NULL | Description optionnelle |

#### Table `internship_activity` (jonction N:M)

| Colonne | Type | Contrainte |
|---|---|---|
| `internship_id` | INT | FK → internship(id) CASCADE DELETE |
| `activity_id` | INT | FK → activity(id) RESTRICT DELETE |

La contrainte RESTRICT sur `activity_id` empêche la suppression d'un atelier lié à
au moins un stage. Cette règle est également enforced au niveau applicatif
(service `deleteActivity` vérifie `internshipCount > 0` → erreur `HAS_LINKED_INTERNSHIPS`).

**Note sur le soft delete :** La suppression d'un atelier est implémentée comme un soft
delete (`UPDATE activity SET visible = 0`) et non un `DELETE`. Cela évite de déclencher
la contrainte `ON DELETE RESTRICT` tout en préservant les associations historiques.
La vérification métier se fait donc au niveau applicatif avant l'opération.

#### Table `activity_category` (jonction N:M)

| Colonne | Type | Contrainte |
|---|---|---|
| `activity_id` | INT | FK → activity(id) CASCADE DELETE |
| `category_id` | INT | FK → category(id) RESTRICT DELETE |

La contrainte RESTRICT sur `category_id` empêche la suppression d'une catégorie liée
à des ateliers.

### 5.4 Mockups

Le design de l'application a été conçu en amont du développement à l'aide de l'outil
Pencil (fichier `WorkXPAdmin.pen`). Ce fichier a servi de référence visuelle tout au
long du développement pour garantir la cohérence de l'interface.

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Insérer des captures d'écran des mockups Pencil
> pour les écrans principaux : liste des stages, liste des ateliers (repliée et dépliée),
> page catégories, page paramètres, page certificat.

*Figure 9 — Mockup : liste des stages*

*Figure 10 — Mockup : liste des ateliers (carte dépliée)*

*Figure 11 — Mockup : page catégories*

*Figure 12 — Mockup : page paramètres*

### 5.5 Stratégie de tests

Deux types de tests automatisés sont mis en place pour garantir la non-régression de
l'application.

#### Tests de bout en bout — Playwright E2E

Playwright simule un vrai navigateur (Chromium) et exécute des scénarios utilisateurs
complets sur l'application en cours d'exécution. La base de données est réinitialisée
avant chaque exécution via le script `tests/setup/restore_db.sql`.

| Scénario | Fichier | Ce qui est testé |
|---|---|---|
| Navigation | `sc01-navigation.spec.ts` | Accès aux pages principales, sidebar |
| Création stage | `sc03-internship-creation.spec.ts` | Formulaire de création, validation |
| Validation stage | `sc04-internship-validation.spec.ts` | Erreurs de saisie, cohérence dates |
| Modification stage | `sc05-internship-modification.spec.ts` | Édition, persistance des données |
| Suppression stage | `sc06-internship-deletion.spec.ts` | Confirmation, disparition de la liste |
| CRUD atelier | `sc07-activity-crud.spec.ts` | Création, modification, suppression |
| Association ateliers | `sc08-internship-association.spec.ts` | Ajout d'un atelier à un stage |
| Dissociation ateliers | `sc09-internship-dissociation.spec.ts` | Retrait d'un atelier |
| Ateliers enrichis | `sc-activity-enriched.spec.ts` | Description, catégories, suppression bloquée |
| Badges de statut | `sc-status-badges.spec.ts` | À venir / En cours / Terminé |
| CRUD catégories | `sc-category-crud.spec.ts` | Création, modification, contrainte suppression |
| Certificat | `sc-certificate-download.spec.ts` | Navigation vers la page de prévisualisation |

#### Tests fonctionnels API — Postman / Newman

La collection Postman (`tests/api/test_internship_management.postman_collection.json`)
valide le contrat d'interface de l'API REST. Elle est exécutable en ligne de commande
via Newman.

Les tests couvrent :
- CRUD complet sur `/api/internships`, `/api/activities`, `/api/categories`
- Contraintes métier : suppression bloquée (HTTP 409), validation des champs (HTTP 422)
- Endpoints document : upload, téléchargement, suppression
- Endpoint certificat : génération PDF

**Exécution des tests :**

```bash
# Tests E2E Playwright
npm run test:e2e

# Tests fonctionnels API Postman/Newman
npm run test:api
```

---

## 6. Réalisation

### 6.1 Structure du projet

Le projet est organisé sous forme de monorepo géré par NPM Workspaces. Cela permet de
centraliser toutes les dépendances et d'orchestrer les scripts depuis la racine.

```
Test-internship-management/
├── frontend/               # Application Vue.js 3
│   ├── src/
│   │   ├── views/          # Pages principales (InternshipDashboard, ActivityList, ...)
│   │   ├── components/     # Composants réutilisables (AppButton, AppCard, ...)
│   │   ├── services/       # Appels API (internshipService, activityService, ...)
│   │   └── router.js       # Vue Router (routes SPA)
│   └── vite.config.js
├── backend/                # API REST Express.js
│   ├── server.js           # Point d'entrée
│   ├── routes/             # Routeurs Express par entité
│   ├── controllers/        # Logique décisionnelle (validation + appel service)
│   ├── services/           # Logique métier (règles CdC)
│   ├── models/             # Accès base de données (requêtes SQL)
│   ├── middleware/         # Upload multer
│   └── uploads/            # Fichiers uploadés (monté comme volume Docker)
├── database/               # Schémas et migrations SQL
├── tests/
│   ├── e2e/                # Tests Playwright
│   └── api/                # Collection Postman + environnement
├── docker/                 # Dockerfiles + docker-compose.yml
├── docs/                   # Documentation technique
├── biome.json              # Configuration linter/formatter
└── package.json            # Scripts globaux + workspaces
```

Le backend suit le pattern **Routes → Controller → Service → Model** :
- **Route** : définit l'URL et le verbe HTTP
- **Controller** : valide les entrées HTTP, appelle le service, construit la réponse
- **Service** : applique la logique métier (règles CdC, erreurs nommées)
- **Model** : exécute les requêtes SQL sur MariaDB

### 6.2 Linter et code formatter

**Biome** est utilisé comme outil tout-en-un de linting et de formatage du code. Il
remplace à la fois ESLint et Prettier avec une configuration unique et des performances
supérieures.

La configuration est définie dans `biome.json` à la racine du projet. Les règles actives
incluent notamment le tri automatique des imports (`organizeImports: "on"`), la détection
des variables inutilisées, et le formatage cohérent (indentation 2 espaces, guillemets
simples).

**Exécution :**

```bash
npm run format   # Formate et corrige automatiquement
npm run lint     # Vérification seule, sans modification
```

Biome est exécuté avant chaque commit pour garantir la cohérence du style de code dans
tout le projet, conformément aux conventions de codage du CA TIC.

### 6.3 Design et interface

L'interface utilisateur est développée avec **Tailwind CSS**, un framework CSS utilitaire
qui permet de construire des designs cohérents sans écrire de CSS custom. Les classes
utilitaires sont appliquées directement dans les templates Vue.

Le design visuel est calqué sur le fichier `WorkXPAdmin.pen` (Pencil), utilisé comme
référence tout au long du développement. Les principales décisions de design sont :

- **Palette de couleurs** : bleu primaire (`blue-600`), fond clair (`gray-50`), cartes
  blanches avec ombre légère (`shadow-sm`)
- **Badges de statut** : fond pastel + texte coloré + point indicateur
  - À venir : `bg-amber-100 text-amber-600`
  - En cours : `bg-green-100 text-green-600`
  - Terminé : `bg-blue-100 text-blue-600`
- **Cartes dépliables** : les cartes d'ateliers s'expandent au clic pour révéler la
  gestion des catégories et la zone document
- **Interface responsive** : grilles adaptatives (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

**Composants réutilisables** (`frontend/src/components/`) :
- `AppButton.vue` : bouton avec variantes (primary, danger, ghost)
- `AppCard.vue` : conteneur carte avec ombre
- `AppInput.vue` : champ de saisie avec label et message d'erreur
- `AppDialog.vue` : modal de confirmation

### 6.4 Gestion des stagiaires

La gestion des stagiaires est le module central de l'application. Elle est implémentée
via le composant `frontend/src/views/InternshipDashboard.vue` et les endpoints
`/api/internships`.

**Endpoints API :**

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/internships` | Liste tous les stages |
| POST | `/api/internships` | Crée un nouveau stage |
| GET | `/api/internships/:id` | Détails d'un stage |
| PUT | `/api/internships/:id` | Modifie un stage |
| DELETE | `/api/internships/:id` | Supprime un stage |
| GET | `/api/internships/:id/activities` | Ateliers liés au stage |
| POST | `/api/internships/:id/activities/:activityId` | Associe un atelier |
| DELETE | `/api/internships/:id/activities/:activityId` | Dissocie un atelier |
| GET | `/api/internships/:id/certificate` | Génère le certificat PDF |

**Calcul du statut (côté frontend) :**

Le statut est calculé en temps réel par une propriété `computed` Vue à partir des dates
du stage comparées à la date du jour :

```javascript
const status = computed(() => {
  const today = new Date();
  const start = new Date(props.internship.startDate);
  const end = new Date(props.internship.endDate);
  if (start > today) return 'upcoming';   // À venir
  if (end < today)   return 'done';       // Terminé
  return 'active';                         // En cours
});
```

Ce calcul ne nécessite aucun stockage en base de données ni appel API supplémentaire.

**Validation backend :**
- Prénom, nom, email obligatoires
- `start_date` et `end_date` obligatoires, cohérence vérifiée par contrainte SQL `CHECK`
- Email : format valide

### 6.5 Gestion des ateliers

Les ateliers sont gérés via `frontend/src/views/ActivityList.vue` et les endpoints
`/api/activities`.

**Endpoints API :**

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/activities` | Liste les IDs des ateliers visibles |
| GET | `/api/activities/:id` | Détails d'un atelier (avec catégories + internshipCount) |
| POST | `/api/activities` | Crée un atelier |
| PATCH | `/api/activities/:id` | Modifie partiellement un atelier |
| DELETE | `/api/activities/:id` | Soft delete (visible = 0) |
| POST | `/api/activities/:id/document` | Upload d'un document |
| GET | `/api/activities/:id/document` | Téléchargement du document |
| DELETE | `/api/activities/:id/document` | Suppression du document |

**Carte dépliable :**

Chaque atelier est affiché sous forme d'une carte. Un clic sur le header déplie la carte
pour révéler :
- La zone de gestion des catégories (badges + bouton « Ajouter une catégorie »)
- La zone documentation (état vide avec drag & drop ou état rempli avec le fichier)

**Contrainte de suppression (CdC §2.1) :**

La suppression d'un atelier est bloquée s'il est lié à au moins un stage. Cette règle
est appliquée à deux niveaux :

1. **Backend** (service) : `getById` retourne `internshipCount`. Si `internshipCount > 0`,
   le service lève `HAS_LINKED_INTERNSHIPS` → controller retourne HTTP 409.
2. **Frontend** : Le bouton supprimer est désactivé (`disabled`) avec
   `aria-label="Suppression impossible : atelier lié à des stages"`.

La suppression est implémentée comme un **soft delete** (`UPDATE activity SET visible = 0`)
pour éviter de déclencher la contrainte `ON DELETE RESTRICT` de la table
`internship_activity`, tout en préservant l'intégrité des données historiques.

**Upload de documents :**

multer valide le type MIME côté serveur (pas seulement l'extension) et la taille (max
10 MB). Le fichier est stocké dans `/app/uploads/activities/<uuid>-<nom-sanitisé>.<ext>`.

### 6.6 Gestion des catégories

Les catégories sont gérées via `frontend/src/views/CategoryList.vue` et les endpoints
`/api/categories`. Elles permettent de classifier les ateliers par domaine.

**Endpoints API :**

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Liste toutes les catégories avec leur nombre d'ateliers |
| POST | `/api/categories` | Crée une catégorie |
| PUT | `/api/categories/:id` | Modifie une catégorie |
| DELETE | `/api/categories/:id` | Supprime une catégorie |

**Interface :** Grille de cartes responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
avec icône Tag, nom, description optionnelle et compteur d'ateliers liés.

**Contrainte de suppression :** La contrainte FK `RESTRICT` sur `activity_category` empêche
la suppression d'une catégorie liée à des ateliers au niveau base de données. Le controller
intercepte l'erreur MariaDB (errno 1451) et retourne HTTP 409 avec un message explicite.
Le bouton de suppression est désactivé côté frontend si `activityCount > 0`.

### 6.7 Génération du certificat

La génération du certificat de stage en PDF est implémentée via **carbone.js** avec
un template DOCX personnalisable.

**Flux complet :**

1. L'administrateur uploade un template `.docx` via la page Paramètres
   (`POST /api/certificate/template`)
2. Le template est stocké dans `/app/uploads/certificate/template.docx`
3. Sur la carte d'un stage, le bouton « Aperçu du certificat » navigue vers
   `/certificate/:id`
4. `CertificateView.vue` appelle `GET /api/internships/:id/certificate`
5. Le backend récupère les données du stage et les ateliers associés depuis MariaDB
6. carbone.js injecte les données dans le template DOCX via les balises :

| Balise | Valeur injectée |
|---|---|
| `{prenom}` | Prénom du stagiaire |
| `{nom}` | Nom du stagiaire |
| `{email}` | Email du stagiaire |
| `{date_debut}` | Date de début formatée (DD.MM.YYYY) |
| `{date_fin}` | Date de fin formatée (DD.MM.YYYY) |
| `{#ateliers}` | Début de boucle sur les ateliers |
| `{titre}` | Titre de l'atelier (dans la boucle) |
| `{categories}` | Catégories de l'atelier (dans la boucle) |
| `{/ateliers}` | Fin de boucle |
| `{date_emission}` | Date d'émission automatique (aujourd'hui) |

7. LibreOffice (installé dans le conteneur Docker backend) convertit le DOCX en PDF
8. Le PDF est renvoyé au frontend comme flux binaire
9. Vue.js crée un `Blob URL` et l'affiche dans un `<iframe>` avec boutons
   « Imprimer » et « Télécharger PDF »

**Prérequis Docker :** LibreOffice est installé dans l'image backend Alpine
(`apk add --no-cache libreoffice`). Impact : +~300 MB sur l'image.

**Un template de démonstration** est livré avec le projet
(`backend/uploads/certificate/template.docx`) permettant de tester la fonctionnalité
sans configuration préalable.

### 6.8 Base de données

L'accès à MariaDB est géré via le driver officiel `mariadb` (Node.js) avec un **pool
de connexions** pour optimiser les performances.

**Pattern d'accès :** Chaque opération ouvre une connexion depuis le pool, exécute
la requête et libère la connexion dans un bloc `finally` :

```javascript
getById: async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM activity WHERE id = ?', [id]);
    // ...
    return result;
  } finally {
    if (conn) conn.end();
  }
}
```

**Soft delete :** La suppression des ateliers est implémentée comme un soft delete
(`UPDATE activity SET visible = 0`). Les ateliers soft-deleted n'apparaissent pas
dans le catalogue (`WHERE visible = 1`) mais leurs associations dans `internship_activity`
sont préservées pour maintenir l'intégrité des données historiques.

**Compteur d'associations :** Le modèle `Activity.getById()` retourne `internshipCount`
via une requête `COUNT(*)` parallèle, permettant au service d'appliquer la règle métier
de suppression sans requête supplémentaire.

### 6.9 Traitement des erreurs

Le traitement des erreurs suit une architecture en couches cohérente sur l'ensemble
du backend.

**Codes HTTP utilisés :**

| Code | Signification | Cas d'utilisation |
|---|---|---|
| 200 | OK | GET / PATCH / PUT réussi |
| 201 | Created | POST réussi (ressource créée) |
| 204 | No Content | DELETE réussi |
| 400 | Bad Request | Fichier invalide (type, taille) |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Suppression bloquée (HAS_LINKED_INTERNSHIPS, HAS_LINKED_ACTIVITIES) |
| 422 | Unprocessable Entity | Données invalides (MISSING_TITLE, TITLE_TOO_LONG, etc.) |
| 500 | Internal Server Error | Erreur serveur inattendue |

**Erreurs nommées (services) :** Les services lèvent des erreurs avec des codes
sémantiques (`throw new Error('NOT_FOUND')`) que les controllers interceptent pour
construire la réponse HTTP appropriée. Cela découple la logique métier du protocole HTTP.

**Validation frontend :** En complément de la validation backend, Vue.js valide les
formulaires côté client pour une meilleure expérience utilisateur (champs obligatoires,
format email, cohérence des dates).

---

## 7. Tests de fonctionnement

Le tableau ci-dessous constitue le protocole de test des fonctionnalités principales
de l'application. Les tests sont exécutés après restauration de la base de données
via `tests/setup/restore_db.sql`.

| N° | Scénario | Préconditions | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|---|
| T01 | Créer un stagiaire valide | App lancée, DB restaurée | Carte du stagiaire apparaît dans la liste, statut calculé correct | ⚠️ À compléter | — |
| T02 | Créer un stagiaire avec date de fin < début | App lancée | Message d'erreur, aucun enregistrement créé | ⚠️ À compléter | — |
| T03 | Modifier un stagiaire existant | Stagiaire T01 créé | Les nouvelles données sont affichées sur la carte | ⚠️ À compléter | — |
| T04 | Supprimer un stagiaire | Stagiaire sans ateliers | Carte disparaît de la liste | ⚠️ À compléter | — |
| T05 | Badge « À venir » affiché | Stage avec startDate future | Badge amber « À venir » visible | ⚠️ À compléter | — |
| T06 | Badge « Terminé » affiché | Stage avec endDate passée | Badge bleu « Terminé » visible | ⚠️ À compléter | — |
| T07 | Créer un atelier avec catégories | Catégories existantes | Carte atelier affiche les badges de catégories | ⚠️ À compléter | — |
| T08 | Supprimer atelier lié à un stage | Atelier associé à un stage | Bouton désactivé, message « Suppression impossible » | ⚠️ À compléter | — |
| T09 | Supprimer atelier sans stage | Atelier non associé | Atelier disparu du catalogue | ⚠️ À compléter | — |
| T10 | Upload document sur atelier | Atelier existant | Zone document affiche le fichier uploadé | ⚠️ À compléter | — |
| T11 | Upload fichier > 10 MB | — | Erreur HTTP 400, fichier rejeté | ⚠️ À compléter | — |
| T12 | Créer une catégorie | — | Catégorie apparaît dans la grille | ⚠️ À compléter | — |
| T13 | Supprimer catégorie liée à atelier | Catégorie avec ateliers | Bouton désactivé | ⚠️ À compléter | — |
| T14 | Associer un atelier à un stage | Stage + atelier existants | Atelier apparaît dans la liste du stage | ⚠️ À compléter | — |
| T15 | Générer le certificat PDF | Template uploadé, stage avec ateliers | PDF affiché dans l'iframe, données correctes | ⚠️ À compléter | — |
| T16 | Générer certificat sans template | Aucun template uploadé | Message d'erreur explicite | ⚠️ À compléter | — |

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Remplir les colonnes « Résultat obtenu » et
> « Statut » (✅ / ❌) après exécution des tests durant le TPI. Ajouter la signature
> du chef de projet.

---

## 8. Problèmes rencontrés

> ⚠️ **SECTION GUIDÉE — À RÉDIGER PAR LE CANDIDAT**
>
> Cette section documente les obstacles techniques rencontrés durant le développement
> et les solutions apportées. Elle est évaluée par les experts comme preuve de la
> capacité à résoudre des problèmes (critère 170 — Découverte de solutions).
>
> **Pistes à développer avec ton vécu :**
>
> **Problème 1 — Soft delete et contrainte FK**
> Contexte : La suppression d'un atelier via DELETE SQL déclenchait la contrainte
> ON DELETE RESTRICT de internship_activity, même si l'atelier n'était lié à aucun
> stage actif.
> Solution : Implémentation d'un soft delete (UPDATE SET visible = 0) couplé à un
> guard applicatif dans le service vérifiant internshipCount avant toute suppression.
>
> **Problème 2 — Réactivité Vue 3 avec Set**
> Contexte : La mutation d'un ref<Set> (ex: .add(), .delete()) ne déclenchait pas
> de re-render Vue car Vue ne détecte pas les mutations internes des objets natifs.
> Solution : Remplacement systématique de la référence au lieu de la muter
> (tempCategoryIds.value = new Set(modified)).
>
> **Problème 3 — Tests E2E sur éléments hover**
> Contexte : Les boutons d'action des cartes sont masqués par pointer-events: none
> en dehors du survol. Playwright ne pouvait pas les cliquer normalement.
> Solution : Utilisation de l'option { force: true } dans les appels .click() Playwright
> pour forcer le clic même sur des éléments techniquement non cliquables.
>
> **Ajouter ici les autres problèmes rencontrés** durant ton développement.

---

## 9. Amélioration et évolution

### Améliorations techniques identifiées

Plusieurs pistes d'amélioration technique ont été identifiées lors du développement
mais sortent du périmètre du TPI :

- **Authentification** : L'application est actuellement sans authentification (accès libre
  en réseau local). L'intégration de la CA TIC Authentication Gateway (Microsoft MFA),
  déjà utilisée dans d'autres projets CA TIC, constituerait la prochaine étape logique.

- **Optimisation des requêtes** : La page des ateliers effectue actuellement une requête
  `GET /api/activities/:id` pour chaque atelier affiché (pattern N+1). Un endpoint
  `GET /api/activities/details` retournant toutes les données enrichies en une seule
  requête améliorerait significativement les performances avec un grand catalogue.

- **Recherche et filtrage** : Filtres côté serveur sur les stagiaires (par statut, par
  période) et sur les ateliers (par catégorie, par titre) pour faciliter la navigation
  avec un grand volume de données.

### Évolutions fonctionnelles (CdC)

Le cahier des charges mentionne des évolutions futures envisagées :

- Intégration de la gestion des inscriptions via FriStages
- Planification des stages dans la même application
- Export des données pour la gestion des certifications

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT** : Ajouter tes propres idées d'amélioration
> issues de l'utilisation réelle de l'application.

---

## 10. Conclusion

> ⚠️ **SECTION GUIDÉE — À RÉDIGER PAR LE CANDIDAT**
>
> **Points à aborder :**
> - Rappeler les 5 exigences du CdC et confirmer leur implémentation
>   (Gestion stagiaires ✅, Gestion ateliers ✅, Gestion catégories ✅,
>   Génération certificat ✅, Association ateliers↔stages ✅)
> - Ce qui a bien fonctionné (ex : architecture claire, tests automatisés, Docker)
> - Ce qui aurait été fait différemment avec le recul
> - Bilan personnel : compétences acquises, apprentissages clés du TPI

---

## 11. Remerciements

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT**

---

## 12. Déclaration de non plagiat

Je soussigné, Luka Pellegrinelli, déclare que le présent rapport de travail pratique
individuel est le résultat de mon propre travail. Les sources et outils utilisés sont
clairement référencés dans ce document.

> ⚠️ **À SIGNER PAR LE CANDIDAT** — Date et lieu : _________________________, le _____ / _____ / 2026

---

## 13. Glossaire

| Terme | Définition |
|---|---|
| **API REST** | Interface de programmation applicative suivant le style architectural REST (Representational State Transfer), basée sur le protocole HTTP |
| **Biome** | Outil de linting et formatage de code JavaScript/TypeScript, remplaçant ESLint + Prettier |
| **BLOB** | Binary Large Object — données binaires (fichier, image) stockées directement en base de données |
| **carbone.js** | Bibliothèque Node.js de templating de documents (DOCX, ODT) avec injection de données |
| **CFC** | Certificat Fédéral de Capacité — diplôme suisse d'apprentissage professionnel |
| **CRUD** | Create, Read, Update, Delete — les 4 opérations de base sur les données |
| **Docker** | Plateforme de conteneurisation permettant d'exécuter des applications dans des environnements isolés |
| **E2E** | End-to-End (bout en bout) — tests simulant les actions réelles d'un utilisateur dans un vrai navigateur |
| **FK** | Foreign Key (clé étrangère) — contrainte d'intégrité référentielle entre tables SQL |
| **HMR** | Hot Module Replacement — mise à jour du code en temps réel sans rechargement complet de la page |
| **HTTP** | HyperText Transfer Protocol — protocole de communication client-serveur du web |
| **LibreOffice** | Suite bureautique libre utilisée ici pour convertir des fichiers DOCX en PDF |
| **MCD** | Modèle Conceptuel de Données — représentation graphique des entités et relations d'une base de données |
| **Monorepo** | Dépôt Git unique contenant plusieurs projets (frontend, backend, tests) |
| **multer** | Middleware Express.js pour la gestion des uploads de fichiers (multipart/form-data) |
| **Newman** | Outil CLI permettant d'exécuter des collections Postman en ligne de commande |
| **NPM Workspaces** | Fonctionnalité npm permettant de gérer plusieurs packages dans un même dépôt |
| **Playwright** | Framework de tests E2E permettant de simuler des actions navigateur |
| **Postman** | Outil de test et documentation d'APIs REST |
| **REST** | Representational State Transfer — style architectural pour les APIs web |
| **SPA** | Single Page Application — application web dont le contenu est chargé dynamiquement sans rechargement de page |
| **Soft delete** | Suppression logique : marquage d'un enregistrement comme supprimé sans le retirer physiquement de la base |
| **SQL** | Structured Query Language — langage de requête pour les bases de données relationnelles |
| **TPI** | Travail Pratique Individuel — examen pratique de fin d'apprentissage CFC |
| **VCS** | Version Control System — système de gestion de versions du code (ici : Git) |
| **Vue.js** | Framework JavaScript progressif pour la construction d'interfaces utilisateur |

---

## 14. Annexes

> ⚠️ **À COMPLÉTER PAR LE CANDIDAT**
>
> Contenu attendu :
> - Journal de bord complet (jour par jour)
> - Listings de code des composants principaux (si demandé par les experts)
> - Collection Postman exportée (JSON)

---

## 15. Table des illustrations

> ⚠️ **À GÉNÉRER AUTOMATIQUEMENT DANS WORD** : Références → Insérer une table des illustrations
>
> Figures à inclure :
> - Figure 1 — Extrait OneNote (section 4.1)
> - Figure 2 — Schéma de principe de fonctionnement (section 4.2)
> - Figure 3 — Diagramme de cas d'utilisation (section 4.4.1)
> - Figure 4 — Schéma d'architecture 3-tiers (section 5.1)
> - Figure 5 — Diagramme de séquence : création d'un stagiaire (section 5.2)
> - Figure 6 — Diagramme de séquence : upload d'un document (section 5.2)
> - Figure 7 — Diagramme de séquence : génération du certificat PDF (section 5.2)
> - Figure 8 — Modèle relationnel de la base de données (section 5.3)
> - Figure 9 — Mockup : liste des stages (section 5.4)
> - Figure 10 — Mockup : liste des ateliers (section 5.4)
> - Figure 11 — Mockup : page catégories (section 5.4)
> - Figure 12 — Mockup : page paramètres (section 5.4)
