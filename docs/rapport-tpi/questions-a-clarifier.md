# Questions à clarifier — Cahier des charges TPI 2026

Scan du document officiel `TPI 2026 Pellegrinelli Luka (4).pdf` (9 pages,
signé Fribourg, 3 mars 2026). Les points ci-dessous sont des écarts,
ambiguïtés ou exigences potentiellement sous-couvertes par le projet
actuel. À valider avec **Joël Dacomo** (supérieur professionnel) ou les
experts.

---

## 1. Périmètre fonctionnel

### 1.1 Authentification / contrôle d'accès — non mentionné dans le CDC
Le cahier des charges ne parle **jamais** d'authentification, de rôles
ou de session. L'application actuelle est ouverte (aucun login).

**Questions :**
- L'application doit-elle être déployée publiquement, en intranet
  HEIA-FR uniquement, ou derrière un reverse proxy avec SSO ?
- Faut-il prévoir un login admin (au moins basique) ou est-ce
  explicitement hors périmètre pour cette phase ?
- Si pas d'auth : faut-il documenter ce choix dans le rapport comme
  contrainte (réseau interne) ou comme amélioration future ?

### 1.2 Suppression des ateliers — soft delete vs hard delete
Le CDC dit (§2.1, dernier point) :
> « Il en va de même pour les ateliers (seuls les ateliers sans
> stagiaires peuvent être supprimés). »

