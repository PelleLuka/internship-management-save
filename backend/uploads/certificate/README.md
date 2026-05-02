# Template de certificat

Placez votre fichier `template.docx` ici, ou uploadez-le via la page **Paramètres** de l'application.

## Balises disponibles

| Balise | Valeur |
|--------|--------|
| `{prenom}` | Prénom du stagiaire |
| `{nom}` | Nom du stagiaire |
| `{email}` | Email du stagiaire |
| `{date_debut}` | Date de début (ex: 15 avril 2026) |
| `{date_fin}` | Date de fin |
| `{date_emission}` | Date d'émission du certificat (automatique) |
| `{#ateliers}…{/ateliers}` | Boucle sur les ateliers réalisés |
| `{titre}` | Titre de l'atelier (dans la boucle) |
| `{categories}` | Catégories de l'atelier (dans la boucle) |

## Exemple de boucle dans le template Word

```
{#ateliers}
- {titre} ({categories})
{/ateliers}
```

## Upload via l'interface

Allez sur `/settings` dans l'application → "Modèle de certificat" → uploader votre `.docx`.
