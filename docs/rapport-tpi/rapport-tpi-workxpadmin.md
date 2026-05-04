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

### 5.2 Diagrammes de séquences

### 5.3 Base de données

### 5.4 Mockups

### 5.5 Stratégie de tests

---

## 6. Réalisation

### 6.1 Structure du projet

### 6.2 Linter et code formatter

### 6.3 Design et interface

### 6.4 Gestion des stagiaires

### 6.5 Gestion des ateliers

### 6.6 Gestion des catégories

### 6.7 Génération du certificat

### 6.8 Base de données

### 6.9 Traitement des erreurs

---

## 7. Tests de fonctionnement

---

## 8. Problèmes rencontrés

---

## 9. Amélioration et évolution

---

## 10. Conclusion

---

## 11. Remerciements

---

## 12. Déclaration de non plagiat

---

## 13. Glossaire

---

## 14. Annexes

---

## 15. Table des illustrations