L'implémentation actuelle fait un **soft delete** (`UPDATE activity SET
visible = 0`) qui cache l'atelier du catalogue mais ne le supprime pas.
Un atelier lié reste protégé par la FK `internship_activity → activity
ON DELETE RESTRICT`.

**Questions :**
- Le soft delete est-il acceptable, ou la donnée doit-elle réellement
  être supprimée de la base lorsque l'atelier n'a aucun stagiaire ?
- Si soft delete OK : faut-il en plus exposer un bouton « supprimer
  définitivement » quand `internship_activity.count = 0` ?

### 1.3 Format et contenu du certificat
Le CDC dit (§2.1) :
> « Le candidat fera une proposition de formats et de contenu selon son
> analyse des besoins. »

Le template actuel (`backend/templates/template-certificat-stage.docx`)
contient : prénom, nom, email, dates, liste des ateliers, date
d'émission.

**Questions :**
- Cette proposition a-t-elle été validée formellement par Joël Dacomo ?
- Faut-il y ajouter logo HEIA-FR / signature du responsable / numéro
  unique de certificat ?
- Le PDF doit-il être en A4 portrait imprimable couleur, ou aussi
  livré en version « noir/blanc imprimante » ?

### 1.4 Envoi d'emails — listé dans l'infrastructure
§3 « Infrastructure nécessaire » mentionne :
> « Gmail ou autre provider pour l'envoi d'emails »

…mais aucune exigence fonctionnelle ne demande d'envoyer un email.

**Questions :**
- L'envoi d'email est-il attendu (par exemple : envoyer le certificat
  PDF au stagiaire à la fin du stage) ?
- Si non, pourquoi listé dans l'infra — c'est un futur besoin
  (« évolutif » mentionné §1) à documenter dans les améliorations ?

### 1.5 Durée des stages
Le CDC dit (§1) :
> « Ces stages, d'une durée de 1 à 2 jours en général… »

Le schéma actuel a `CHECK (end_date >= start_date)` qui autorise n'importe
quelle durée.

**Question :**
- Faut-il poser une contrainte (UI ou DB) bornant à ≤ 5 jours par
  exemple, ou cette indication « 1 à 2 jours » est-elle informative
  seulement ?

### 1.6 Inscriptions et planification — explicitement hors périmètre ?
Le CDC dit (§1) :
> « Dans le futur, on aimerait également intégrer la gestion des
> inscriptions et la planification des stages dans une même
> application. »

**Question :**
- À mentionner uniquement dans la section « Améliorations futures » du
  rapport, ou faut-il déjà préparer le schéma DB pour qu'il accueille
  ces entités sans refonte (table `registration`, table `session`) ?

---

## 2. Tests automatisés

### 2.1 « Tests du backend » vs E2E
Le CDC dit (§2.1) :
> « Un concept de tests automatisés du backend devra être mis en place
> afin de garantir la non-régression de l'application. »

L'implémentation actuelle :
- **Playwright** (E2E à travers le frontend, 24 specs fonctionnels)
- **Postman / Newman** (tests API directs)
- **sanity-db-check** (intégrité DB)

Mais **pas de tests unitaires** sur les services/modèles Node.

**Questions :**
- Les tests Postman comptent-ils comme « tests automatisés du
  backend » ?
- Faut-il ajouter une suite Vitest/Jest qui teste isolément les
  services (avec une base de test) pour cocher la case du CDC ?
- Le « concept d'automatisation des tests » (§2.4) doit-il être un
  document distinct dans le rapport, ou la section « Stratégie de
  tests » actuelle suffit ?

---

## 3. Documentation et livrables

### 3.1 Web Summary — non encore produit
Le CDC dit (§7) :
> « Un Web Summary — Ce document a pour objectif de présenter le
> projet de manière succincte. »

**Questions :**
- Quel format attendu (page HTML statique, slide unique PDF, README
  GitHub, page sur le wiki HEIA-FR) ?
- Quelle longueur cible (1 page A4, 1 écran web) ?
- Où le déposer (PkOrg, GitLab pages, autre) ?

### 3.2 Modèles fournis — utilisation confirmée ?
Le CDC mentionne trois « modèles fournis » (§2.3 et §7) :
1. Modèle de **planification**
2. Modèle de **journal de travail**
3. Modèle de **documentation technique** (point A, §6) sur la GED du
   CA TIC

**Questions :**
- Quels sont les liens exacts vers ces 3 modèles ?
- Le rapport actuel `Documentation du TPI 2026.docx` est-il bien
  basé sur le modèle CA TIC officiel (point A) ou sur un modèle
  ICT-FR générique ?
- Le journal de travail existe-t-il et est-il à jour ?
- La planification produite (`docs/rapport-tpi/planification-projet.md`)
  est-elle au bon format, ou faut-il la reporter dans le modèle Excel
  fourni ?

### 3.3 Standards d'entreprise CA TIC
Le CDC dit (§6) :
- B. Conventions de codage du CA TIC
- C. Workflow et conventions du CA TIC pour Git

Liens : https://api-ti.pages.forge.hefr.ch

**Questions :**
- La config Biome (`biome.json`) actuelle est-elle alignée avec les
  conventions CA TIC, ou est-ce ma config personnelle ?
- Les messages de commit Conventional Commits (`feat:`, `fix:`,
  `docs:`, `refactor:`) sont-ils conformes au workflow Git CA TIC,
  ou le CA TIC utilise un autre format (Jira ticket prefix par
  exemple) ?
- La stratégie de branches utilisée (commits directs sur `main` +
  worktrees temporaires) est-elle acceptée, ou faut-il une stratégie
  `feature/*` + Merge Requests vers `develop` ?

### 3.4 Variantes de solutions explicitement documentées
Le CDC dit (§2.3) :
> « Variantes de solutions ainsi que le choix »

Et critère d'évaluation **170 — Systématique de la découverte de
solution / proposition de solution**.

**Question :**
- La section « Choix techniques » du rapport présente-t-elle au moins
  2-3 alternatives par décision majeure (Vue vs React vs Svelte ;
  MariaDB vs PostgreSQL ; Carbone vs Puppeteer vs pdfkit ; Docker
  Compose vs Kubernetes), avec critères de choix explicites ?
- Si non, faut-il enrichir cette section pour cocher le critère 170 ?

### 3.5 Critères d'évaluation spécifiques (§8)
Les 7 critères chiffrés à adresser :

| Code | Libellé | Couvert par |
|---|---|---|
| 225 | Gestion des versions | Commits Git, branches |
| 170 | Découverte de solution / proposition | Variantes (voir 3.4) |
| 159 | Analyse du problème | Chapitre « Analyse » |
| 164 | Codage — traitement des erreurs | try/catch, codes HTTP |
| 165 | Implémentation de solutions | Chapitre « Réalisation » |
| 166 | Style de codage / lisibilité | Biome, refactors |
| 121 | Ergonomie logicielle | UI, accessibilité, Lucide |

**Question :**
- Le rapport mentionne-t-il **explicitement** chacun de ces 7 codes,
  ou laisse-t-il l'expert deviner où ils sont couverts ? Faut-il une
  table de mapping en annexe « Couverture des critères d'évaluation » ?

---

## 4. Infrastructure et code existant

### 4.1 « Accès au code de la partie existante du projet »
Le CDC dit (§3) :
> « Accès au code de la partie existante du projet »

Cela suggère qu'il y a déjà du code CA TIC à reprendre.

**Questions :**
- Existe-t-il une version antérieure de WorkXP Admin (ou équivalent)
  qu'il fallait étendre, ou est-ce que ce projet a bien été démarré
  de zéro ?
- Si une base existait : quelles parties ont été reprises et quelles
  parties ont été réécrites, et est-ce documenté ?

### 4.2 GitLab de la HEFR
Le CDC liste « GitLab de la HEFR » comme infrastructure.

**Questions :**
- Le dépôt principal est-il sur le GitLab HEIA-FR
  (`forge.hefr.ch` / `gitforge.hefr.ch`) ou sur GitHub personnel ?
- Si GitHub : faut-il mirrorer vers le GitLab interne avant le rendu ?

### 4.3 Données réelles à importer
Le CDC montre (§2.1) une capture OneNote avec 13 ateliers réels :
> Jeu de mémoire Ordo Lumina, Casse-briques, Tetris, Attrape-moi,
> Flappy Bird, Pac-Miam, Ozobot, Affiche film, Simon RPi Pico,
> Impression 3D…

**Questions :**
- Le seed actuel reproduit-il fidèlement ces 13 ateliers, ou ce sont
  des données factices ?
- Faut-il importer les vrais stagiaires historiques depuis le OneNote
  CA TIC, ou la base reste vide à la livraison et le CA TIC saisira
  les données ?

---

## 5. Délais et organisation

### 5.1 Calendrier réel vs « 10 jours × 8 h »
Le CDC dit (§9) :
> « Le projet y compris la remise du projet aux experts se terminera
> le 2 juin 2026 à 17 heures. »
> « La présentation du projet est fixée au 17 juin 2026 à 12:00. »

Signature le 3 mars 2026 → remise le 2 juin 2026 = ~13 semaines
calendaires pour 80 h de travail effectif.

**Questions :**
- La planification doit-elle être présentée en jours ouvrés numérotés
  (J1…J10) **ou** en dates calendaires réelles avec le travail
  étalé entre le 3 mars et le 2 juin ?
- Y a-t-il des semaines bloquées (cours, vacances, autres projets)
  à exclure du planning ?

### 5.2 Réunions avec les experts
Le CDC (§2.2, ligne « Gestion de projet ») mentionne :
> « Planification, journal de travail, réunions avec les experts… »

**Questions :**
- Combien de réunions sont prévues avec les experts ? (kickoff,
  mi-parcours, finale ?)
- Qui sont les experts (les deux noms à compléter dans le rapport) ?
- Ces réunions doivent-elles apparaître comme jalons dans la
  planification ?

### 5.3 Présentation (§9, 17 juin 2026)
**Questions :**
- Format de la présentation (durée, slides imposés ou libres, démo
  live de l'app, questions-réponses) ?
- L'expert teste-t-il l'application en direct, ou je dois préparer
  un jeu de données + scénario de démo prédéfini ?

---

## 6. Conformité légale et données

### 6.1 LPD / RGPD — pas mentionné
Le CDC parle de « données personnelles » des stagiaires (§2.1) mais ne
mentionne ni LPD (suisse) ni RGPD.

**Questions :**
- Comme les stagiaires sont des mineurs (jeunes du CO), faut-il un
  consentement parental documenté ? Hors périmètre de l'app, mais à
  mentionner dans le rapport ?
- Faut-il une fonction « droit à l'oubli » (suppression complète d'un
  stagiaire et de ses traces) ? Le hard delete actuel via FK CASCADE
  sur `internship_activity` semble le permettre — à confirmer.

### 6.2 Sauvegarde et restauration
Le projet inclut un service backup (cron hebdo Alpine + mariadb-dump).
Le CDC n'exige rien sur ce point.

**Question :**
- Est-ce un plus apprécié, ou faut-il aussi documenter une procédure
  de **restauration** testée (preuve que le dump est exploitable) ?

---

## 7. Récapitulatif — points à valider en priorité

Par ordre décroissant d'impact potentiel sur l'évaluation :

1. **Soft delete vs hard delete** des ateliers (1.2) — risque d'écart
   au CDC §2.1.
2. **Concept de tests automatisés du backend** (2.1) — Postman suffit-il,
   ou tests unitaires Vitest requis ?
3. **Web Summary** (3.1) — livrable obligatoire non encore produit.
4. **Modèles fournis** (3.2) — utilisation des templates CA TIC
   officiels à confirmer.
5. **Variantes de solutions** (3.4) — couvre le critère 170.
6. **Mapping critères 121/159/164/165/166/170/225** (3.5) — table en
   annexe.
7. **Authentification** (1.1) — à statuer explicitement même si pour
   l'exclure du périmètre.
8. **Standards CA TIC** (3.3) — vérifier alignement Biome / commits / Git.
9. **Calendrier réel vs J1-J10** (5.1) — adapter la planification.
10. **Noms des experts + dates des réunions** (5.2) — placeholders du
    rapport à remplir.
