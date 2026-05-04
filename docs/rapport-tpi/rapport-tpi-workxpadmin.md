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

### 4.2 État désiré

### 4.3 Public cible

### 4.4 Besoins

#### 4.4.1 Cas d'utilisation

#### 4.4.2 Description

### 4.5 Fonctionnement

#### 4.5.1 Architecture de l'application

#### 4.5.2 Stockage des documents d'ateliers

#### 4.5.3 Format du certificat de stage

### 4.6 Technologies utilisées

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
