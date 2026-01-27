# Step-by-Step Commit Guide (Feature Branch Workflow)

This guide outlines how to commit your existing project by simulating a proper development workflow using feature branches.

## 1. Repository Initialization & Base Configuration
**Branch**: `main` -> `develop`

Start by initializing the repo and establishing the base branches.

```bash
git init
git checkout -b main
# Stage base configuration files
git add .gitignore biome.json package.json package-lock.json README.md
git commit -m "chore: initialize project configuration"
# Create develop branch
git checkout -b develop
```

## 2. Feature: Documentation
**Branch**: `feature/documentation`
**Files**: `doc/` or `*.md` reports

```bash
git checkout -b feature/documentation develop
git add RAPPORT_PROJET.md REVUE_*.md
git commit -m "docs: add initial project reports and documentation"
# Merge and cleanup
git checkout develop
git merge feature/documentation
git branch -d feature/documentation
```

## 3. Feature: Database Initialization
**Branch**: `feature/database-init`
**Files**: `database/` folder and schema files

```bash
git checkout -b feature/database-init develop
git add database/
git commit -m "feat(db): add initial database schema and seeds"
# Merge and cleanup
git checkout develop
git merge feature/database-init
git branch -d feature/database-init
```

## 4. Feature: Backend Core Implementation
**Branch**: `feature/backend-core`
**Files**: `backend/` folder (excluding node_modules)

```bash
git checkout -b feature/backend-core develop
git add backend/
git commit -m "feat(backend): add nodejs express backend implementation"
# Merge and cleanup
git checkout develop
git merge feature/backend-core
git branch -d feature/backend-core
```

## 5. Feature: Frontend Application
**Branch**: `feature/frontend-init`
**Files**: `frontend/` folder + `.vscode/` (if needed)
*Note: `frontend/node_modules` is automatically ignored.*

```bash
git checkout -b feature/frontend-init develop
git add frontend/ .vscode/
git commit -m "feat(frontend): add vuejs frontend application"
# Merge and cleanup
git checkout develop
git merge feature/frontend-init
git branch -d feature/frontend-init
```

## 6. Feature: Docker Infrastructure
**Branch**: `feature/docker-setup`
**Files**: `docker/` folder

```bash
git checkout -b feature/docker-setup develop
git add docker/
git commit -m "ops: add docker and docker-compose configuration"
# Merge and cleanup
git checkout develop
git merge feature/docker-setup
git branch -d feature/docker-setup
```

## 7. Feature: Testing Suite
**Branch**: `feature/postman-tests`
**Files**: `postman/` folder

```bash
git checkout -b feature/postman-tests develop
git add postman/
git commit -m "test: add postman collection and test scripts"
# Merge and cleanup
git checkout develop
git merge feature/postman-tests
git branch -d feature/postman-tests
```

---
> [!TIP]
> **Final State**:
> You are now on the `develop` branch with all features merged.
> To release to production: `git checkout main && git merge develop`
