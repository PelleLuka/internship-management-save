# Workflow Git — Gitflow

Ce document décrit le workflow Git adopté pour ce projet. Il doit être respecté **strictement** par tous les membres de l'équipe.

## Branches principales

| Branche | Rôle | Protégée |
|---------|------|----------|
| `main` | Code de production, uniquement des releases stables | Oui — aucun commit direct |
| `develop` | Branche d'intégration, toutes les features y sont fusionnées | Oui — aucun commit direct |

**Règle absolue :** on ne commit **JAMAIS** directement sur `main` ou `develop`. Tout passe par des branches dédiées.

## Branches de travail

### Feature branches (`feature/*`)

Utilisées pour développer une nouvelle fonctionnalité (user story).

**Convention de nommage :** `feature/<ref-us>-<nom-court>`
- Exemple : `feature/us13-test-setup`
- Exemple : `feature/us7-gestion-classes`

**Cycle de vie :**

```bash
# 1. Créer la branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/us13-test-setup

# 2. Travailler, commiter régulièrement
git add <fichiers>
git commit -m "feat(test): add vitest configuration"

# 3. Pousser la branche et créer une Merge Request pour review
git push origin feature/us13-test-setup
# → Créer une Merge Request sur GitLab et assigner un reviewer

# 4. Après approbation du reviewer, fusionner dans develop
git checkout develop
git pull origin develop
git merge --no-ff feature/us13-test-setup -m "feat(test): US#13 - mise en place environnement de test"
git push origin develop

# 5. Supprimer la branche feature (optionnel)
git branch -d feature/us13-test-setup
```

> **Important :** on utilise toujours `--no-ff` (no fast-forward) pour garder un historique clair avec un merge commit visible.

### Task branches (`task/*`) — pour les grosses US

Pour les user stories conséquentes (3+ tasks, plusieurs jours de travail), on découpe en sous-branches.

**Convention de nommage :** `task/<ref-us>-<nom-court>`
- Exemple : `task/us7-endpoint-api`
- Exemple : `task/us7-formulaire-ajout`

**Schéma :**

```
develop
  └── feature/us7-gestion-classes          ← branche principale de la US
        ├── task/us7-endpoint-api           ← sous-branche par task
        ├── task/us7-formulaire-ajout       ← merge dans feature sans review
        └── task/us7-gestion-erreurs        ← merge dans feature sans review
```

**Règles :**
- Les branches `task/*` sont créées **depuis la branche feature** (pas depuis develop)
- Les branches `task/*` sont mergées dans la branche feature **sans dev review** (merge libre)
- La branche feature est mergée dans `develop` **avec dev review obligatoire**

```bash
# 1. Créer une sous-branche task depuis la feature
git checkout feature/us7-gestion-classes
git checkout -b task/us7-endpoint-api

# 2. Travailler, commiter régulièrement
git add <fichiers>
git commit -m "feat(api): add classroom CRUD endpoints"

# 3. Merger la task dans la feature (pas de review nécessaire)
git checkout feature/us7-gestion-classes
git merge --no-ff task/us7-endpoint-api -m "feat(api): add classroom management endpoints"

# 4. Quand toute la US est prête → pousser feature → MR → review → merge dans develop
```

## Dev Review

**Tout merge dans `develop` DOIT être reviewé par un autre membre de l'équipe.** Aucune exception.

### Processus

1. Pousser la branche feature : `git push origin feature/us<ref>-<name>`
2. Créer une **Merge Request** sur GitLab (le template Default est appliqué automatiquement)
3. Remplir le résumé, les changements et cocher la checklist
4. Assigner un **reviewer** de l'équipe
5. Ajouter le label **`To Review`**
6. Le reviewer vérifie et ajoute le label approprié (voir ci-dessous)
7. Après approbation : merger dans `develop` avec `--no-ff`

### Labels de Merge Request

| Label | Qui l'ajoute | Signification |
|-------|-------------|---------------|
| `To Review` | L'auteur de la MR | La MR est prête à être reviewée |
| `Has Pending Comments` | Le reviewer | Des modifications sont demandées, l'auteur doit corriger |
| `Reviewed` | Le reviewer | La MR est approuvée, prête à être mergée |

**Cycle de vie des labels :**

```
Auteur crée la MR → To Review
     ↓
Reviewer examine
     ↓
  ┌─ OK → Reviewed → Merge
  └─ Pas OK → Has Pending Comments → Auteur corrige → To Review (nouveau cycle)
```

> **Règle :** un seul label à la fois. Quand on ajoute un nouveau label, on retire l'ancien.

### Ce que le reviewer vérifie

- [ ] Le code respecte les conventions (ESLint, TypeScript)
- [ ] Les tests passent et sont pertinents
- [ ] Le CHANGELOG est à jour
- [ ] L'implémentation correspond au design Figma (si UI)
- [ ] Pas de code mort, pas de `console.log` oubliés
- [ ] Les commits suivent la convention `type(scope): description`

### Release branches (`release/*`)

