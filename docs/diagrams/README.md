# Sources des diagrammes du rapport TPI

Ce dossier contient les fichiers sources des diagrammes utilisés dans le
rapport — pour qu'ils puissent être régénérés ou ajustés sans repartir
de zéro.

## Fichiers

| Fichier | Format | Outil pour générer le PNG | Figure du rapport |
|---|---|---|---|
| `01-use-case.puml` | PlantUML | https://plantuml.com/plantuml/ ou extension VS Code | Figure 4 — Cas d'utilisation |
| `02-sequence-create-internship.puml` | PlantUML | idem | Figure 11 — Création stagiaire |
| `03-sequence-upload-document.puml` | PlantUML | idem | Figure 12 — Upload document |
| `04-sequence-generate-certificate.puml` | PlantUML | idem | Figure 13 — Génération certificat |
| `05-database-schema.dbml` | DBML | https://dbdiagram.io/ | Figure 14 — MCD/MLD |
| `06-architecture.puml` | PlantUML | idem | Figure 10 — Architecture 3-tiers |

## Comment générer les PNG

### PlantUML — option en ligne (la plus rapide)

1. Ouvrir https://www.plantuml.com/plantuml/uml/
2. Coller le contenu d'un `.puml`
3. Cliquer « Submit » → un PNG apparaît
4. Clic droit → « Enregistrer l'image sous » → sauvegarder dans
   `docs/images/figureXX.png` puis insérer dans le rapport Word.

### PlantUML — option locale (VS Code)

1. Installer l'extension **PlantUML** (jebbs.plantuml).
2. Ouvrir un `.puml`, faire `Alt+D` (Preview) puis exporter en PNG via
   la palette de commandes (`PlantUML: Export Current Diagram`).

### DBML — dbdiagram.io

1. Ouvrir https://dbdiagram.io/d
2. Coller le contenu de `05-database-schema.dbml` dans l'éditeur de
   gauche → le MCD/MLD s'affiche à droite.
3. Bouton « Export » en haut à droite → PNG / PDF.
4. Sauvegarder dans `docs/images/figure14-mcd.png` puis insérer dans
   le rapport.

## Insertion dans le rapport Word

Pour chaque PNG généré :

1. Dans Word, naviguer juste avant la légende `Figure N : titre` du rapport.
2. Insertion → Image → choisir le PNG.
3. Cliquer sur l'image → Onglet « Format » → Style « Image centrée » (ou
   ajuster largeur ≈ 16 cm pour qu'elle tienne sur la page A4).
4. La légende existante reste sous l'image.

Quand tu mets à jour la table des illustrations (Références → Mettre à
jour la table), elle reprend automatiquement les légendes que j'ai déjà
placées dans le doc.

## Pourquoi PlantUML / DBML plutôt que Draw.io ?

- **Versionnable** : un `.puml` est du texte, donc git-friendly. Une
  modification se relit dans un diff. Un `.drawio` est un XML compressé
  qui ne se relit pas.
- **Reproductible** : même source = même rendu, peu importe l'OS.
- **Rapide** : pas de drag & drop, on tape les flux, l'outil gère
  l'alignement.

Si tu préfères Draw.io malgré tout, le rendu PlantUML est juste un
support de design — recopie la structure dans Draw.io et exporte en PNG.
