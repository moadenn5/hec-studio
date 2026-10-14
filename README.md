# HEC Studio — Planificateur M. Sc. Intelligence d'affaires (Projet supervisé)

Outil d'étude **non officiel** (non affilié à HEC Montréal) pour suivre son cheminement dans le **M. Sc. Intelligence d'affaires, cheminement Projet supervisé, structure 2026-2027** (45 crédits). Ce n'est **pas** le cheminement avec mémoire.

**Version 1.2 — 14 octobre 2026**

## Ce que fait l'outil
- Catalogue des 26 cours de la structure (obligatoires, options Marketing / Sciences de la décision / TI, activités, ateliers) avec crédits, périodes d'offre, préalables et exclusions.
- Calcul des crédits : réussis, en cours (trimestre courant), planifiés (trimestres futurs), restants ; plafonds par catégorie.
- Planificateur par trimestre (Automne 2026 → Été 2028) : liste de cours compacte avec filtres (catégorie, profil, recherche) toujours visibles, détection des préalables, des cours non offerts et des conflits ; glisser-déposer.
- Arbre d'études avec liens de préalables (« l'un OU l'autre » en pointillés).
- Validation du plan (sans garantie de diplomation) et suivi du projet supervisé avec chronologie en diagramme de Gantt (dates, aujourd'hui, jalons).
- **Depuis 1.1** : à la première visite de chaque section, une courte fenêtre d'aide explique à quoi elle sert et comment la manipuler ; l'icône ⓘ à côté du titre la rouvre à tout moment.
- **Depuis 1.1** : carte « Conseils pour choisir vos cours » dans le planificateur, résumant les recommandations du professeur Léo Belzile ([source](https://lbelzile.bitbucket.io/ia.html#cours-obligatoires)) — avis d'un professeur, pas des règles officielles de HEC.

## Utiliser en ligne
Ouvrir le lien de la page (GitHub Pages). **Vos données restent dans votre navigateur** (stockage local) : elles ne sont envoyées nulle part, personne d'autre ne les voit, et chaque personne qui ouvre le lien démarre avec un plan vierge.
- Elles sont propres à un appareil + un navigateur, et disparaissent si vous videz les données du site.
- Utilisez **Paramètres → Exporter mes données** pour garder une copie, et **Importer** pour la restaurer ailleurs.

## Utiliser en local
Ouvrir `index.html` dans un navigateur (connexion Internet requise pour les icônes et la police), ou lancer `python -m http.server` dans ce dossier puis aller sur http://localhost:8000.

## Sources et limites
- Structure : [page officielle du programme](https://www.hec.ca/programmes/maitrises/maitrise-intelligence-affaires/structure/) et fiches de cours de hec.ca. HEC précise que ces informations peuvent changer.
- Offre non confirmée par HEC (« au moins une fois par an / aux deux ans ») : MATH 60656, TECH 60702, TECH 60712, TECH 60720 — l'outil les signale sans les bloquer.
- Règle du **projet supervisé** : le document officiel ne précise pas la période d'offre ni de seuil de crédits ; l'outil applique « toute session, après 12 crédits de cours terminés » (information fournie par l'étudiant à l'origine de l'outil) — **à confirmer auprès de HEC**. La soumission du sujet avant 36 crédits de cours cumulés est celle du document officiel.
- Convention de trimestres (Hiver = janvier–avril, Été = mai–août, Automne = septembre–décembre), coût par crédit et échelle de notes : paramètres de l'application, pas des données officielles.
- Trimestres planifiables : Automne 2026 à Été 2028.

Vérifiez toujours votre cheminement auprès de HEC Montréal.
