# HEC-M Planificateur — M. Sc. Intelligence d'affaires (Projet supervisé)

Outil d'étude **non officiel** (non affilié à HEC Montréal) pour suivre son cheminement dans le **M. Sc. Intelligence d'affaires, cheminement Projet supervisé, structure 2026-2027** (45 crédits). Ce n'est **pas** le cheminement avec mémoire.

**Version 1.5 — 14 octobre 2026**

Outil développé par **EN-NADIF Moad**.

## Ce que fait l'outil
- Catalogue des 26 cours de la structure (obligatoires, options Marketing / Sciences de la décision / TI, activités, ateliers) avec crédits, périodes d'offre, préalables et exclusions.
- Calcul des crédits : réussis, en cours (trimestre courant), planifiés (trimestres futurs), restants ; plafonds par catégorie.
- Planificateur par trimestre (Automne 2026 → Été 2028) : liste de cours compacte avec filtres (catégorie, profil, recherche) toujours visibles, détection des préalables, des cours non offerts et des conflits ; glisser-déposer.
- Barre de crédits compacte et trimestres affichés sans défilement horizontal ; mise en page adaptée à l'ordinateur, à l'iPad (barre latérale réduite en icônes) et au mobile (barre d'onglets en bas).
- Arbre d'études avec liens de préalables (« l'un OU l'autre » en pointillés).
- Validation du plan et suivi du projet supervisé avec chronologie en diagramme de Gantt (dates, aujourd'hui, jalons).

## Utiliser en ligne
Ouvrir le lien de la page www.moadenn5.github.io/hec-studio/. **Vos données de planification restent dans votre navigateur** (stockage local) : elles ne sont envoyées nulle part (seuls les résumés que vous choisissez de déposer dans la section Résumés sont envoyés au serveur), personne d'autre ne les voit, et chaque personne qui ouvre le lien démarre avec un plan vierge.
- Elles sont propres à un appareil + un navigateur, et disparaissent si vous videz les données du site.
- Après une modification, un rappel, affiché à chaque modification, propose **Exporter** (copie JSON) ou **Importer** ; les mêmes boutons sont dans **Paramètres**.

## Utiliser en local
Ouvrir `index.html` dans un navigateur (connexion Internet requise pour les icônes et la police), ou lancer `python -m http.server` dans ce dossier puis aller sur http://localhost:8000.

## Sources et limites
- Structure : [page officielle du programme](https://www.hec.ca/programmes/maitrises/maitrise-intelligence-affaires/structure/) et fiches de cours de hec.ca.
- Trimestres planifiables : Automne 2026 à Été 2028.