Utilisées pour préparer une nouvelle version de production. **On crée une release par sprint**, pas par feature. La release regroupe tout ce qui a été mergé dans `develop` durant le sprint.

| Sprint | Tag | Quand |
|--------|-----|-------|
| Sprint 1 | `v0.1.0` | Dernier jour du sprint |
| Sprint 2 | `v0.2.0` | Dernier jour du sprint |
| ... | ... | ... |

**Convention de nommage :** `release/<version>`
- Exemple : `release/0.1.0`

**Cycle de vie :**

```bash
# 1. Créer la branche depuis develop
git checkout develop
git pull origin develop
git checkout -b release/0.1.0

# 2. Mettre à jour le CHANGELOG.md et la version
#    (remplacer [Unreleased] par le numéro de version et la date)
git add CHANGELOG.md
git commit -m "chore(release): 0.1.0"

# 3. Fusionner dans main et taguer
git checkout main
git pull origin main
git merge --no-ff release/0.1.0 -m "chore(release): merge release 0.1.0 into main"
git tag -a v0.1.0 -m "v0.1.0"
git push origin main --tags

# 4. Fusionner également dans develop (pour récupérer les changements du release)
git checkout develop
git merge --no-ff release/0.1.0 -m "chore(release): merge release 0.1.0 back into develop"
git push origin develop

# 5. Supprimer la branche release
git branch -d release/0.1.0
```

### Hotfix branches (`hotfix/*`)

Utilisées pour corriger un bug critique en production.

**Convention de nommage :** `hotfix/<nom-court>`
- Exemple : `hotfix/fix-sensor-api`

**Cycle de vie :**

```bash
# 1. Créer depuis main
git checkout main
git pull origin main
git checkout -b hotfix/fix-sensor-api

# 2. Corriger et commiter
git add <fichiers>
git commit -m "fix(api): correct sensor data parsing"

# 3. Fusionner dans main et taguer
git checkout main
git merge --no-ff hotfix/fix-sensor-api -m "fix: hotfix sensor API"
git tag -a v0.1.1 -m "v0.1.1"
git push origin main --tags

# 4. Fusionner également dans develop
git checkout develop
git merge --no-ff hotfix/fix-sensor-api -m "fix: merge hotfix sensor API into develop"
git push origin develop

# 5. Supprimer la branche hotfix
git branch -d hotfix/fix-sensor-api
```

## Schéma visuel

```
main       ●────────────────────────●──────────● (tags: v0.1.0, v0.2.0...)
            \                      / \        /
release      \          ●────────●   \      /
              \        /              \    /
develop        ●──●──●──●──●──●──●────●──●──●
                \      /   \        /
feature          ●──●─●     ●──●──●
                 us13        us14
```

## Conventions de commit

Format : `type(scope): description`

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `test` | Ajout ou modification de tests |
| `ci` | Changements CI/CD |
| `docs` | Documentation |
| `refactor` | Refactoring sans changement de comportement |
| `chore` | Tâches diverses (dépendances, config...) |

### Scope (optionnel)

Le scope précise la zone du code concernée :
- `feat(api)` : fonctionnalité liée à l'API
- `fix(ui)` : correction sur l'interface
- `test(unit)` : tests unitaires
- `ci(pipeline)` : pipeline CI/CD

### Exemples

```
feat(api): add sensor data endpoint
fix(ui): correct air quality indicator color
test(nuxt): add AppLogo component render test
ci: add GitLab CI pipeline with lint and test stages
chore(deps): update nuxt to 4.4.0
```

## Versioning sémantique

Le projet suit le [Semantic Versioning](https://semver.org/) : `vMAJOR.MINOR.PATCH`

| Partie | Quand l'incrémenter |
|--------|---------------------|
| MAJOR | Changement incompatible (breaking change) |
| MINOR | Nouvelle fonctionnalité rétrocompatible |
| PATCH | Correction de bug rétrocompatible |

Les tags sont posés sur `main` uniquement, au format `v0.1.0`.

## CHANGELOG.md

Le fichier `CHANGELOG.md` à la racine du projet documente tous les changements notables. Il suit le format [Keep a Changelog](https://keepachangelog.com/).

Structure :

```markdown
## [Unreleased]
### Added
- Description des ajouts en cours

## [0.1.0] - 2026-03-05
### Added
- Ce qui a été ajouté dans cette version
### Fixed
- Ce qui a été corrigé
```

Catégories disponibles : `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

> **Règle :** chaque merge dans `develop` doit mettre à jour la section `[Unreleased]` du CHANGELOG.

## Checklist avant chaque merge dans `develop`

- [ ] Les tests passent (`pnpm test`)
- [ ] Le lint passe (`pnpm lint`)
- [ ] Le typecheck passe (`pnpm typecheck`)
- [ ] Les commits suivent la convention `type(scope): description`
- [ ] Le CHANGELOG.md est à jour (section `[Unreleased]`)
- [ ] Le merge utilise `--no-ff`
- [ ] La Merge Request a été **approuvée** par un reviewer
- [ ] L'implémentation UI est conforme au **design Figma**
