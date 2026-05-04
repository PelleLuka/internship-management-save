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

Actuellement, le suivi de ces stages est assuré via Microsoft OneNote : la liste des
stagiaires et les ateliers réalisés sont consignés manuellement dans des notes non
structurées. Ce fonctionnement ne permet pas de centraliser efficacement les données,
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
garanties côté serveur (suppression bloquée si des stages sont liés à un atelier, ou des
ateliers liés à une catégorie). La qualité du code est assurée par des tests automatisés :
scénarios de bout en bout Playwright et tests d'intégration API Postman/Newman.

---

## 2. Préambule

### 2.1 Introduction

### 2.2 Organisation

### 2.3 Environnement de travail

### 2.4 Déroulement du projet

### 2.5 Déclarations

---

## 3. Cahier des charges

---

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
