// ═══════════════════════════════════════════════════════════════════════════
// HEC Montréal — M. Sc. Intelligence d'affaires (cheminement Projet supervisé)
// Source unique du catalogue : « Structure du Programme M. Sc. Intelligence
// d'affaires - Projet (2026-2027) » (Program info & Savings/Structure_MSc_Intelligence_Affaires.md).
// Toute information absente de ce document est signalée dans `unverified`
// plutôt qu'inventée.
// ═══════════════════════════════════════════════════════════════════════════

const PROGRAM = {
    title: "M. Sc. Intelligence d'affaires — Projet supervisé",
    year: "2026-2027",
    totalCredits: 45,
    // Exigences lues dans le document officiel
    required: { tronc: 3, noyau: 15, projet: 9, optionsMin: 15, choixMax: 3 },
    // 45 − (3 + 15 + 9) = 18 crédits « libres » : options (min. 15) + cours au choix (max. 3)
    electivePool: 18,
    // « soumettre son sujet … avant d'avoir cumulé 36 crédits de cours »
    subjectDeadlineCredits: 36
};

// Frais estimés par crédit : paramètre propre à l'application (absent du document officiel).
const COST_PER_CREDIT = 840;

const SCHEMA_VERSION = 2;
// Version de l'application (affichée dans Paramètres → À propos)
const APP_VERSION = "1.1";
const APP_VERSION_DATE = "14 octobre 2026";

// Isolation du stockage local. Sur un site hébergé (ex. GitHub Pages : utilisateur.github.io/depot/), TOUS les dépôts
// d'un même compte partagent la même origine, donc le même localStorage : on préfixe donc les clés avec le nom du
// dépôt (1er segment du chemin) pour que deux versions (v1, v2…) ne s'écrasent jamais. En local (localhost, 127.0.0.1,
// fichier) le préfixe est vide : les clés historiques sont conservées telles quelles.
function computeStorageNs(hostname, protocol, pathname) {
    try {
        if (!hostname || protocol === "file:" || hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") return "";
        const seg = String(pathname || "").split("/").filter(Boolean)[0] || "";
        return seg && !/\.[a-z0-9]+$/i.test(seg) ? seg + ":" : "";
    } catch (e) { return ""; }
}
const STORAGE_NS = computeStorageNs(location.hostname, location.protocol, location.pathname);

const STORAGE_KEYS = {
    courses: "hec_msc_courses",
    projectStart: "hec_project_start",
    targetGpa: "hec_target_gpa",
    targetYear: "hec_target_year",
    archive: "hec_msc_archive",
    schema: "hec_schema_version",
    preMigrationBackup: "hec_msc_courses_backup_pre_v2",
    preImportBackup: "hec_msc_courses_backup_pre_import",
    corruptBackup: "hec_msc_courses_backup_corrupt"
};

// Trimestres planifiables (A = Automne, H = Hiver, E = Été)
const SEMESTERS = {
    "A26": "Automne 2026",
    "H27": "Hiver 2027",
    "E27": "Été 2027",
    "A27": "Automne 2027",
    "H28": "Hiver 2028",
    "E28": "Été 2028"
};
const SEMESTER_ORDER = Object.keys(SEMESTERS);

const CATEGORY_LABELS = {
    tronc: "Obligatoire Programme",
    noyau: "Obligatoire Spécialisation",
    options: "Option de Spécialisation",
    projet: "Activité Obligatoire",
    recommandes: "Activité Recommandée",
    choix: "Cours au choix"
};

// Cours présents dans d'anciennes versions de la plateforme mais ABSENTS de la structure officielle.
// Ils ne sont jamais supprimés : ils sont archivés avec leurs données personnelles.
// (liste vide : les cours MATH 60607/60613/60615/60621/60629/60656 appartiennent au profil « Sciences de la décision » selon la page officielle HEC)
const OUT_OF_PROGRAM_CODES = [];
// Le document officiel indique « MATH 70611 (Réf. MATH 70111) ».
const CODE_ALIASES = { "MATH 70111": "MATH 70611" };

const NOT_IN_DOC = "Non précisé dans le document officiel";

const DEFAULT_COURSES = [
    // ── 1. Cours obligatoire du programme (3 cr) ─────────────────────────────
    {
        code: "GEST 60401",
        name: "Comparative Perspectives on Organizations",
        nameFr: "Regards croisés sur les grands enjeux de société et l'entreprise",
        category: "tronc",
        subject: "Gestion",
        credits: 3.0,
        period: "Toute l'année",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Ce cours propose de développer une prise de conscience critique face aux grands enjeux sociaux et environnementaux, à travers une analyse des fondements de l'entreprise et du modèle de société au sein duquel cette institution s'est imposée. Basé sur la lecture et la discussion de textes fondamentaux en sciences sociales (économie, sociologie, anthropologie, histoire), il permet de prendre du recul par rapport aux techniques de gestion. Le cours est animé conjointement par deux enseignants (Département d'économie appliquée et Département de management).",
        themes: [
            "L'émergence de la société moderne occidentale",
            "Le modèle de société occidentale moderne et ses implications sociales et environnementales",
            "Les fondements économiques et sociaux de l'entreprise",
            "Les ressorts individuels et collectifs de l'entreprise",
            "L'entreprise en perspective face aux grands défis sociaux et environnementaux"
        ],
        remarques: "Cours en anglais : GEST 60401A. Il est fortement recommandé de suivre ce cours en fin de programme.",
        recommendLate: true,
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    // ── 2. Cours obligatoires de la spécialisation (15 cr) ───────────────────
    {
        code: "MARK 60105",
        name: "Database Marketing Analysis",
        nameFr: "Analyse des bases de données en marketing",
        category: "noyau",
        subject: "Marketing",
        credits: 3.0,
        period: "Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Apprentissage de différents concepts et techniques permettant de solutionner des problèmes marketing à l'aide des technologies de l'information, de l'analyse quantitative et des calculs d'efficacité/coût. Des concepts clés tels que la valeur à vie des consommateurs ainsi que la segmentation de type RFM seront abordés. Dans le cadre du travail de session, les étudiants résoudront une problématique marketing réelle proposée par une entreprise partenaire.",
        themes: [
            "Marketing", "Analytique d'affaires", "Statistiques", "Bases de données", "Intelligence d'affaires",
            "Apprentissage supervisé et non-supervisé sur des BDM", "Techniques de segmentation",
            "Identification des comportements clients", "Ciblage", "Recommandations basées sur les données"
        ],
        remarques: "Préalables : MATH 60600(A) ou MATH 60602 ou MATH 60619 (un seul des trois suffit). Ce cours s'adresse aux étudiants ayant déjà des connaissances de base du logiciel statistique SAS.",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: ["MATH 60600", "MATH 60602", "MATH 60619"], prerequisiteRelation: "OR",
        corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60600",
        name: "Data Mining Techniques",
        nameFr: "Techniques d'exploitation de données (data mining)",
        category: "noyau",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne, Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Méthodes d'apprentissage statistique (machine learning / data mining) parmi les plus utilisées en pratique pour l'analyse des mégadonnées. Le cours illustre, à partir d'exemples concrets en gestion, comment anticiper la demande, accroître la rétention ou réduire la fraude.",
        themes: [
            "Arbres de classification et de régression", "Combinaison d'arbres (Boosting et forêts aléatoires)",
            "Réseaux de neurones", "Interprétation des modèles", "Classification avec classes déséquilibrées",
            "Modélisation incrémentale et effets de traitement individuels"
        ],
        remarques: "Cours en anglais : MATH 60600A. Exclusion : MATH 60603(A) — vous ne pouvez pas vous inscrire si ce cours fait partie de votre structure.",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: ["MATH 60603"], restrictions: ""
    },
    {
        code: "MATH 60602",
        name: "Applied Multivariate Analysis",
        nameFr: "Analyse multidimensionnelle appliquée",
        category: "noyau",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne, Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Formation de base en traitement de données multidimensionnelles. Compréhension intuitive, interprétation et utilisation de plusieurs techniques statistiques à l'aide de logiciels appropriés, en réduisant l'usage des concepts mathématiques au minimum.",
        themes: [
            "Analyse exploratoire", "Analyse factorielle exploratoire et analyse en composantes principales (ACP)",
            "Analyse de regroupements (clustering)", "Sélection de variables pour les modèles de régression",
            "Régression logistique pour données binaires et multinomiales", "Analyse de survie", "Traitement des données manquantes"
        ],
        remarques: "Une connaissance des concepts et méthodes statistiques de base est requise (aucun cours précis n'est nommé). Exclusion : MATH 60603(A).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: ["MATH 60603"], restrictions: ""
    },
    {
        code: "MATH 60619",
        name: "Statistical Analysis and Inference",
        nameFr: "Analyse et inférence statistique",
        category: "noyau",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne, Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Ce cours aborde les notions fondamentales de l'inférence statistique et de la régression. En plus des concepts théoriques, l'accent est mis sur les applications pratiques en intelligence d'affaires à l'aide de logiciels appropriés.",
        themes: [
            "Tests de localisation pour deux échantillons", "Analyse de la variance (ANOVA à un et deux facteurs)",
            "Modèles linéaires", "Analyse de données corrélées et longitudinales", "Modèles linéaires généralisés"
        ],
        remarques: "Exclusion : MATH 60604(A) — vous ne pouvez pas vous inscrire à ce cours si vous avez réussi ou postulé au cours MATH 60604(A).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: ["MATH 60604"], restrictions: ""
    },
    {
        code: "TECH 60701",
        name: "Business Intelligence Technologies",
        nameFr: "Technologies de l'intelligence d'affaires",
        category: "noyau",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Toute l'année",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Présentation et utilisation des technologies qui supportent l'intégration et l'exploitation des données dans le domaine de l'intelligence d'affaires, en se concentrant sur l'utilisation avancée des bases de données relationnelles. L'étudiant développe un regard critique sur la structure, la manipulation et l'extraction de données issues de sources opérationnelles, ainsi que sur la gouvernance et le Big Data.",
        themes: [],
        remarques: "",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    // ── 3. Cours à option de la spécialisation (min. 15 cr) ──────────────────
    //    Profil Marketing
    {
        code: "MARK 60151",
        name: "Demand Analysis",
        nameFr: "Analyse de la demande",
        category: "options", profile: "Marketing",
        subject: "Marketing",
        credits: 3.0,
        period: "Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Ce cours porte sur l'analyse, l'identification et la mesure de la demande tant sur les marchés canadiens qu'étrangers (nouveaux produits, produits existants, services). Il fournit les outils, sources de données et approches pour aider les gestionnaires à élaborer leurs plans d'actions commerciales.",
        themes: [
            "Approches d'analyse de la demande", "Sources de données",
            "Estimation de la demande actuelle, potentielle et prévisionnelle", "Perspective des consommateurs"
        ],
        remarques: "",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60622",
        name: "Decision Models in Marketing",
        nameFr: "Modèles de décision en marketing",
        category: "options", profile: "Marketing",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Initiation à la modélisation mathématique en marketing (tarification, optimisation de budget publicitaire, etc.). Le cours développe la formulation de modèles descriptifs (statistiques) ou prescriptifs (optimisation), la collecte de données et l'implémentation de solutions rigoureuses.",
        themes: [
            "Typologie des modèles (statiques/dynamiques, déterministes/stochastiques)",
            "Optimisation de programmes marketing (modèles linéaires, théorie des jeux)",
            "Tarification (concurrence imparfaite, réseaux de distribution)", "Promotion des ventes",
            "Modèles de choix discrets et de parts de marché", "Positionnement multidimensionnel de produits"
        ],
        remarques: "",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "TECH 60110",
        name: "Web Analytics",
        nameFr: "Web analytique",
        category: "options", profile: "Marketing",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Automne, Hiver",
        mode: "Côte-des-Neiges | Hybride (À distance synchrone / Présentiel)",
        desc: "Améliorer la compréhension des données Internet, de l'analyse et des rapports relatifs au Web pour la prise de décision stratégique. Exploration du trafic, du référencement (SEO), des modèles commerciaux et de l'optimisation de plateformes via des études de cas, des tests A/B et un mandat client.",
        themes: [
            "Introduction à l'analyse Web", "Google Analytics (apprentissage pratique)", "Analyse des données clickstream",
            "Modèles e-commerce, SaaS et médias sociaux", "Référencement (SEO)", "Parcours client et recherche UX",
            "Tests A/B", "Tableaux de bord"
        ],
        remarques: "Cours en anglais : TECH 60110A.",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    //    Profil Sciences de la décision (source : hec.ca — le tableau du document téléversé est vide)
    {
        code: "MATH 60607",
        name: "Algorithms for Optimization and Big Data Analysis",
        nameFr: "Algorithmes pour l'optimisation et l'analyse des mégadonnées",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Algorithmique des méthodes d'exploitation des mégadonnées. Analyse de complexité, structures de données, calcul parallèle et distribué.",
        themes: [
            "Programmation séquentielle et analyse algorithmique",
            "Calcul parallèle avec mémoire partagée (utilisation de fils threads)",
            "Calcul parallèle synchronisé sans mémoire partagée (utilisation de MPI)",
            "Calcul distribué (utilisation de hadoop/spark)"
        ],
        remarques: "Cours en anglais : MATH 60607A.",
        source: "Page « Structure du programme » et fiche du cours sur hec.ca. Ce cours n'apparaît pas dans le tableau « Sciences de la décision » du document téléversé (tableau vide) : il vient de la source officielle HEC de niveau 2. Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], prerequisiteRelation: "AND", corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60615",
        name: "Decision Analysis",
        nameFr: "Analyse de décision",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Présentation des principaux outils d'analyse propres à appuyer les décisions tactiques.",
        themes: [
            "Arbres de décision",
            "Simulation de Monte-Carlo",
            "Théorie de l'utilité",
            "Programmation par objectif",
            "Optimisation multicritères",
            "Analyse hiérarchique"
        ],
        remarques: "Cours en anglais : MATH 60615A.",
        source: "Page « Structure du programme » et fiche du cours sur hec.ca. Ce cours n'apparaît pas dans le tableau « Sciences de la décision » du document téléversé (tableau vide) : il vient de la source officielle HEC de niveau 2. Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], prerequisiteRelation: "AND", corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60629",
        name: "Machine Learning I: Large Scale Data Analysis and Decision Making",
        nameFr: "Apprentissage automatique I : analyse des mégadonnées et prise de décision",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Ce cours porte sur les modèles d'apprentissage automatique (machine learning), notamment pour l'apprentissage supervisé et non supervisé. À noter : les étudiants devront déjà connaître un langage de programmation.",
        themes: [
            "Calcul distribué et parallèle",
            "Apprentissage supervisé",
            "Apprentissage non supervisé",
            "Apprentissage par renforcement",
            "Systèmes de recommandations",
            "Prise de décision séquentielle"
        ],
        remarques: "Préalables : MATH 60600(A) et MATH 60602 (les deux ; selon la fiche HEC, ce préalable vaut pour les spécialisations autres que Sciences des données et analytique d'affaires). Cours en anglais : MATH 60629A. Le cours de doctorat MATH 80629 est maintenant un cours du programme de M. Sc. Cours réservé aux étudiants admis à un programme de 2e cycle.",
        source: "Page « Structure du programme » et fiche du cours sur hec.ca. Ce cours n'apparaît pas dans le tableau « Sciences de la décision » du document téléversé (tableau vide) : il vient de la source officielle HEC de niveau 2. Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: ["MATH 60600", "MATH 60602"], prerequisiteRelation: "AND", corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60613",
        name: "Logiciels statistiques pour l'analyse de données",
        nameFr: "",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Automne, Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Ce cours est une introduction à la programmation en SAS et en R dans le but de nettoyer des jeux de données.",
        themes: [
            "Traitement des données dans SAS : fonctions et énoncés",
            "Manipulation de base dans SAS",
            "Manipulation avancée dans SAS",
            "Boucles et arrays dans SAS",
            "Le langage Macro",
            "Introduction à la programmation orientée objet dans R",
            "Concepts de base dans R",
            "Manipulations et sorties de résultats dans R de base",
            "Manipulations avec la suite Tidyverse",
            "Manipulations avancées et Rmarkdown",
            "Visualisations des données avec GGPLOT2 et exemple d'analyses statistiques"
        ],
        remarques: "",
        source: "Page « Structure du programme » et fiche du cours sur hec.ca. Ce cours n'apparaît pas dans le tableau « Sciences de la décision » du document téléversé (tableau vide) : il vient de la source officielle HEC de niveau 2. Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], prerequisiteRelation: "AND", corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 70611",
        name: "Méthodes avancées en exploitation de données",
        nameFr: "",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Discussion approfondie des concepts théoriques et de l'utilisation pratique des méthodes récentes en analyse avancée de données, principalement implémentées via des packages du langage R.",
        themes: [
            "Régularisation et sélection de variables en régression", "Méthodes avancées basées sur les arbres et le boosting",
            "Intervalles de prédiction", "Analyse de données fonctionnelles", "Analyse de données spatiales"
        ],
        remarques: "Référence : MATH 70111. Cours en anglais : MATH 70611A. Équivalent à MATH 60611(A) ou MATH 80619(A).",
        source: "Document téléversé (description détaillée) et page « Structure du programme » sur hec.ca (listé dans le profil Sciences de la décision). Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60656",
        name: "Réalisation de projets en analyse de données",
        nameFr: "",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Au moins une fois aux deux ans",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Les étudiants seront amenés en équipe à rencontrer une OBNL pour solutionner un problème lié à la valorisation des données.",
        themes: [
            "La rencontre du client et la définition du mandat",
            "L'offre de service",
            "Le plan d'analyse",
            "La répartition du travail au sein de l'équipe d'analyse",
            "La présentation des résultats et des recommandations",
            "La rédaction du rapport",
            "Le compte-rendu et la synthèse des apprentissages"
        ],
        remarques: "Préalable : MARK 60105. Cours équivalent : MATH 60156(A).",
        source: "Page « Structure du programme » et fiche du cours sur hec.ca. Ce cours n'apparaît pas dans le tableau « Sciences de la décision » du document téléversé (tableau vide) : il vient de la source officielle HEC de niveau 2. Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: ["MARK 60105"], prerequisiteRelation: "AND", corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "MATH 60621",
        name: "Natural Language Processing",
        nameFr: "Traitement automatique du langage naturel",
        category: "options", profile: "Sciences de la décision",
        subject: "Mathématiques",
        credits: 3.0,
        period: "Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Ce cours couvrira les outils et modèles fondamentaux utilisés pour analyser et générer le langage naturel dans un contexte informatique. Le cours suppose de l'expérience préalable avec le langage de programmation Python.",
        themes: [
            "La nature des données textuelles",
            "Le prétraitement du texte : tokenisation et lemmatisation",
            "Les modèles sac-de-mots, les modèles thématiques et la classification naïve",
            "Les modèles de langage N-grams (modèles de Markov)",
            "Les modèles de Markov cachés et l'étiquetage grammatical",
            "Les représentations distribuées et la sémantique vectorielle",
            "Les modèles de langage neuronaux récurrents, les LSTMs et la génération de texte",
            "Les modèles de langage Transformers et la modélisation du langage masqué",
            "Les modèles encodeurs et la recherche sémantique",
            "Les modèles encodeurs-décodeurs, le résumé de texte et la traduction"
        ],
        remarques: "Cours en anglais : MATH 60621A. Cours réservé aux étudiants admis à un programme de 2e cycle (ou au B.A.A. si le cours fait partie de la spécialisation).",
        source: "Page « Structure du programme » et fiche du cours sur hec.ca. Ce cours n'apparaît pas dans le tableau « Sciences de la décision » du document téléversé (tableau vide) : il vient de la source officielle HEC de niveau 2. Crédits (3,00) et période d'offre : tableau officiel « Cours à option de la spécialisation » fourni par l'étudiant (capture du 12 oct. 2026).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], prerequisiteRelation: "AND", corequisites: [], exclusions: [], restrictions: ""
    },
    //    Profil Technologies de l'information
    {
        code: "TECH 60700",
        name: "Digital Transformation",
        nameFr: "Transformation numérique",
        category: "options", profile: "Technologies de l'information",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Toute l'année",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Examen du rôle des technologies numériques comme catalyseur de la transformation du modèle d'affaires d'une organisation et des habiletés clés dans la gestion de la transformation (télécommunications, mobile, médias sociaux, Big Data, IA).",
        themes: [
            "Nature et portée de la transformation numérique", "Initiative stratégique",
            "Rôle de l'IA dans les composantes du modèle d'affaires (segments clientèle, proposition de valeur, canaux, relation client)",
            "Habiletés clés de gestion", "Facteurs de succès/échec", "Protection de la vie privée et intégrité"
        ],
        remarques: "Un ordinateur portable configuré selon les exigences technologiques de l'École est requis.",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: "Ordinateur portable conforme aux exigences de l'École"
    },
    {
        code: "TECH 60702",
        name: "IT Project Implementation",
        nameFr: "Mise en oeuvre du changement technologique",
        category: "options", profile: "Technologies de l'information",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Au moins une fois par an",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Familiarisation avec le processus de mise en œuvre du changement technologique, les modèles de diagnostic et la gestion des risques associés. Ce cours se distingue de la conception technique pure en mettant l'accent sur la dimension managériale et humaine.",
        themes: [
            "Conditions initiales et critères de succès des projets TI", "Dossier de justification TI",
            "Analyse des parties prenantes", "Évaluation du succès", "Gestion du risque et des imprévus",
            "Escalade/désescalade de grands chantiers TI", "Gestion de la résistance au changement", "Compétences du spécialiste TI"
        ],
        remarques: "",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "TECH 60711",
        name: "Artificial Intelligence Applications",
        nameFr: "Réalisation d'applications d'intelligence artificielle",
        category: "options", profile: "Technologies de l'information",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Automne, Hiver",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Approche expérientielle visant à maîtriser les fondements et les principes de développement des applications d'IA en gestion. Les étudiants réalisent une application concrète à partir d'une plateforme d'IA tout en appliquant un cadre d'éthique rigoureux.",
        themes: [
            "Fondements de l'IA (origines, types de systèmes)", "Principes des modèles d'IA",
            "Plateformes et outils de développement", "Insertion de l'IA dans les modèles d'affaires",
            "Méthodologie et défis de réalisation", "Considérations éthiques en gestion"
        ],
        remarques: "Un ordinateur portable configuré selon les exigences technologiques de l'École est obligatoire.",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: "Ordinateur portable conforme aux exigences de l'École"
    },
    {
        code: "TECH 60712",
        name: "Protecting Data",
        nameFr: "Protéger les données dans l'univers numérique",
        category: "options", profile: "Technologies de l'information",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Au moins une fois par an",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Introduction globale à la cybersécurité et à la protection des actifs informationnels pour les gestionnaires et analystes d'affaires non techniques. Le cours s'appuie sur des études de cas réels et l'exploration de bonnes pratiques de gouvernance.",
        themes: [
            "Objectifs de protection des données confidentielles", "Impacts des brèches numériques",
            "Principales menaces et vulnérabilités", "Scénarios de risques",
            "Cadres réglementaires et politiques de gouvernance", "Éthique et vie privée",
            "Rôle de la culture organisationnelle et programmes de sensibilisation"
        ],
        remarques: "",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "TECH 60720",
        name: "Process Redesign and AI",
        nameFr: "Refonte des processus d'affaires assistée par l'intelligence artificielle",
        category: "options", profile: "Technologies de l'information",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Au moins une fois aux deux ans",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Maîtrise d'une méthodologie systématique et d'outils pratiques (IA, Apprentissage Machine) pour poser un diagnostic sur la performance/qualité des processus existants et concevoir des architectures cibles améliorées.",
        themes: [
            "Concepts fondamentaux de l'analyse des processus", "Choix d'une méthode de refonte",
            "Diagnostic assisté via le forage de processus (process mining sur fichiers logs)",
            "Conception assistée par automatisation robotisée (RPA / ARP) et automatisation intelligente/cognitive",
            "Expérience utilisateur (interface humain-machine)", "Acquisition des outils"
        ],
        remarques: "",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "TECH 60771",
        name: "Information Dashboards",
        nameFr: "Tableaux de bord et gouvernance des données",
        category: "options", profile: "Technologies de l'information",
        subject: "Technologies de l'information",
        credits: 3.0,
        period: "Toute l'année",
        mode: "Côte-des-Neiges | Présentiel",
        desc: "Approche structurée pour concevoir, développer et évaluer des tableaux de bord informationnels tout en liant ces compétences aux fondements de la gouvernance et au cycle de vie de la donnée pour assurer la fiabilité de la décision stratégique.",
        themes: [
            "Rôle et types de tableaux de bord", "KPI et indicateurs de performance", "Analyse des besoins",
            "Fondements de la gouvernance des données (qualité, cycle de vie, accessibilité, sécurité)",
            "Visualisation de données", "Choix technologiques", "UI/UX (interface utilisateur)"
        ],
        remarques: "Un ordinateur portable configuré selon les exigences de l'École est requis.",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: "Ordinateur portable conforme aux exigences de l'École"
    },
    // ── 4. Activités obligatoires (9 cr) ─────────────────────────────────────
    {
        code: "ETHI 66200",
        name: "Responsible Conduct Res SupPro",
        nameFr: "La conduite responsable de la recherche : Des normes à la pratique",
        category: "projet",
        subject: "Éthique et gouvernance",
        credits: 0.0,
        period: "Toute l'année",
        mode: "En ligne | À distance asynchrone",
        desc: "Introduction complète aux normes et meilleures pratiques en matière de conduite responsable de la recherche scientifique (CRR). Ce cours prépare les étudiants à identifier et gérer les situations éthiques problématiques, les inconduites et à comprendre la gouvernance de la recherche. Durée : environ 3h30.",
        themes: [
            "Valeurs et historique de la CRR", "Encadrement", "Éthique de la recherche",
            "Bonne gestion des données de recherche", "Conflits d'intérêt", "Enjeux de pouvoir",
            "Bonnes pratiques de diffusion des résultats", "Impacts sociétaux", "Inconduites"
        ],
        remarques: "Cours en anglais : ETHI 66200A. Une séance synchrone d'accueil est organisée en début de trimestre. Réservé aux étudiants du cheminement Projet supervisé (les étudiants en mémoire suivent ETHI 66201). Préalable obligatoire de INDV 66202 (ou en concomitance).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: "Réservé au cheminement Projet supervisé"
    },
    {
        code: "INDV 66202",
        name: "Supervised Project",
        nameFr: "Projet supervisé",
        category: "projet",
        subject: "Projet individuel",
        credits: 9.0,
        period: "Toute l'année",
        mode: "Côte-des-Neiges / Autre | Présentiel",
        desc: "Prise en charge d'un mandat spécifique avec livrables clairs, permettant de résoudre de façon rigoureuse un problème de recherche ou issu d'un milieu pratique en mobilisant une démarche scientifique. Contextes de réalisation : mandat d'intervention en organisation (diagnostic, planification/implantation de pratiques de gestion, conception d'outils/modèles décisionnels, analyse de performance, recommandations) ou mandat à l'université (étude de cas ou projet spécifique de recherche).",
        themes: [],
        remarques: "Durée maximale de 6 mois (rédaction incluse). Préalable obligatoire : ETHI 66200(A) (ou en concomitance). Le sujet doit être soumis avant d'avoir cumulé 36 crédits de cours.",
        userRule: "Information fournie par l'étudiant (12 oct. 2026) : le projet peut être réalisé à n'importe quelle session, à condition d'avoir terminé 12 crédits de cours. Le document officiel indique « - » comme période d'offre et ne mentionne pas ce seuil : à confirmer auprès de HEC.",
        creditPrereq: 12,
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: ["ETHI 66200"], prerequisiteRelation: "AND", coreqAllowed: true,
        corequisites: [], exclusions: [], restrictions: "Sujet à soumettre avant 36 crédits de cours cumulés ; 12 crédits de cours terminés requis avant de commencer (information de l'étudiant)"
    },
    // ── 5. Activités fortement recommandées (0 cr) ───────────────────────────
    {
        code: "ATEL 66219",
        name: "Expertise in Info. Research",
        nameFr: "",
        category: "recommandes",
        subject: "Atelier (maîtrise)",
        credits: 0.0,
        period: "Toute l'année",
        mode: NOT_IN_DOC,
        desc: "Séance d'apprentissage à la recherche informationnelle recommandée pour l'ensemble des nouveaux admis à la M. Sc. Notation : Succès / Échec.",
        themes: [],
        remarques: "Cours en anglais : ATEL 66219A. Activité fortement recommandée (0 crédit, non requise pour les 45 crédits).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    },
    {
        code: "ATEL 66242",
        name: "How to Cite your Sources",
        nameFr: "",
        category: "recommandes",
        subject: "Atelier (maîtrise)",
        credits: 0.0,
        period: "Toute l'année",
        mode: NOT_IN_DOC,
        desc: "Atelier sur les normes de citation et d'intégrité académique dans les rapports de recherche. Notation : Succès / Échec.",
        themes: [],
        remarques: "Cours en anglais : ATEL 66242A. Activité fortement recommandée (0 crédit, non requise pour les 45 crédits).",
        status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    }
];

// ───────────────────────────────────────────────────────────────────────────
// Utilitaires de règles académiques
// ───────────────────────────────────────────────────────────────────────────

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function cloneDeep(obj) { return JSON.parse(JSON.stringify(obj)); }

// Date du jour (surchargeable pour les tests : window.__HEC_TODAY__ = "2026-10-12")
function getToday() {
    return (typeof window !== "undefined" && window.__HEC_TODAY__) ? new Date(window.__HEC_TODAY__ + "T12:00:00") : new Date();
}

// Convention de trimestres (non issue du document officiel) : Hiver = janv.–avr., Été = mai–août, Automne = sept.–déc.
function getCurrentTermKey() {
    const d = getToday();
    const m = d.getMonth();
    const letter = m <= 3 ? "H" : (m <= 7 ? "E" : "A");
    return letter + String(d.getFullYear()).slice(-2);
}

// Index du trimestre courant dans SEMESTER_ORDER (−1 : avant le premier trimestre planifiable)
function getCurrentTermIndex() {
    const key = getCurrentTermKey();
    const idx = SEMESTER_ORDER.indexOf(key);
    if (idx !== -1) return idx;
    // Hors plage : avant → −1, après → dernier index
    const y = parseInt(key.slice(1), 10);
    const firstY = parseInt(SEMESTER_ORDER[0].slice(1), 10);
    return y < firstY ? -1 : SEMESTER_ORDER.length - 1;
}

// Offre : lit uniquement ce que le document indique.
//  - « Toute l'année » → tous les trimestres (A, H, E)
//  - liste explicite (« Automne, Hiver ») → seulement ces trimestres
//  - « Au moins une fois par an », « aux deux ans », « - », vide → offre NON confirmée (jamais présumée)
function parseOfferTerms(period) {
    const p = (period || "").toLowerCase();
    if (p.includes("toute l'année")) return { terms: ["A", "H", "E"], explicit: true };
    const terms = [];
    if (p.includes("automne")) terms.push("A");
    if (p.includes("hiver")) terms.push("H");
    if (p.includes("été") || p.includes("ete")) terms.push("E");
    return terms.length ? { terms, explicit: true } : { terms: [], explicit: false };
}

// → "yes" (offert selon le document) | "maybe" (offre non confirmée) | "no" (non offert à ce trimestre)
function getOffer(course, semesterKey) {
    if (!semesterKey) return "yes";
    const offer = parseOfferTerms(course.period);
    if (!offer.explicit) return "maybe";
    return offer.terms.includes(semesterKey.charAt(0)) ? "yes" : "no";
}

// Compatibilité : un trimestre est « valide » s'il n'est pas explicitement exclu.
function isPeriodValidForSemester(course, semesterKey) {
    return getOffer(course, semesterKey) !== "no";
}

// Statut effectif (affichage et calculs) : « planifié » = trimestre futur ; « en cours » = trimestre courant.
function getEffectiveStatus(c) {
    if (c.status === "done") return "done";
    const idx = SEMESTER_ORDER.indexOf(c.semester);
    if (idx !== -1) return idx > getCurrentTermIndex() ? "planned" : "progress";
    return c.status === "progress" ? "progress" : "todo";
}

const STATUS_LABELS = { todo: "À FAIRE", planned: "PLANIFIÉ", progress: "EN COURS", done: "TERMINÉ" };

function findCourse(code) { return courses.find(c => c.code === code); }

function prereqRelation(course) { return course.prerequisiteRelation === "OR" ? "OR" : "AND"; }

// Évalue les préalables d'un cours.
//  - mode "actual" : d'après l'avancement réel (admissibilité maintenant)
//  - mode "plan"   : d'après le trimestre cible (targetIdx) du planificateur
// → { level: "ok" | "cond" | "blocked", missing: [codes], pending: [codes] }
function evaluatePrerequisites(course, mode, targetIdx) {
    const prereqs = course.prerequisites || [];
    if (prereqs.length === 0) return { level: "ok", missing: [], pending: [] };
    const relation = prereqRelation(course);
    const states = prereqs.map(code => {
        const pc = findCourse(code);
        if (!pc) return { code, state: "missing" };
        if (pc.status === "done") return { code, state: "done" };
        const pIdx = SEMESTER_ORDER.indexOf(pc.semester);
        if (mode === "plan") {
            if (pIdx !== -1 && (course.coreqAllowed ? pIdx <= targetIdx : pIdx < targetIdx)) return { code, state: "pending" };
            return { code, state: pIdx !== -1 ? "late" : "missing" };
        }
        const eff = getEffectiveStatus(pc);
        return { code, state: (eff === "progress" || eff === "planned") ? "pending" : "missing" };
    });
    const ok = s => s.state === "done" || s.state === "pending";
    const satisfied = relation === "OR" ? states.some(ok) : states.every(ok);
    const allDone = relation === "OR" ? states.some(s => s.state === "done") : states.every(s => s.state === "done");
    return {
        level: !satisfied ? "blocked" : (allDone ? "ok" : "cond"),
        missing: states.filter(s => !ok(s)).map(s => s.code),
        pending: states.filter(s => s.state === "pending").map(s => s.code)
    };
}

// Préalable en crédits (ex. INDV 66202 : 12 cr de cours terminés). Seuls les cours (hors projet, ateliers) comptent.
//  - mode "actual" : crédits des cours réussis
//  - mode "plan"   : crédits des cours réussis ou placés dans un trimestre STRICTEMENT antérieur à targetIdx
// → { required, have, ok } ; required = 0 si le cours n'a pas ce préalable
function evaluateCreditPrereq(course, mode, targetIdx) {
    const required = course.creditPrereq || 0;
    if (!required) return { required: 0, have: 0, ok: true };
    let have = 0;
    courses.forEach(c => {
        if (c === course || !["tronc", "noyau", "options", "choix"].includes(c.category) || !(c.credits > 0)) return;
        if (c.status === "done") { have += c.credits; return; }
        if (mode === "plan") {
            const i = SEMESTER_ORDER.indexOf(c.semester);
            if (i !== -1 && i < targetIdx) have += c.credits;
        }
    });
    return { required, have, ok: have >= required };
}

function hasCreditPrereq(course) { return !!course.creditPrereq; }

function describePrerequisites(course) {
    const prereqs = course.prerequisites || [];
    const credit = course.creditPrereq ? `${course.creditPrereq} crédits de cours terminés` : "";
    if (prereqs.length === 0) return credit ? `${credit} (information de l'étudiant)` : "Aucun préalable de cours dans le document officiel";
    const joiner = prereqRelation(course) === "OR" ? " ou " : " et ";
    let txt = prereqs.join(joiner) + (prereqRelation(course) === "OR" ? " (un seul suffit)" : "");
    if (course.coreqAllowed) txt += " — peut être suivi en concomitance";
    if (credit) txt += `; et ${credit} (information de l'étudiant)`;
    return txt;
}

// Cours présents dans le parcours (réussis, en cours ou planifiés) qui sont exclus par `course`
function findExclusionConflicts(course) {
    return (course.exclusions || []).filter(code => {
        const other = findCourse(code);
        return other && getEffectiveStatus(other) !== "todo";
    });
}

// Admissibilité actuelle d'un cours (affichage catalogue / fiche)
function getEligibility(course) {
    const conflicts = findExclusionConflicts(course);
    if (conflicts.length) return { level: "excluded", text: `Non admissible : exclusion avec ${conflicts.join(", ")}`, conflicts };
    const ev = evaluatePrerequisites(course, "actual");
    const cp = evaluateCreditPrereq(course, "actual");
    if (ev.level === "blocked") return { level: "blocked", text: `Préalable manquant : ${course.prerequisites.length > 1 && prereqRelation(course) === "OR" ? "l'un de " : ""}${ev.missing.join(prereqRelation(course) === "OR" ? " / " : ", ")}${cp.ok ? "" : ` ; crédits de cours terminés : ${cp.have.toFixed(1)}/${cp.required}`}`, ev };
    if (!cp.ok) {
        // Crédits encore insuffisants : « sous condition » si les cours en cours / planifiés suffiront, sinon bloqué
        const future = courses.filter(c => c !== course && ["tronc", "noyau", "options", "choix"].includes(c.category) && c.status !== "done" && getEffectiveStatus(c) !== "todo").reduce((s, c) => s + c.credits, 0);
        const txt = `${cp.have.toFixed(1)}/${cp.required} cr de cours terminés`;
        if (cp.have + future >= cp.required) return { level: "cond", text: `Admissible sous condition : ${txt} (les cours en cours ou planifiés permettront d'atteindre ${cp.required} cr)`, credit: cp };
        return { level: "blocked", text: `Crédits insuffisants : ${txt}`, credit: cp };
    }
    if (ev.level === "cond") return { level: "cond", text: `Admissible sous condition (préalable en cours ou planifié : ${ev.pending.join(", ")})`, ev };
    return { level: "ok", text: (course.prerequisites.length || course.creditPrereq) ? "Admissible (préalables réussis)" : "Aucun préalable de cours", ev };
}

// Les « débloque » sont calculés à partir des préalables (plus de liste manuelle à maintenir).
function recomputeUnlocks() {
    courses.forEach(c => { c.unlocks = []; });
    courses.forEach(c => {
        (c.prerequisites || []).forEach(p => {
            const pc = findCourse(p);
            if (pc && !pc.unlocks.includes(c.code)) pc.unlocks.push(c.code);
        });
    });
}

let courses = [];
let archivedCourses = [];
let dataIssues = [];
let startupNotices = [];
let currentFilter = "all";
let currentSelectedCourseCode = null;
let sidebarPinned = false;
let sidebarCollapsed = false;

// On Page Load
document.addEventListener("DOMContentLoaded", () => {
    const verEl = document.getElementById("app-version");
    if (verEl) verEl.textContent = `${APP_VERSION} (${APP_VERSION_DATE})`;
    loadData();
    initSidebarNavigation();
    initSidebarControls();
    initMilestonesChecklist();
    renderAll();
    flushStartupNotices();
});

function flushStartupNotices() {
    startupNotices.forEach((n, i) => setTimeout(() => showNotification(n.msg, n.type || "success"), 400 + i * 600));
    startupNotices = [];
}

// ─── Accès sécurisé au stockage local ─────────────────────────────────────────
function storageGet(key) { try { return localStorage.getItem(STORAGE_NS + key); } catch (e) { return null; } }
function storageSet(key, value) { try { localStorage.setItem(STORAGE_NS + key, value); return true; } catch (e) { return false; } }
function storageRemove(key) { try { localStorage.removeItem(STORAGE_NS + key); } catch (e) { /* ignore */ }  }

// ─── Normalisation des données personnelles ───────────────────────────────────
const VALID_STATUSES = ["todo", "progress", "done"];
function statusRank(s) { return s === "done" ? 3 : (s === "progress" ? 2 : 1); }

// Copie UNIQUEMENT les données personnelles (statut, note, trimestre, notes) — jamais la structure du cours.
function applyPersonal(target, raw) {
    if (VALID_STATUSES.includes(raw.status)) target.status = raw.status;
    if (typeof raw.grade === "string") target.grade = raw.grade;
    if (typeof raw.semester === "string") target.semester = raw.semester;
    if (typeof raw.notes === "string") target.notes = raw.notes;
}

// Cours ajouté manuellement par l'utilisateur : conservé tel quel, avec champs manquants complétés.
function normalizeCustomCourse(raw) {
    const c = Object.assign({
        name: raw.code, nameFr: "", subject: "", category: "options", credits: 3.0, period: "", mode: "Présentiel",
        desc: "", themes: [], remarques: "", status: "todo", grade: "", semester: "", notes: "",
        prerequisites: [], corequisites: [], exclusions: [], restrictions: ""
    }, cloneDeep(raw));
    c.custom = true;
    c.credits = Number.isFinite(parseFloat(c.credits)) ? parseFloat(c.credits) : 0;
    if (!CATEGORY_LABELS[c.category]) c.category = "options";
    if (!VALID_STATUSES.includes(c.status)) c.status = "todo";
    ["themes", "prerequisites", "corequisites", "exclusions"].forEach(k => { if (!Array.isArray(c[k])) c[k] = []; });
    delete c.unlocks;
    return c;
}

// ─── Archive des cours hors programme (aucune donnée n'est détruite) ──────────
function loadArchive() {
    const raw = storageGet(STORAGE_KEYS.archive);
    if (!raw) return [];
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch (e) { return []; }
}

function saveArchive() { storageSet(STORAGE_KEYS.archive, JSON.stringify(archivedCourses)); }

function archiveCourse(raw, reason) {
    const code = CODE_ALIASES[raw.code] || raw.code;
    const entry = {
        code,
        name: raw.name || code,
        credits: Number.isFinite(parseFloat(raw.credits)) ? parseFloat(raw.credits) : 3.0,
        category: raw.category || "",
        profile: raw.profile || "",
        status: VALID_STATUSES.includes(raw.status) ? raw.status : "todo",
        grade: typeof raw.grade === "string" ? raw.grade : "",
        semester: typeof raw.semester === "string" ? raw.semester : "",
        notes: typeof raw.notes === "string" ? raw.notes : "",
        archivedOn: new Date().toISOString().slice(0, 10),
        reason
    };
    const idx = archivedCourses.findIndex(a => a.code === code);
    if (idx === -1) archivedCourses.push(entry);
    else if (statusRank(entry.status) > statusRank(archivedCourses[idx].status)) archivedCourses[idx] = entry;
    return code;
}

const ARCHIVE_REASON = "Absent de la structure officielle du M. Sc. Intelligence d'affaires (2026-2027)";

// Fusionne les données enregistrées avec le catalogue officiel :
//  - la structure (nom, crédits, catégorie, préalables…) vient TOUJOURS du catalogue officiel ;
//  - les données personnelles (statut, note, trimestre, notes) sont conservées ;
//  - les cours hors programme sont archivés ; les cours ajoutés manuellement sont conservés.
function mergeSavedWithCatalog(list) {
    const result = cloneDeep(DEFAULT_COURSES);
    const byCode = new Map(result.map(c => [c.code, c]));
    const touched = new Map();
    const customs = new Map();
    const archivedNow = [];

    list.forEach(raw => {
        if (!raw || typeof raw.code !== "string") return;
        const originalCode = raw.code.trim();
        const code = CODE_ALIASES[originalCode] || originalCode;
        if (byCode.has(code)) {
            const prev = touched.get(code);
            if (prev) {
                // Ne signale un doublon que si les deux entrées portent réellement des données personnelles
                const meaningful = r => r.status !== "todo" || r.semester || r.grade || r.notes;
                if (meaningful(prev) && meaningful(raw)) dataIssues.push(`Doublon détecté pour ${code} : la version la plus avancée a été conservée.`);
                if (statusRank(prev.status) >= statusRank(raw.status) && (meaningful(prev) || !meaningful(raw))) return;
            }
            touched.set(code, raw);
            applyPersonal(byCode.get(code), raw);
        } else if (OUT_OF_PROGRAM_CODES.includes(code)) {
            archivedNow.push(archiveCourse(raw, ARCHIVE_REASON));
        } else {
            const prev = customs.get(code);
            if (prev) {
                dataIssues.push(`Doublon détecté pour ${code} : la version la plus avancée a été conservée.`);
                if (statusRank(prev.status) >= statusRank(raw.status)) return;
            }
            customs.set(code, normalizeCustomCourse(raw));
        }
    });
    customs.forEach(c => result.push(c));

    if (archivedNow.length) {
        startupNotices.push({
            type: "success",
            msg: `<strong>${archivedNow.length} cours hors programme archivés</strong> (${archivedNow.join(", ")}). Vos données sont conservées : Paramètres → Cours archivés.`
        });
    }
    return result;
}

// Restaure dans le catalogue les cours archivés dont le code figure (ou figure désormais) dans la structure officielle.
// Les données personnelles ne sont recopiées que si la fiche du catalogue est encore vierge (jamais d'écrasement).
function restoreArchivedIntoCatalog() {
    const restored = [];
    archivedCourses = archivedCourses.filter(a => {
        const target = findCourse(CODE_ALIASES[a.code] || a.code);
        if (!target) return true;
        const blank = target.status === "todo" && !target.semester && !target.grade && !target.notes;
        if (!blank) return true;
        applyPersonal(target, a);
        restored.push(target.code);
        return false;
    });
    return restored;
}

// Load from LocalStorage or initialize default
function loadData() {
    dataIssues = [];
    archivedCourses = loadArchive();

    const saved = storageGet(STORAGE_KEYS.courses);
    const schema = parseInt(storageGet(STORAGE_KEYS.schema) || "1", 10);
    let list = null;

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) list = parsed;
        } catch (e) { /* géré ci-dessous */ }
        if (!list) {
            storageSet(STORAGE_KEYS.corruptBackup, saved);
            startupNotices.push({ type: "error", msg: "<strong>Données locales illisibles.</strong> Une copie brute a été conservée. Importez votre dernière sauvegarde JSON (Paramètres)." });
        }
    }

    if (list) {
        // Copie de sécurité avant la première migration vers la structure officielle
        if (schema < SCHEMA_VERSION) storageSet(STORAGE_KEYS.preMigrationBackup, saved);
        courses = mergeSavedWithCatalog(list);
    } else {
        courses = cloneDeep(DEFAULT_COURSES);
    }

    const restoredNow = restoreArchivedIntoCatalog();
    if (restoredNow.length) {
        startupNotices.push({ type: "success", msg: `<strong>${restoredNow.length} cours remis dans votre parcours</strong> (${restoredNow.join(", ")}) : ils appartiennent bien à la structure officielle (profil Sciences de la décision). Statuts, notes et trimestres ont été conservés.` });
    }
    recomputeUnlocks();
    saveArchive();
    storageSet(STORAGE_KEYS.schema, String(SCHEMA_VERSION));

    // Réglages
    const projInput = document.getElementById("project-start-date");
    const savedProjDate = storageGet(STORAGE_KEYS.projectStart);
    if (projInput) projInput.value = savedProjDate || getToday().toISOString().split("T")[0];
    const gpaInput = document.getElementById("target-gpa");
    const yearInput = document.getElementById("target-year");
    if (gpaInput && storageGet(STORAGE_KEYS.targetGpa)) gpaInput.value = storageGet(STORAGE_KEYS.targetGpa);
    if (yearInput && storageGet(STORAGE_KEYS.targetYear)) yearInput.value = storageGet(STORAGE_KEYS.targetYear);
}

// Save to LocalStorage
function saveData() {
    storageSet(STORAGE_KEYS.courses, JSON.stringify(courses));
    const proj = document.getElementById("project-start-date");
    if (proj) storageSet(STORAGE_KEYS.projectStart, proj.value);
    const gpa = document.getElementById("target-gpa");
    if (gpa) storageSet(STORAGE_KEYS.targetGpa, gpa.value);
    const year = document.getElementById("target-year");
    if (year) storageSet(STORAGE_KEYS.targetYear, year.value);
    saveArchive();
}

// ─── Export / Import pour la portabilité entre environnements ─────────────────

function buildSnapshot() {
    return {
        _version: 2,
        _exported: new Date().toISOString(),
        _program: PROGRAM.title + " (" + PROGRAM.year + ")",
        courses: courses.map(c => c.custom
            ? Object.assign(cloneDeep(c), { unlocks: undefined })
            : { code: c.code, status: c.status, grade: c.grade, semester: c.semester, notes: c.notes }),
        archivedCourses: cloneDeep(archivedCourses),
        projectStart: document.getElementById("project-start-date")?.value || "",
        targetGpa: document.getElementById("target-gpa")?.value || "4.00",
        targetYear: document.getElementById("target-year")?.value || "2027",
        milestones: {
            ethi:  document.getElementById("chk-ethi")?.checked  || false,
            sujet: document.getElementById("chk-sujet")?.checked || false,
            redac: document.getElementById("chk-redac")?.checked || false,
            sout:  document.getElementById("chk-sout")?.checked  || false
        }
    };
}

function downloadJson(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportData() {
    const dateStr = getToday().toISOString().slice(0, 10);
    downloadJson(buildSnapshot(), `hec_msc_sauvegarde_${dateStr}.json`);
    showImportFeedback("✅ Données exportées avec succès !", "success");
}

// Applique un instantané (export JSON) : fusionne les données personnelles, archive ce qui est hors programme.
function importSnapshot(snapshot) {
    const report = { merged: 0, archived: [], custom: [], skipped: 0 };

    snapshot.courses.forEach(saved => {
        if (!saved || typeof saved.code !== "string") { report.skipped++; return; }
        const code = CODE_ALIASES[saved.code.trim()] || saved.code.trim();
        const target = findCourse(code);
        if (target) {
            applyPersonal(target, saved);
            report.merged++;
        } else if (OUT_OF_PROGRAM_CODES.includes(code)) {
            report.archived.push(archiveCourse(saved, ARCHIVE_REASON));
        } else if (saved.name && saved.credits !== undefined) {
            courses.push(normalizeCustomCourse(saved));
            report.custom.push(code);
        } else {
            report.archived.push(archiveCourse(saved, "Code absent du catalogue officiel (import)"));
        }
    });

    if (Array.isArray(snapshot.archivedCourses)) {
        snapshot.archivedCourses.forEach(a => {
            if (a && typeof a.code === "string" && !findCourse(a.code)) archiveCourse(a, a.reason || ARCHIVE_REASON);
        });
    }

    report.restored = restoreArchivedIntoCatalog();
    recomputeUnlocks();
    return report;
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const snapshot = JSON.parse(e.target.result);

            if (!snapshot.courses || !Array.isArray(snapshot.courses)) {
                showImportFeedback("❌ Fichier invalide : format non reconnu.", "error");
                return;
            }

            // Copie de sécurité de l'état actuel avant d'importer
            storageSet(STORAGE_KEYS.preImportBackup, JSON.stringify(buildSnapshot()));

            const report = importSnapshot(snapshot);

            // Restore settings
            if (snapshot.projectStart && document.getElementById("project-start-date")) {
                document.getElementById("project-start-date").value = snapshot.projectStart;
            }
            if (snapshot.targetGpa && document.getElementById("target-gpa")) {
                document.getElementById("target-gpa").value = snapshot.targetGpa;
            }
            if (snapshot.targetYear && document.getElementById("target-year")) {
                document.getElementById("target-year").value = snapshot.targetYear;
            }

            // Restore project milestones (et les persister)
            if (snapshot.milestones) {
                ["ethi", "sujet", "redac", "sout"].forEach(key => {
                    const el = document.getElementById(`chk-${key}`);
                    if (el && snapshot.milestones[key] !== undefined) {
                        el.checked = !!snapshot.milestones[key];
                        storageSet(`hec_milestone_${key}`, el.checked ? "true" : "false");
                    }
                });
            }

            saveData();
            renderAll();
            if (window.lucide) lucide.createIcons();

            const exportedOn = snapshot._exported
                ? ` (exporté le ${new Date(snapshot._exported).toLocaleDateString("fr-CA")})`
                : "";
            const extra = report.archived.length ? ` ${report.archived.length} cours hors programme archivés (${report.archived.join(", ")}).` : "";
            showImportFeedback(`✅ Données importées avec succès${exportedOn} !${extra}`, "success");
        } catch (err) {
            showImportFeedback("❌ Erreur lors de la lecture du fichier : " + err.message, "error");
        }

        // Reset the file input so the same file can be imported again if needed
        event.target.value = "";
    };
    reader.readAsText(file);
}

function showImportFeedback(message, type) {
    const el = document.getElementById("import-feedback");
    if (!el) return;
    el.textContent = message;
    el.className = "import-feedback " + (type === "success" ? "import-ok" : "import-err");
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 8000);
}

// Reset all data to factory defaults (une sauvegarde JSON est téléchargée avant l'effacement)
function resetToDefault() {
    if (!confirm("⚠️ Réinitialiser toutes vos données académiques (statuts, notes, trimestres, cours archivés) ?\n\nUne sauvegarde JSON sera téléchargée automatiquement avant l'effacement.")) return;
    exportData();
    [STORAGE_KEYS.courses, STORAGE_KEYS.projectStart, STORAGE_KEYS.targetGpa, STORAGE_KEYS.targetYear, STORAGE_KEYS.archive,
        "hec_milestone_ethi", "hec_milestone_sujet", "hec_milestone_redac", "hec_milestone_sout", "hec_milestones"].forEach(storageRemove);
    ["target-gpa"].forEach(id => { const el = document.getElementById(id); if (el) el.value = "4.00"; });
    const y = document.getElementById("target-year"); if (y) y.value = "2027";
    loadData();
    initMilestonesChecklist();
    renderAll();
    showNotification("Données réinitialisées. Une sauvegarde a été téléchargée.");
}

// ─── Cours archivés (hors programme) ──────────────────────────────────────────
function renderArchive() {
    const box = document.getElementById("archive-container");
    if (!box) return;
    if (archivedCourses.length === 0) {
        box.innerHTML = `<p class="text-secondary">Aucun cours archivé.</p>`;
    } else {
        box.innerHTML = archivedCourses.map(a => {
            const sem = SEMESTERS[a.semester] || a.semester || "—";
            const stLabel = { todo: "À faire", progress: "En cours", done: "Terminé" }[a.status] || a.status;
            return `<div class="archive-item">
                <div class="archive-main">
                    <span class="archive-code">${escapeHtml(a.code)}</span>
                    <span class="archive-name">${escapeHtml(a.name)}</span>
                    <span class="archive-meta">${Number(a.credits).toFixed(1)} cr · ${stLabel} · ${escapeHtml(sem)}${a.grade ? " · note " + escapeHtml(a.grade) : ""}</span>
                    ${a.notes ? `<span class="archive-meta">Notes : ${escapeHtml(a.notes)}</span>` : ""}
                    <span class="archive-meta">${escapeHtml(a.reason || "")} — archivé le ${escapeHtml(a.archivedOn || "")}</span>
                </div>
                <div class="archive-actions">
                    <button class="btn btn-outline" onclick="restoreArchivedAsChoice('${escapeHtml(a.code)}')" title="Reclasser ce cours comme cours au choix (max. 3 crédits)">Cours au choix</button>
                    <button class="btn btn-outline" onclick="deleteArchived('${escapeHtml(a.code)}')" title="Supprimer définitivement">Supprimer</button>
                </div>
            </div>`;
        }).join("");
    }
    const bk = document.getElementById("pre-migration-backup-row");
    if (bk) bk.style.display = storageGet(STORAGE_KEYS.preMigrationBackup) ? "block" : "none";
}

function choixCreditsUsed() {
    return courses.filter(c => c.category === "choix").reduce((s, c) => s + c.credits, 0);
}

// Reclasse un cours archivé comme « cours au choix » (document : max. 3 crédits, 2e cycle HEC / campus international,
// ou une autre université avec approbation du responsable de spécialisation).
function restoreArchivedAsChoice(code) {
    const a = archivedCourses.find(x => x.code === code);
    if (!a) return;
    if (a.credits > PROGRAM.required.choixMax || choixCreditsUsed() + a.credits > PROGRAM.required.choixMax) {
        showNotification(`<strong>Impossible</strong> : le programme n'admet que ${PROGRAM.required.choixMax} crédits de cours au choix (déjà utilisés : ${choixCreditsUsed().toFixed(1)} cr).`, "error");
        return;
    }
    if (findCourse(code)) { showNotification("Un cours avec ce code existe déjà.", "error"); return; }
    courses.push(normalizeCustomCourse({
        code: a.code, name: a.name, category: "choix", credits: a.credits, period: "", mode: NOT_IN_DOC,
        desc: "Cours au choix (reclassé depuis les cours archivés). Admissibilité à confirmer : cours de 2e cycle ou campus international à HEC Montréal, ou autre université avec approbation préalable du responsable de spécialisation.",
        remarques: "Admissibilité comme cours au choix à valider auprès de HEC.",
        status: a.status, grade: a.grade, semester: a.semester, notes: a.notes
    }));
    archivedCourses = archivedCourses.filter(x => x.code !== code);
    recomputeUnlocks();
    renderAll();
    showNotification(`<strong>${escapeHtml(code)}</strong> reclassé comme cours au choix. Vérifiez son admissibilité auprès de HEC.`);
}

function deleteArchived(code) {
    const a = archivedCourses.find(x => x.code === code);
    if (!a) return;
    if (!confirm(`Supprimer définitivement ${code} (${a.name}) et ses données personnelles ?\n\nUne sauvegarde JSON sera téléchargée avant la suppression.`)) return;
    exportData();
    archivedCourses = archivedCourses.filter(x => x.code !== code);
    saveData();
    renderArchive();
}

function downloadPreMigrationBackup() {
    const raw = storageGet(STORAGE_KEYS.preMigrationBackup);
    if (!raw) { showNotification("Aucune copie de sécurité disponible.", "error"); return; }
    let payload;
    try { payload = JSON.parse(raw); } catch (e) { payload = { raw }; }
    downloadJson({ _note: "Copie brute des données avant la migration vers la structure officielle", data: payload },
        `hec_msc_copie_avant_migration_${getToday().toISOString().slice(0, 10)}.json`);
}

// Sidebar View Navigation Swapping
function initSidebarNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const targetSectionId = item.getAttribute("data-target");
            const sections = document.querySelectorAll(".app-section");
            sections.forEach(sec => sec.classList.remove("active"));

            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add("active");
                if (targetSectionId === "section-tree") {
                    setTimeout(drawTreeConnections, 100);
                }
            }
        });
    });
}

function navigateToSection(sectionId) {
    const navItem = document.querySelector(`.nav-item[data-target="${sectionId}"]`);
    if (navItem) {
        navItem.click();
    }
}

function initSidebarControls() {
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    const pinBtn = document.getElementById("sidebar-pin-btn");

    if (collapseBtn) {
        collapseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleSidebarCollapse();
        });
    }

    if (pinBtn) {
        pinBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleSidebarPin();
        });
    }

    loadSidebarState();
}

function loadSidebarState() {
    sidebarPinned = storageGet("hec_sidebar_pinned") === "true";
    sidebarCollapsed = storageGet("hec_sidebar_collapsed") === "true";

    if (sidebarPinned) {
        sidebarCollapsed = false;
    }

    applySidebarState();
}

function saveSidebarState() {
    storageSet("hec_sidebar_pinned", sidebarPinned ? "true" : "false");
    storageSet("hec_sidebar_collapsed", sidebarCollapsed ? "true" : "false");
}

function toggleSidebarCollapse() {
    if (sidebarPinned) {
        sidebarPinned = false;
    }

    sidebarCollapsed = !sidebarCollapsed;
    saveSidebarState();
    applySidebarState();
}

function toggleSidebarPin() {
    sidebarPinned = !sidebarPinned;

    if (sidebarPinned) {
        sidebarCollapsed = false;
    }

    saveSidebarState();
    applySidebarState();
}

function applySidebarState() {
    document.body.classList.toggle("sidebar-collapsed", sidebarCollapsed && !sidebarPinned);
    document.body.classList.toggle("sidebar-pinned", sidebarPinned);
    updateSidebarButtons();
}

function updateSidebarButtons() {
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    const pinBtn = document.getElementById("sidebar-pin-btn");

    if (collapseBtn) {
        collapseBtn.title = sidebarCollapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale";
        collapseBtn.innerHTML = `<i data-lucide="${sidebarCollapsed ? "chevrons-right" : "chevrons-left"}"></i>`;
    }

    if (pinBtn) {
        pinBtn.title = sidebarPinned ? "Désépingler la barre latérale" : "Épingler la barre latérale";
        pinBtn.classList.toggle("active", sidebarPinned);
        pinBtn.innerHTML = `<i data-lucide="pin"></i>`;
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

// GPA conversion weights (échelle propre à l'application — non issue du document officiel du programme)
const HEC_GPA_MAP = {
    "A+": 4.3, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "F": 0.0
};

function fmtCr(n) { return (Math.round(n * 10) / 10).toFixed(1); }

// ─── Calcul de progression : crédits réussis / en cours / planifiés / restants ─
// Règles (document officiel) : 45 cr = 3 (tronc) + 15 (noyau) + 9 (projet) + 18 « libres »
// (options : minimum 15 cr ; cours au choix : maximum 3 cr). Les crédits au-delà de ces plafonds
// sont signalés comme excédentaires et NE SONT PAS comptés vers les 45 cr.
function computeProgress() {
    const R = PROGRAM.required;
    const caps = { tronc: R.tronc, noyau: R.noyau, projet: R.projet };
    const cats = ["tronc", "noyau", "options", "projet", "choix"];
    const buckets = ["done", "progress", "planned"];

    const byCat = {};
    cats.forEach(cat => { byCat[cat] = { done: 0, progress: 0, planned: 0 }; });
    const counted = { done: 0, progress: 0, planned: 0 };
    const used = { tronc: 0, noyau: 0, projet: 0, elective: 0, choix: 0 };
    const excess = [];
    const unverifiedCounted = [];
    const byProfile = {};

    buckets.forEach(b => {
        courses.forEach(c => {
            if (getEffectiveStatus(c) !== b || !(c.credits > 0)) return;
            const cat = c.category;
            let ok;
            if (!cats.includes(cat)) { excess.push({ code: c.code, category: cat, credits: c.credits, bucket: b }); return; }
            if (caps[cat] !== undefined) {
                ok = Math.max(0, Math.min(c.credits, caps[cat] - used[cat]));
                used[cat] += ok;
            } else if (cat === "options") {
                ok = Math.max(0, Math.min(c.credits, PROGRAM.electivePool - used.elective));
                used.elective += ok;
            } else { // choix
                ok = Math.max(0, Math.min(c.credits, R.choixMax - used.choix, PROGRAM.electivePool - used.elective));
                used.choix += ok;
                used.elective += ok;
            }
            byCat[cat][b] += ok;
            counted[b] += ok;
            if (ok < c.credits) excess.push({ code: c.code, category: cat, credits: c.credits - ok, bucket: b });
            if (ok > 0 && c.unverified && c.unverified.includes("credits")) unverifiedCounted.push(c.code);
            if (cat === "options" && c.profile) {
                byProfile[c.profile] = byProfile[c.profile] || { done: 0, progress: 0, planned: 0 };
                byProfile[c.profile][b] += ok;
            }
        });
    });

    const sum = o => o.done + o.progress + o.planned;
    const total = counted.done + counted.progress + counted.planned;
    return {
        byCat, counted, excess, byProfile, unverifiedCounted,
        total,
        remaining: Math.max(0, PROGRAM.totalCredits - total),
        optionsAll: sum(byCat.options),
        electiveAll: sum(byCat.options) + sum(byCat.choix),
        sum
    };
}

// ─── Rendering global ─────────────────────────────────────────────────────────
function renderAll() {
    recomputeUnlocks();
    renderDashboardStats();
    renderCourseCatalog();
    renderSessionPlanner();
    renderTreeNodesHighlight();
    calculateProjectTimeline();
    drawTreeConnections();
    updateFinancialStats();
    renderValidation();
    renderArchive();
    if (typeof renderPlannerAdvice === "function") renderPlannerAdvice();
    saveData();
    if (window.lucide) lucide.createIcons();
}

function setHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function setText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }

function updateFinancialStats() {
    const p = computeProgress();
    const unit = `<span style="font-size: 0.85rem; color: var(--text-secondary);">`;
    const currentCost = p.counted.progress * COST_PER_CREDIT;
    const remainingCost = Math.max(0, PROGRAM.totalCredits - p.counted.done - p.counted.progress) * COST_PER_CREDIT;
    const money = v => `${v.toLocaleString("fr-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} $`;
    const costNote = `Estimation à ${COST_PER_CREDIT} $/crédit (paramètre de l'application, non issu du document officiel)`;

    ["db", "pl"].forEach(prefix => {
        setHtml(`${prefix}-fin-credits-done`, `${fmtCr(p.counted.done)} ${unit}/ ${PROGRAM.totalCredits} cr</span>`);
        setHtml(`${prefix}-fin-credits-progress`, `${fmtCr(p.counted.progress)} ${unit}cr</span>`);
        setHtml(`${prefix}-fin-credits-planned`, `${fmtCr(p.counted.planned)} ${unit}cr</span>`);
        const plEl = document.getElementById(`${prefix}-fin-credits-planned`); if (plEl) plEl.title = `Reste ${fmtCr(p.remaining)} cr à planifier pour atteindre ${PROGRAM.totalCredits} cr`;
        setText(`${prefix}-fin-cost-current`, money(currentCost));
        setText(`${prefix}-fin-cost-remaining`, money(remainingCost));
        ["cost-current", "cost-remaining"].forEach(k => { const el = document.getElementById(`${prefix}-fin-${k}`); if (el) el.title = costNote; });
    });
}

function getProfileStyles(c) {
    let catLabel = "Option de Spécialisation";
    let badgeStyle = "background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.25);";
    let borderStyle = "border-left: 4px solid #10b981;";

    if (c.category === "tronc") {
        catLabel = "Obligatoire Programme";
        badgeStyle = "background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.25);";
        borderStyle = "border-left: 4px solid #a855f7;";
    } else if (c.category === "noyau") {
        catLabel = "Obligatoire Spécialisation";
        badgeStyle = "background: rgba(59, 130, 246, 0.12); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.25);";
        borderStyle = "border-left: 4px solid #3b82f6;";
    } else if (c.category === "projet") {
        catLabel = "Activité Obligatoire";
        badgeStyle = "background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.25);";
        borderStyle = "border-left: 4px solid #f59e0b;";
    } else if (c.category === "recommandes") {
        catLabel = "Activité Recommandée";
        badgeStyle = "background: rgba(244, 114, 182, 0.15); color: #f472b6; border: 1px solid rgba(244, 114, 182, 0.25);";
        borderStyle = "border-left: 4px solid #ec4899;";
    } else if (c.category === "choix") {
        catLabel = "Cours au choix";
        badgeStyle = "background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3);";
        borderStyle = "border-left: 4px solid #94a3b8;";
    } else if (c.category === "options" || c.profile) {
        if (c.profile === "Marketing") {
            catLabel = "Option Marketing";
            badgeStyle = "background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3);";
            borderStyle = "border-left: 4px solid #f43f5e;";
        } else if (c.profile === "Sciences de la décision") {
            catLabel = "Option Décision";
            badgeStyle = "background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3);";
            borderStyle = "border-left: 4px solid #06b6d4;";
        } else if (c.profile === "Technologies de l'information") {
            catLabel = "Option TI";
            badgeStyle = "background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);";
            borderStyle = "border-left: 4px solid #10b981;";
        }
    }

    return { catLabel, badgeStyle, borderStyle };
}

// Classe CSS de catégorie/profil partagée par catalogue, pool et planificateur
function getCategoryClass(c) {
    if (c.category === "tronc") return "cat-tronc";
    if (c.category === "noyau") return "cat-noyau";
    if (c.category === "projet") return "cat-projet";
    if (c.category === "recommandes") return "cat-recommandes";
    if (c.category === "choix") return "cat-choix";
    if (c.profile === "Marketing") return "prof-marketing";
    if (c.profile === "Sciences de la décision") return "prof-decision";
    if (c.profile === "Technologies de l'information") return "prof-ti";
    return "";
}

function getCategoryLabel(c) {
    if (c.category === "options" && c.profile) return c.profile;
    return CATEGORY_LABELS[c.category] || getProfileStyles(c).catLabel;
}

function renderDashboardStats() {
    const p = computeProgress();
    const R = PROGRAM.required;

    // GPA calculations
    let weightedGpaSum = 0;
    let gradedCreditsCount = 0;
    let completedCoursesCount = 0, currentCoursesCount = 0, plannedCoursesCount = 0;

    courses.forEach(c => {
        const st = getEffectiveStatus(c);
        if (st === "done") {
            completedCoursesCount++;
            if (c.grade && HEC_GPA_MAP[c.grade] !== undefined && c.credits > 0) {
                weightedGpaSum += (HEC_GPA_MAP[c.grade] * c.credits);
                gradedCreditsCount += c.credits;
            }
        } else if (st === "progress") currentCoursesCount++;
        else if (st === "planned") plannedCoursesCount++;
    });

    // Anneau de progression : crédits réussis / 45
    const progressPercent = Math.min((p.counted.done / PROGRAM.totalCredits) * 100, 100);
    const circle = document.getElementById("global-progress");
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference - (progressPercent / 100) * circumference;
    }

    setText("total-credits", fmtCr(p.counted.done).replace(/\.0$/, ""));
    setText("completed-courses", `${completedCoursesCount} cours`);
    setText("current-courses", `${currentCoursesCount} en cours`);
    setText("planned-courses", `${plannedCoursesCount} planifiés`);

    // Barre empilée : réussis / en cours / planifiés / restants
    const pct = v => `${Math.min(100, (v / PROGRAM.totalCredits) * 100)}%`;
    const stackDone = document.getElementById("stack-done"); if (stackDone) stackDone.style.width = pct(p.counted.done);
    const stackProg = document.getElementById("stack-progress"); if (stackProg) stackProg.style.width = pct(p.counted.progress);
    const stackPlan = document.getElementById("stack-planned"); if (stackPlan) stackPlan.style.width = pct(p.counted.planned);
    setText("stack-legend-done", `${fmtCr(p.counted.done)} réussis`);
    setText("stack-legend-progress", `${fmtCr(p.counted.progress)} en cours`);
    setText("stack-legend-planned", `${fmtCr(p.counted.planned)} planifiés`);
    setText("stack-legend-remaining", `${fmtCr(p.remaining)} restants`);

    // Répartition par catégorie : réussis / exigence (+ en cours, + planifiés)
    const frac = (id, cat, required, suffix) => {
        const b = p.byCat[cat];
        let html = `${fmtCr(b.done).replace(/\.0$/, "")}/${required}${suffix || ""} cr`;
        const extras = [];
        if (b.progress > 0) extras.push(`+${fmtCr(b.progress).replace(/\.0$/, "")} en cours`);
        if (b.planned > 0) extras.push(`+${fmtCr(b.planned).replace(/\.0$/, "")} plan.`);
        if (extras.length) html += ` <small class="frac-extra">${extras.join(" · ")}</small>`;
        setHtml(id, html);
    };
    frac("frac-tronc", "tronc", R.tronc);
    frac("frac-noyau", "noyau", R.noyau);
    frac("frac-options", "options", R.optionsMin, " min.");
    frac("frac-choix", "choix", R.choixMax, " max.");
    frac("frac-projet", "projet", R.projet);

    const recomDone = courses.filter(c => c.category === "recommandes" && c.status === "done").length;
    const recomTotal = courses.filter(c => c.category === "recommandes").length;
    setText("frac-recommandes", `${recomDone}/${recomTotal} atel.`);

    // Options par profil (les 15 cr minimum se répartissent librement entre les profils)
    const profBar = (barId, textId, profile) => {
        const b = p.byProfile[profile] || { done: 0, progress: 0, planned: 0 };
        const bar = document.getElementById(barId);
        if (bar) bar.style.width = `${Math.min((b.done / R.optionsMin) * 100, 100)}%`;
        const extra = (b.progress + b.planned) > 0 ? ` (+${fmtCr(b.progress + b.planned).replace(/\.0$/, "")})` : "";
        setText(textId, `${fmtCr(b.done).replace(/\.0$/, "")} cr${extra}`);
    };
    profBar("prof-mkt-bar", "prof-mkt-text", "Marketing");
    profBar("prof-scd-bar", "prof-scd-text", "Sciences de la décision");
    profBar("prof-ti-bar", "prof-ti-text", "Technologies de l'information");
    setText("prof-total-text", `Options : ${fmtCr(p.byCat.options.done).replace(/\.0$/, "")} réussis · ${fmtCr(p.optionsAll).replace(/\.0$/, "")} au total (réussis + en cours + planifiés) / ${R.optionsMin} cr minimum`);

    // Calculated GPA display
    const calculatedGpa = gradedCreditsCount > 0 ? (weightedGpaSum / gradedCreditsCount) : 0.00;
    setText("gpa-display", calculatedGpa.toFixed(2));

    const targetGpa = parseFloat(document.getElementById("target-gpa")?.value) || 4.00;
    setText("gpa-target-text", `Cible: ${targetGpa.toFixed(2)}`);
    const gpaBar = document.getElementById("gpa-target-bar");
    if (gpaBar) gpaBar.style.width = `${Math.min((calculatedGpa / targetGpa) * 100, 100)}%`;

    renderDashboardLists();
}

function renderDashboardLists() {
    // 1. Dashboard Tasks & Reminders
    const tasksContainer = document.getElementById("dashboard-tasks-container");
    tasksContainer.innerHTML = "";

    const coursesWithNotes = courses.filter(c => c.notes && c.notes.trim() !== "");

    if (coursesWithNotes.length === 0) {
        tasksContainer.innerHTML = `<div class="no-results" style="padding:1rem;font-size:0.85rem;">Aucun rappel actif. Saisissez des notes dans vos fiches de cours pour les voir ici !</div>`;
    } else {
        coursesWithNotes.forEach(c => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "dashboard-task-item";
            taskDiv.onclick = () => openCourseDrawer(c.code);
            taskDiv.innerHTML = `
                <span class="task-code">${escapeHtml(c.code)}</span>
                <span class="task-notes-text">${escapeHtml(c.notes)}</span>
            `;
            tasksContainer.appendChild(taskDiv);
        });
    }

    // 2. Aperçu : cours en cours, puis prochains cours planifiés (par trimestre), puis à faire
    const recentContainer = document.getElementById("dashboard-recent-courses");
    recentContainer.innerHTML = "";

    const order = { progress: 0, planned: 1, todo: 2, done: 3 };
    const overview = courses
        .filter(c => c.credits > 0 || c.category === "projet")
        .map((c, i) => ({ c, i, st: getEffectiveStatus(c) }))
        .filter(x => x.st !== "done")
        .sort((a, b) => (order[a.st] - order[b.st]) ||
            (SEMESTER_ORDER.indexOf(a.c.semester) - SEMESTER_ORDER.indexOf(b.c.semester)) || (a.i - b.i))
        .slice(0, 6);

    if (overview.length === 0) {
        recentContainer.innerHTML = `<div class="no-results" style="padding:1rem;font-size:0.85rem;">Tous les cours sont réussis.</div>`;
    }
    overview.forEach(({ c, st }) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "course-item";
        itemDiv.onclick = () => openCourseDrawer(c.code);
        const sem = SEMESTERS[c.semester] ? ` · ${SEMESTERS[c.semester]}` : "";
        itemDiv.innerHTML = `
            <span class="course-code">${escapeHtml(c.code)}</span>
            <span class="course-name">${escapeHtml(c.name)}<small class="course-sem">${escapeHtml(sem)}</small></span>
            <span class="course-credits">${c.credits.toFixed(1)} cr</span>
            <span class="badge ${st}">${STATUS_LABELS[st]}</span>
        `;
        recentContainer.appendChild(itemDiv);
    });
}

// ─── Validation du cheminement ────────────────────────────────────────────────
// Compare le parcours (réussi / en cours / planifié) aux règles LISIBLES dans le document officiel.
// Elle ne garantit PAS l'obtention du diplôme.
function termLabel(key) { return SEMESTERS[key] || key; }

// Problèmes propres à un cours placé dans le planificateur
function getCourseIssues(c) {
    const issues = [];
    if (c.status === "done" || !c.semester) return issues;
    const idx = SEMESTER_ORDER.indexOf(c.semester);
    if (idx === -1) { issues.push({ level: "warn", text: `${c.code} : trimestre « ${c.semester} » inconnu du planificateur.` }); return issues; }

    if (idx < getCurrentTermIndex()) issues.push({ level: "warn", kind: "past", text: `${c.code} est planifié en ${termLabel(c.semester)}, un trimestre déjà terminé : marquez-le réussi ou replanifiez-le.` });

    const offer = getOffer(c, c.semester);
    if (offer === "no") issues.push({ level: "error", kind: "offer", text: `${c.code} n'est pas offert en ${termLabel(c.semester)} (offre indiquée : ${c.period}).` });
    else if (offer === "maybe") issues.push({ level: "warn", kind: "maybe", text: `${c.code} en ${termLabel(c.semester)} : offre non confirmée (« ${c.period || "non précisée"} ») — à vérifier auprès de HEC.` });

    const ev = evaluatePrerequisites(c, "plan", idx);
    if (ev.level === "blocked") {
        issues.push({ level: "error", kind: "prereq", text: `${c.code} en ${termLabel(c.semester)} : préalable non respecté — requis : ${describePrerequisites(c)}.` });
    }
    const cp = evaluateCreditPrereq(c, "plan", idx);
    if (!cp.ok) {
        issues.push({ level: "error", kind: "credits", text: `${c.code} en ${termLabel(c.semester)} : il faut avoir terminé ${cp.required} cr de cours avant ce trimestre (${cp.have.toFixed(1)} cr prévus d'ici là).` });
    }
    findExclusionConflicts(c).forEach(code => {
        issues.push({ level: "error", kind: "exclusion", text: `${c.code} est incompatible avec ${code} (exclusion), présent dans votre parcours.` });
    });
    return issues;
}

function validatePlan() {
    const issues = [];
    const push = (level, text, kind) => issues.push({ level, text, kind });
    const p = computeProgress();
    const R = PROGRAM.required;

    // 1. Doublons de codes
    const seen = new Set();
    courses.forEach(c => {
        if (seen.has(c.code)) push("error", `Cours en double dans le catalogue : ${c.code}.`, "dup");
        seen.add(c.code);
    });
    dataIssues.forEach(t => push("warn", t, "data"));

    // 2. Problèmes cours par cours (préalables, offre, exclusions)
    courses.forEach(c => getCourseIssues(c).forEach(i => issues.push(i)));
    const maybes = issues.filter(i => i.kind === "maybe");
    if (maybes.length > 1) {
        // regroupe les avertissements « offre non confirmée »
        for (let k = issues.length - 1; k >= 0; k--) if (issues[k].kind === "maybe") issues.splice(k, 1);
        push("warn", `Offre non confirmée (période « au moins une fois… » ou non précisée) pour : ${maybes.map(m => m.text.split(" ")[0] + " " + m.text.split(" ")[1]).join(", ")} — à vérifier auprès de HEC avant l'inscription.`, "maybe");
    }

    // 3. Cohérence des cours déjà réussis
    courses.forEach(c => {
        if (c.status !== "done") return;
        const ev = evaluatePrerequisites(c, "actual");
        if (c.prerequisites.length && ev.level === "blocked") push("warn", `Incohérence : ${c.code} est marqué réussi alors que son préalable (${describePrerequisites(c)}) ne l'est pas.`, "coherence");
        if (c.coreqAllowed && ev.level === "blocked") { /* concomitance autorisée : déjà couvert */ }
    });
    const progressNoTerm = courses.filter(c => c.status === "progress" && !SEMESTERS[c.semester]);
    if (progressNoTerm.length) push("info", `${progressNoTerm.length} cours marqué(s) « en cours » sans trimestre : ${progressNoTerm.map(c => c.code).join(", ")}.`, "noterm");

    // 4. Couverture des exigences (réussis + en cours + planifiés)
    const allOf = cat => p.sum(p.byCat[cat]);
    const missingMandatory = courses.filter(c => ["tronc", "noyau", "projet"].includes(c.category) && c.credits > 0 && getEffectiveStatus(c) === "todo");
    if (missingMandatory.length) {
        push("info", `Cours obligatoires encore à planifier (${fmtCr(missingMandatory.reduce((s, c) => s + c.credits, 0))} cr) : ${missingMandatory.map(c => c.code).join(", ")}.`, "mandatory");
    }
    if (p.optionsAll < R.optionsMin) {
        push("info", `Options de spécialisation : ${fmtCr(p.optionsAll)}/${R.optionsMin} cr minimum — il reste ${fmtCr(R.optionsMin - p.optionsAll)} cr à choisir (tous profils confondus).`, "options");
    } else if (p.electiveAll < PROGRAM.electivePool) {
        push("info", `Il reste ${fmtCr(PROGRAM.electivePool - p.electiveAll)} cr à compléter (une option supplémentaire ou un cours au choix, max. ${R.choixMax} cr) pour atteindre ${PROGRAM.totalCredits} cr.`, "elective");
    }
    const choixTotal = courses.filter(c => c.category === "choix").reduce((s, c) => s + c.credits, 0);
    if (choixTotal > R.choixMax) push("error", `Cours au choix : ${fmtCr(choixTotal)} cr déclarés alors que le maximum est ${R.choixMax} cr.`, "choix");
    p.excess.forEach(e => push("warn", `${e.code} : ${fmtCr(e.credits)} cr excédentaires NON comptés (plafond de la catégorie « ${CATEGORY_LABELS[e.category] || e.category} » atteint).`, "excess"));
    if (p.unverifiedCounted.length) push("warn", `Crédits non confirmés par le document pour : ${p.unverifiedCounted.join(", ")} (supposés à 3 cr) — à valider auprès de HEC.`, "unverified");

    // 5. Règles du projet supervisé
    const indv = findCourse("INDV 66202");
    const sujetChecked = !!document.getElementById("chk-sujet")?.checked;
    if (indv && getEffectiveStatus(indv) !== "done" && !sujetChecked) {
        const courseworkDone = p.counted.done - p.byCat.projet.done;
        const courseworkWithCurrent = courseworkDone + p.counted.progress - p.byCat.projet.progress;
        {
            if (courseworkDone >= PROGRAM.subjectDeadlineCredits) push("error", `Le sujet du projet n'est pas soumis alors que ${fmtCr(courseworkDone)} cr de cours sont déjà cumulés (limite : ${PROGRAM.subjectDeadlineCredits} cr).`, "subject");
            else if (courseworkWithCurrent >= PROGRAM.subjectDeadlineCredits) push("warn", `Avec les cours en cours, vous atteindrez ${fmtCr(courseworkWithCurrent)} cr de cours : le sujet doit être soumis avant ${PROGRAM.subjectDeadlineCredits} cr cumulés.`, "subject");
            else push("info", `Rappel : soumettre le sujet du projet avant d'avoir cumulé ${PROGRAM.subjectDeadlineCredits} cr de cours (actuellement ${fmtCr(courseworkDone)} cr réussis).`, "subject");
        }
    }

    // 6. Recommandation de fin de programme (GEST 60401)
    const gest = courses.find(c => c.recommendLate);
    if (gest && SEMESTER_ORDER.includes(gest.semester) && gest.status !== "done") {
        const gIdx = SEMESTER_ORDER.indexOf(gest.semester);
        const later = courses.some(c => c !== gest && c.category !== "projet" && c.category !== "recommandes" && c.credits > 0 &&
            c.status !== "done" && SEMESTER_ORDER.indexOf(c.semester) > gIdx);
        if (later) push("info", `${gest.code} : le document recommande fortement de le suivre en fin de programme (d'autres cours sont planifiés après ${termLabel(gest.semester)}).`, "recommend");
    }

    // 7. Cours aux informations non confirmées présents dans le parcours
    courses.filter(c => c.unverified && getEffectiveStatus(c) !== "todo" && !(c.unverified.includes("credits") && p.unverifiedCounted.includes(c.code)))
        .forEach(c => push("warn", `${c.code} : ${c.unverifiedNote || "informations non confirmées par le document officiel."}`, "unverified"));

    // Règles fournies par l'étudiant et absentes du document officiel (information, pas d'alerte)
    courses.filter(c => c.userRule && getEffectiveStatus(c) !== "todo")
        .forEach(c => push("info", `${c.code} : offre à toute session et seuil de ${c.creditPrereq} cr de cours terminés — règle fournie par vous, non listée dans le document officiel ; à confirmer auprès de HEC.`, "userrule"));

    // Verdict
    const errors = issues.filter(i => i.level === "error").length;
    const warns = issues.filter(i => i.level === "warn").length;
    const planComplete = p.total >= PROGRAM.totalCredits;
    return { issues, errors, warns, planComplete, progress: p };
}

function renderValidation() {
    const v = validatePlan();
    const iconFor = { error: "x-circle", warn: "alert-triangle", info: "info", ok: "check-circle" };
    const rows = (list) => list.map(i =>
        `<li class="val-item val-${i.level}"><i data-lucide="${iconFor[i.level]}"></i><span>${escapeHtml(i.text)}</span></li>`).join("");

    let summary;
    if (v.errors > 0) summary = `<div class="val-summary val-error"><i data-lucide="x-circle"></i><strong>${v.errors} erreur${v.errors > 1 ? "s" : ""}</strong> de cheminement à corriger${v.warns ? ` · ${v.warns} avertissement${v.warns > 1 ? "s" : ""}` : ""}</div>`;
    else if (v.warns > 0) summary = `<div class="val-summary val-warn"><i data-lucide="alert-triangle"></i><strong>${v.warns} avertissement${v.warns > 1 ? "s" : ""}</strong> à examiner — aucune erreur bloquante</div>`;
    else summary = `<div class="val-summary val-ok"><i data-lucide="check-circle"></i><strong>Aucune incohérence détectée</strong> dans le plan actuel${v.planComplete ? "" : ` (le plan couvre ${fmtCr(v.progress.total)}/${PROGRAM.totalCredits} cr)`}</div>`;

    const disclaimer = `<p class="val-disclaimer">Vérification basée sur la structure ${PROGRAM.year} du document fourni. Elle ne garantit pas l'obtention du diplôme : d'autres règles HEC non présentes dans ce document (moyenne minimale, durée maximale, etc.) ne sont pas vérifiées.</p>`;

    setHtml("validation-container", summary + `<ul class="val-list">${rows(v.issues) || ""}</ul>` + disclaimer);

    // Alertes compactes dans le planificateur (erreurs + avertissements seulement)
    const alertsOnly = v.issues.filter(i => i.level === "error" || i.level === "warn");
    const plannerBox = document.getElementById("planner-alerts");
    if (plannerBox) {
        plannerBox.style.display = alertsOnly.length ? "block" : "none";
        plannerBox.innerHTML = alertsOnly.length ? `<ul class="val-list">${rows(alertsOnly)}</ul>` : "";
    }
    return v;
}

// Course Catalog section rendering
function setCourseFilter(filter) {
    currentFilter = filter;

    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(t => {
        if (t.getAttribute("data-filter") === filter) t.classList.add("active");
        else t.classList.remove("active");
    });

    renderCourseCatalog();
}

function filterCourses() {
    renderCourseCatalog();
}

// Pastille d'admissibilité (préalables / exclusions) pour les cours pas encore réussis
function eligibilityChip(c) {
    if (c.status === "done") return "";
    const hasConstraint = (c.prerequisites && c.prerequisites.length) || (c.exclusions && c.exclusions.length) || c.creditPrereq;
    if (!hasConstraint) return "";
    const e = getEligibility(c);
    const map = {
        ok:       { cls: "elig-ok",      icon: "check",         label: "Admissible" },
        cond:     { cls: "elig-cond",    icon: "clock",         label: "Sous condition" },
        blocked:  { cls: "elig-blocked", icon: "lock",          label: e.credit ? "Crédits insuffisants" : "Préalable manquant" },
        excluded: { cls: "elig-blocked", icon: "ban",           label: "Exclusion" }
    }[e.level];
    return `<span class="elig-chip ${map.cls}" title="${escapeHtml(e.text)}"><i data-lucide="${map.icon}" style="width:11px;height:11px;"></i> ${map.label}</span>`;
}

function renderCourseCatalog() {
    const grid = document.getElementById("courses-grid-container");
    grid.innerHTML = "";

    const searchVal = document.getElementById("course-search").value.toLowerCase().trim();

    const filtered = courses.filter(c => {
        // Tab check
        if (currentFilter !== "all" && c.category !== currentFilter) return false;

        // Search check
        if (searchVal !== "") {
            return c.code.toLowerCase().includes(searchVal) ||
                c.name.toLowerCase().includes(searchVal) ||
                (c.nameFr || "").toLowerCase().includes(searchVal);
        }

        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results col-span-4">Aucun cours ne correspond aux critères de filtrage.</div>`;
        return;
    }

    filtered.forEach(c => {
        const card = document.createElement("div");
        card.onclick = () => openCourseDrawer(c.code);

        const st = getEffectiveStatus(c);
        const categoryLabel = getCategoryLabel(c);
        const categoryClass = getCategoryClass(c);
        const semTag = SEMESTERS[c.semester] ? `<span class="card-sem-tag"><i data-lucide="calendar-check" style="width:11px;height:11px;"></i> ${escapeHtml(SEMESTERS[c.semester])}</span>` : "";
        const unverifiedTag = c.unverified ? `<span class="elig-chip elig-cond" title="${escapeHtml(c.unverifiedNote || "")}"><i data-lucide="help-circle" style="width:11px;height:11px;"></i> À valider</span>` : "";

        card.className = `course-grid-card glass-panel ${categoryClass} st-${st}`;

        card.innerHTML = `
            <div class="card-course-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="course-code-highlighted">${escapeHtml(c.code)}</span>
                <span class="badge ${st}">${STATUS_LABELS[st]}</span>
            </div>
            <h3 class="card-course-title" style="margin-top: 4px; margin-bottom: 0.5rem; font-size: 1.02rem; font-weight: 700; line-height: 1.35; color: white; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: auto; min-height: 44px;">
                ${escapeHtml(c.name)}
            </h3>
            <div style="margin-bottom: 0.75rem; display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
                <span class="card-category-sublabel">${escapeHtml(categoryLabel)}</span>
                ${eligibilityChip(c)}${unverifiedTag}${semTag}
            </div>
            <div class="card-course-footer" style="padding-top: 0.75rem; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center;">
                <span class="card-course-credits" style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="award" style="width:12px; height:12px;"></i> ${c.credits.toFixed(1)} cr
                </span>
                <span class="card-course-period" style="font-size: 0.8rem; display:flex; align-items:center; gap:4px;">
                    <i data-lucide="calendar" style="width:12px; height:12px;"></i> ${escapeHtml(c.period || NOT_IN_DOC)}
                </span>
            </div>
        `;
        grid.appendChild(card);
    });
}

let currentPoolFilter = "all";      // all | mandatory | options
let currentPoolProfile = "all";     // all | Marketing | Sciences de la décision | Technologies de l'information
let currentPoolSearch = "";
let poolShowDone = true;

const POOL_PROFILES = [
    { key: "Marketing", label: "Marketing", cls: "pp-marketing" },
    { key: "Sciences de la décision", label: "Sciences de la décision", cls: "pp-decision" },
    { key: "Technologies de l'information", label: "Technologies de l'information", cls: "pp-ti" }
];

function normText(t) { return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

function poolMatchesCategory(c) {
    if (currentPoolFilter === "mandatory") return c.category === "tronc" || c.category === "noyau" || c.category === "projet";
    if (currentPoolFilter === "options") return c.category === "options" || c.category === "choix";
    return true;
}
function poolMatchesSearch(c) {
    const q = normText(currentPoolSearch).trim();
    if (!q) return true;
    return q.split(/\s+/).every(w => normText([c.code, c.name, c.nameFr, c.subject, c.profile].join(" ")).includes(w));
}
function poolMatchesProfile(c) { return currentPoolProfile === "all" || c.profile === currentPoolProfile; }
function poolFilterActive() { return currentPoolProfile !== "all" || currentPoolSearch.trim() !== "" || currentPoolFilter !== "all" || !poolShowDone; }

function setPoolFilter(filter) {
    currentPoolFilter = filter;
    // Les cours obligatoires n'ont pas de profil : on lève le filtre de profil
    if (filter === "mandatory") currentPoolProfile = "all";
    renderSessionPlanner();
}

function setPoolProfile(profile) {
    currentPoolProfile = (profile === currentPoolProfile) ? "all" : profile;
    // Un profil ne concerne que les options : on quitte le filtre « Obligatoires »
    if (currentPoolProfile !== "all" && currentPoolFilter === "mandatory") currentPoolFilter = "options";
    renderSessionPlanner();
}

function setPoolSearch(value) { currentPoolSearch = value || ""; renderSessionPlanner(); }
function togglePoolShowDone() { poolShowDone = !poolShowDone; renderSessionPlanner(); }
function resetPoolFilters() {
    currentPoolFilter = "all"; currentPoolProfile = "all"; currentPoolSearch = ""; poolShowDone = true;
    const input = document.getElementById("pool-search"); if (input) input.value = "";
    renderSessionPlanner();
}

// Barre de filtres du planificateur : catégorie, profil (avec compteurs), recherche, cours réussis
function renderPoolFilterBar(basePool) {
    const btns = { all: "pool-filter-all", mandatory: "pool-filter-mandatory", options: "pool-filter-options" };
    Object.entries(btns).forEach(([k, id]) => { const el = document.getElementById(id); if (el) el.classList.toggle("active", currentPoolFilter === k); });

    const bar = document.getElementById("pool-profile-bar");
    if (bar) {
        // Compteurs : cours à placer correspondant aux autres filtres (catégorie, recherche, réussis)
        const base = basePool.filter(c => poolMatchesCategory(c) && poolMatchesSearch(c) && (poolShowDone || c.status !== "done"));
        const chips = [`<button class="pool-chip pp-all${currentPoolProfile === "all" ? " active" : ""}" onclick="setPoolProfile('${"all"}')">Tous les profils <span class="pool-chip-n">${base.length}</span></button>`];
        POOL_PROFILES.forEach(p => {
            const n = base.filter(c => c.profile === p.key).length;
            chips.push(`<button class="pool-chip ${p.cls}${currentPoolProfile === p.key ? " active" : ""}${n === 0 ? " empty" : ""}" onclick="setPoolProfile(this.dataset.p)" data-p="${escapeHtml(p.key)}" title="Options du profil ${escapeHtml(p.label)}">${escapeHtml(p.label)} <span class="pool-chip-n">${n}</span></button>`);
        });
        bar.innerHTML = chips.join("");
        // « Tous les profils » : désactive le filtre
        const allBtn = bar.querySelector(".pp-all");
        if (allBtn) allBtn.onclick = () => { currentPoolProfile = "all"; renderSessionPlanner(); };
    }
    const doneBtn = document.getElementById("pool-done-toggle");
    if (doneBtn) { doneBtn.classList.toggle("active", poolShowDone); doneBtn.setAttribute("aria-pressed", String(poolShowDone)); }
    const reset = document.getElementById("pool-reset");
    if (reset) reset.style.display = poolFilterActive() ? "inline-flex" : "none";
}

// Avertissements d'un cours placé au planificateur (préalables, offre, exclusions)
function checkPlannerWarnings(course) {
    const issues = getCourseIssues(course);
    if (issues.length === 0) return null;
    return { level: issues.some(i => i.level === "error") ? "error" : "warn", messages: issues.map(i => i.text) };
}

function renderSessionPlanner() {
    // 1. Render the Unplanned Pool list
    const poolContainer = document.getElementById("unplanned-courses-pool");
    if (poolContainer) {
        poolContainer.innerHTML = "";

        // Tous les cours sans trimestre valide — y compris les cours déjà réussis (sans trimestre renseigné),
        // pour que « Mes cours », le planificateur et l'arbre contiennent exactement les mêmes cours.
        const basePool = courses.filter(c => !c.semester || !SEMESTERS[c.semester]);
        basePool.sort((a, b) => (a.status === "done") - (b.status === "done"));
        renderPoolFilterBar(basePool);
        const unplanned = basePool.filter(c => poolMatchesCategory(c) && poolMatchesProfile(c) && poolMatchesSearch(c) && (poolShowDone || c.status !== "done"));
        const countEl = document.getElementById("pool-count");
        if (countEl) countEl.textContent = `${unplanned.length} cours à placer sur ${basePool.length}`;

        if (unplanned.length === 0) {
            poolContainer.innerHTML = poolFilterActive() && basePool.length > 0
                ? `<div class="planner-empty-spot" style="padding:1rem; min-height:80px; flex-direction:column; gap:8px;">Aucun cours à placer avec ces filtres.<button class="btn btn-outline" style="padding:4px 10px;font-size:0.72rem;" onclick="resetPoolFilters()">Réinitialiser les filtres</button></div>`
                : `<div class="planner-empty-spot" style="padding:1rem; min-height:80px;">Tous les cours sont déjà placés dans un trimestre.</div>`;
        } else {
            unplanned.forEach(c => {
                const card = document.createElement("div");
                card.draggable = true;
                card.setAttribute("ondragstart", `dragStart(event, '${c.code}')`);
                card.onclick = () => openCourseDrawer(c.code);

                const catLabel = getCategoryLabel(c);
                card.className = `pool-card ${getCategoryClass(c)}`;

                card.innerHTML = `
                    <div class="pool-card-header" style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <span class="p-code-highlighted">${escapeHtml(c.code)}</span>
                        <div style="display: flex; align-items: center; gap: 4px; opacity: 0.35;">
                            <i data-lucide="grip-vertical" style="width: 12px; height: 12px;" title="Glisser pour planifier"></i>
                        </div>
                    </div>
                    <span class="p-title" style="margin-bottom: 4px; display: block;">${escapeHtml(c.name)}</span>
                    <div style="font-size:0.65rem; color:var(--text-secondary); margin: 3px 0; display:flex; align-items:center; gap:4px;">
                        <i data-lucide="calendar" style="width:10px; height:10px;"></i> ${escapeHtml(c.period || NOT_IN_DOC)}
                    </div>
                    <div style="margin-top: 4px; margin-bottom: 6px; display:flex; flex-wrap:wrap; gap:4px; align-items:center;">
                        <span class="card-category-sublabel" style="display:inline-block; font-size:0.62rem; margin:0;">${escapeHtml(catLabel)}</span>
                        ${eligibilityChip(c)}${c.status === "done" ? '<span class="planner-state-tag done">Réussi${c.semester ? " · " + escapeHtml(c.semester) : " — sans trimestre"}</span>' : ""}
                    </div>
                    <div class="pool-card-actions" style="margin-top: auto; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.03);">
                        <span class="p-credits">${c.credits.toFixed(1)} cr</span>
                        <button class="btn-quick-assign" onclick="event.stopPropagation(); toggleQuickAssignMenu(event, '${c.code}')">
                            <i data-lucide="plus" style="width:12px;height:12px;"></i> Planifier
                        </button>
                    </div>
                `;
                poolContainer.appendChild(card);
            });
        }
    }

    // 2. Render Semester Columns
    const board = document.getElementById("planner-board-container");
    if (!board) return;
    board.innerHTML = "";
    const currentKey = SEMESTER_ORDER[getCurrentTermIndex()];

    SEMESTER_ORDER.forEach(semKey => {
        const col = document.createElement("div");
        col.className = "planner-column";
        col.setAttribute("ondragover", "allowDrop(event)");
        col.setAttribute("ondragenter", `dragEnter(event, '${semKey}')`);
        col.setAttribute("ondragleave", `dragLeave(event, '${semKey}')`);
        col.setAttribute("ondrop", `dropToSemester(event, '${semKey}')`);

        const semCourses = courses.filter(c => c.semester === semKey);
        const colCredits = semCourses.reduce((acc, curr) => acc + curr.credits, 0);
        const sessionCost = semCourses.filter(c => c.status !== "done").reduce((acc, curr) => acc + curr.credits, 0) * COST_PER_CREDIT;
        const currentTag = semKey === currentKey ? `<span class="term-now-tag">Trimestre courant</span>` : "";

        col.innerHTML = `
            <div class="planner-column-header">
                <div class="column-header-top">
                    <h4>${SEMESTERS[semKey]}</h4>${currentTag}
                </div>
                <div class="column-header-badges">
                    <span class="col-badge badge-credits"><i data-lucide="award"></i> ${colCredits.toFixed(1)} cr</span>
                    <span class="col-badge badge-cost" title="Estimation à ${COST_PER_CREDIT} $/crédit (paramètre de l'application)"><i data-lucide="dollar-sign"></i> ${sessionCost.toLocaleString("fr-CA")} $</span>
                </div>
            </div>
            <div class="planner-column-body" id="col-body-${semKey}">
                <!-- cards -->
            </div>
        `;
        board.appendChild(col);

        const colBody = document.getElementById(`col-body-${semKey}`);

        if (semCourses.length === 0) {
            colBody.innerHTML = `<div class="planner-empty-spot">Déposez un cours ici</div>`;
        } else {
            semCourses.forEach(c => {
                const card = document.createElement("div");
                card.draggable = true;
                card.setAttribute("ondragstart", `dragStart(event, '${c.code}')`);
                card.onclick = () => openCourseDrawer(c.code);

                const warn = checkPlannerWarnings(c);
                const warningHTML = warn
                    ? `<div class="planner-card-warning ${warn.level}" title="${escapeHtml(warn.messages.join("\n"))}"><i data-lucide="alert-triangle" style="width:12px;height:12px;"></i></div>`
                    : "";
                const warningLine = warn
                    ? `<span class="planner-warn-line ${warn.level}">${escapeHtml(warn.messages[0])}</span>`
                    : "";

                const st = getEffectiveStatus(c);
                const dimmed = (currentPoolProfile !== "all" || currentPoolSearch.trim()) && !(poolMatchesProfile(c) && poolMatchesSearch(c));
                card.className = `planner-card ${st} ${getCategoryClass(c)}${warn ? " has-" + warn.level : ""}${dimmed ? " dim-by-filter" : ""}`;

                card.innerHTML = `
                    <div class="planner-card-header" style="margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <span class="p-code-highlighted">${escapeHtml(c.code)}</span>
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${warningHTML}
                            <i data-lucide="grip-vertical" style="width: 12px; height: 12px; opacity: 0.35;" title="Glissez pour déplacer"></i>
                            <button class="btn-remove-planned" onclick="event.stopPropagation(); unscheduleCourse('${c.code}')" title="Retirer du planificateur">
                                <i data-lucide="x" style="width:12px;height:12px;"></i>
                            </button>
                        </div>
                    </div>
                    <span class="p-title" style="font-size: 0.76rem; font-weight: 500; display: block; margin-bottom: 2px;">${escapeHtml(c.name)}</span>
                    ${warningLine}
                    <div class="planner-card-bottom" style="margin-top: auto; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items:center;">
                        <span class="planner-state-tag ${st}">${STATUS_LABELS[st]}</span>
                        <span class="p-credits" style="font-size: 0.65rem; opacity: 0.7;">${c.credits.toFixed(1)} cr</span>
                    </div>
                `;
                colBody.appendChild(card);
            });
        }
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Click and Highlight interactive Tree Map prerequisites
function clickTreeNode(courseCode) {
    const selectedCourse = courses.find(c => c.code === courseCode);
    if (!selectedCourse) return;

    currentSelectedCourseCode = courseCode;

    // 1. Reset all visual statuses
    const nodes = document.querySelectorAll(".tree-node");
    nodes.forEach(n => {
        n.classList.remove("selected-node", "prereq-node", "unlocks-node");
    });

    // 2. Highlight selected node
    const selfNode = document.getElementById(`node-${courseCode.replace(" ", "-")}`);
    if (selfNode) {
        selfNode.classList.add("selected-node");
    }

    // 3. Highlight prerequisites
    selectedCourse.prerequisites.forEach(preCode => {
        const preNode = document.getElementById(`node-${preCode.replace(" ", "-")}`);
        if (preNode) {
            preNode.classList.add("prereq-node");
        }
    });

    // 4. Highlight unlocks (dependent courses)
    selectedCourse.unlocks.forEach(unlCode => {
        const unlNode = document.getElementById(`node-${unlCode.replace(" ", "-")}`);
        if (unlNode) {
            unlNode.classList.add("unlocks-node");
        }
    });

    // Render tree sidebar
    renderTreeSidebar(selectedCourse);
    
    // Draw SVG prerequisite paths
    drawTreeConnections();
}

function nodeIdFor(code) { return `node-${code.replace(" ", "-")}`; }

// ─── Arbre généré depuis le catalogue (même source que « Mes cours » et le planificateur) ───
const TREE_PROFILES = [
    { key: "Marketing", icon: "pie-chart", label: "Profil Marketing" },
    { key: "Sciences de la décision", icon: "brain", label: "Profil Sciences de la décision" },
    { key: "Technologies de l'information", icon: "cpu", label: "Profil Technologies de l'information" }
];
const TREE_BADGE = { tronc: "Obligatoire", noyau: "Obligatoire", options: "Option", projet: "Activité", recommandes: "Recommandé", choix: "Au choix" };

function treePrereqLabel(c) {
    const pre = c.prerequisites || [];
    const cr = c.creditPrereq ? `${c.creditPrereq} cr de cours terminés` : "";
    if (!pre.length && !cr) return "";
    const or = prereqRelation(c) === "OR" && pre.length > 1;
    let txt = pre.length ? (or ? `l'un de ${pre.join(" / ")}` : pre.join(" et ")) + (c.coreqAllowed ? " (ou en concomitance)" : "") : "";
    if (cr) txt += (txt ? " + " : "") + cr;
    const plural = !or && (pre.length + (cr ? 1 : 0)) > 1;
    return `<span class="prereq-label"><i data-lucide="lock"></i> Préalable${plural ? "s" : ""} : ${escapeHtml(txt)}</span>`;
}

function treeNodeHtml(c) {
    const extra = [];
    if (c.credits === 0 || c.category === "projet") extra.push(`${c.credits} cr`);
    const unver = c.unverified && c.unverified.length
        ? `<span class="prereq-label unverified-label"><i data-lucide="help-circle"></i> ${escapeHtml(c.unverifiedShort || "Informations à valider")}</span>` : "";
    return `
        <div class="tree-node${((c.prerequisites || []).length || c.creditPrereq) ? " dependent-node" : ""}" id="${nodeIdFor(c.code)}" data-code="${escapeHtml(c.code)}" onclick="clickTreeNode('${c.code}')">
            <span class="node-code">${escapeHtml(c.code)}</span>
            <span class="node-name">${escapeHtml(c.name)}</span>
            <span class="node-badge">${TREE_BADGE[c.category] || ""}</span>
            ${treePrereqLabel(c)}${unver}
        </div>`;
}

function treeSection(icon, title, inner, first) {
    return `
        <div class="tree-section"${first ? "" : ' style="margin-top: 1.5rem;"'}>
            <h3 class="level-title"><i data-lucide="${icon}"></i> ${title}</h3>
            ${inner}
        </div>`;
}

function renderTreeStructure() {
    const box = document.getElementById("tree-dynamic");
    if (!box) return;
    const by = cat => courses.filter(c => c.category === cat);
    const flat = list => `<div class="level-nodes flex-wrap-center">${list.map(treeNodeHtml).join("")}</div>`;
    const R = PROGRAM.required;

    const options = by("options");
    const profCols = TREE_PROFILES.map(p => {
        const list = options.filter(c => c.profile === p.key);
        return `<div class="profile-tree-column">
            <h4 class="profile-tree-header"><i data-lucide="${p.icon}"></i> ${p.label} <small style="display:block;opacity:.7;font-weight:400;text-transform:none;margin-top:2px;">${list.length} cours</small></h4>
            <div class="profile-tree-nodes">${list.map(treeNodeHtml).join("")}</div>
        </div>`;
    });
    const known = new Set(TREE_PROFILES.map(p => p.key));
    const others = options.filter(c => !known.has(c.profile));
    if (others.length) profCols.push(`<div class="profile-tree-column"><h4 class="profile-tree-header"><i data-lucide="layers"></i> Autres options</h4><div class="profile-tree-nodes">${others.map(treeNodeHtml).join("")}</div></div>`);

    const choix = by("choix");
    const choixInner = choix.length
        ? flat(choix)
        : `<div class="level-nodes flex-wrap-center"><span class="text-secondary" style="font-size:0.8rem;">Aucun cours au choix déclaré (maximum ${R.choixMax} crédits).</span></div>`;

    box.innerHTML =
        treeSection("shield-alert", `1. Cours obligatoire du programme (${R.tronc} crédits)`, flat(by("tronc")), true) +
        treeSection("shield", `2. Cours obligatoires de la spécialisation (${R.noyau} crédits)`, flat(by("noyau"))) +
        treeSection("sliders", `3. Cours à option de la spécialisation (minimum ${R.optionsMin} crédits, tous profils confondus)`, `<div class="profiles-tree-grid">${profCols.join("")}</div>`) +
        treeSection("plus-circle", `Cours au choix (maximum ${R.choixMax} crédits — admissibilité à valider)`, choixInner) +
        treeSection("award", `4. Activités obligatoires (${R.projet} crédits)`, flat(by("projet"))) +
        treeSection("check-square", "5. Activités fortement recommandées (0 crédit)", flat(by("recommandes")));
}

function renderTreeNodesHighlight() {
    renderTreeStructure();
    // Colore dynamiquement les nœuds selon le statut effectif (réussi / en cours / planifié) et la catégorie
    courses.forEach(c => {
        const nodeEl = document.getElementById(nodeIdFor(c.code));
        if (!nodeEl) return;
        const st = getEffectiveStatus(c);

        nodeEl.classList.remove("status-done", "status-progress", "status-planned", "status-todo");
        nodeEl.classList.remove("profile-marketing", "profile-decision", "profile-ti");
        nodeEl.classList.remove("category-tronc", "category-noyau", "category-options", "category-projet", "category-recommandes", "category-choix");
        nodeEl.classList.remove("elig-blocked-node");
        nodeEl.style.borderRight = "";

        if (c.profile === "Marketing") nodeEl.classList.add("profile-marketing");
        else if (c.profile === "Sciences de la décision") nodeEl.classList.add("profile-decision");
        else if (c.profile === "Technologies de l'information") nodeEl.classList.add("profile-ti");
        nodeEl.classList.add(`category-${c.category}`);
        nodeEl.classList.add(`status-${st}`);

        // Cours dont un préalable manque : nœud signalé
        if (st !== "done" && ((c.prerequisites && c.prerequisites.length) || c.creditPrereq) && getEligibility(c).level === "blocked") {
            nodeEl.classList.add("elig-blocked-node");
        }

        const badgeEl = nodeEl.querySelector(".node-badge");
        if (badgeEl) {
            if (st === "done") {
                badgeEl.innerHTML = `<i data-lucide="check-circle" style="width:10px; height:10px; margin-right:3px; display:inline-block; vertical-align:middle;"></i> Terminé`;
                badgeEl.className = "node-badge badge-done";
                badgeEl.removeAttribute("style");
            } else if (st === "progress") {
                badgeEl.innerHTML = `<i data-lucide="clock" style="width:10px; height:10px; margin-right:3px; display:inline-block; vertical-align:middle;"></i> En cours`;
                badgeEl.className = "node-badge badge-progress";
                badgeEl.removeAttribute("style");
            } else if (st === "planned") {
                badgeEl.innerHTML = `<i data-lucide="calendar-check" style="width:10px; height:10px; margin-right:3px; display:inline-block; vertical-align:middle;"></i> Planifié${SEMESTERS[c.semester] ? " · " + c.semester : ""}`;
                badgeEl.className = "node-badge badge-planned";
                badgeEl.removeAttribute("style");
            } else {
                const styles = getProfileStyles(c);
                badgeEl.innerHTML = styles.catLabel;
                badgeEl.className = "node-badge badge-todo";
                badgeEl.style = styles.badgeStyle + " padding: 2px 6px; border-radius: 4px; font-size: 0.65rem;";
            }
        }
    });
    if (window.lucide) lucide.createIcons();
}

function renderTreeSidebar(course) {
    const pane = document.getElementById("tree-sidebar-container");
    pane.innerHTML = "";

    const st = getEffectiveStatus(course);
    const statusLabel = { todo: "À faire", planned: "Planifié", progress: "En cours ⏳", done: "Terminé ✅" }[st];
    const unlocksText = course.unlocks && course.unlocks.length > 0 ? course.unlocks.join(", ") : "Aucun";
    const elig = course.status === "done" ? null : getEligibility(course);
    const eligHtml = elig && (course.prerequisites.length || course.exclusions.length || course.creditPrereq)
        ? `<span style="font-size:0.85rem;color:var(--text-secondary);"><strong style="color:white;">Admissibilité :</strong> ${escapeHtml(elig.text)}</span>` : "";
    const exclHtml = course.exclusions && course.exclusions.length
        ? `<span style="font-size:0.85rem;color:var(--text-secondary);"><strong style="color:var(--warning);">Exclusion :</strong> ${escapeHtml(course.exclusions.join(", "))}</span>` : "";
    const unverifiedHtml = course.unverified
        ? `<p class="unverified-note"><i data-lucide="help-circle" style="width:14px;height:14px;"></i> ${escapeHtml(course.unverifiedNote || "Informations à valider auprès de HEC.")}</p>` : "";

    pane.innerHTML = `
        <span class="drawer-course-code" style="align-self:flex-start;">${escapeHtml(course.code)}</span>
        <h3>${escapeHtml(course.name)}</h3>
        ${course.nameFr ? `<p class="text-secondary" style="font-size:0.8rem;margin:-4px 0 0;">${escapeHtml(course.nameFr)}</p>` : ""}
        <div class="tree-sidebar-meta">
            <span style="font-size:0.85rem;"><strong style="color:white;">Crédits:</strong> ${course.credits.toFixed(1)} cr</span>
            <span style="font-size:0.85rem;"><strong style="color:white;">Offre:</strong> ${escapeHtml(course.period || NOT_IN_DOC)}</span>
            <span style="font-size:0.85rem;"><strong style="color:white;">Statut:</strong> ${statusLabel}${SEMESTERS[course.semester] ? " — " + SEMESTERS[course.semester] : ""}</span>
        </div>

        <div class="tree-sidebar-meta" style="border-color: rgba(239, 68, 68, 0.15);">
            <span style="font-size:0.85rem;color:var(--text-secondary);"><strong style="color:var(--danger);">Préalables:</strong> ${escapeHtml(describePrerequisites(course))}</span>
            <span style="font-size:0.85rem;color:var(--text-secondary);"><strong style="color:var(--success);">Débloque:</strong> ${escapeHtml(unlocksText)}</span>
            ${exclHtml}${eligHtml}
        </div>
        ${course.userRule ? `<p class="unverified-note"><i data-lucide="user" style="width:14px;height:14px;"></i> ${escapeHtml(course.userRule)}</p>` : ""}
        ${unverifiedHtml}
        <p class="text-secondary" style="font-size:0.85rem;line-height:1.5;">${escapeHtml(course.desc)}</p>

        <button class="btn btn-primary" onclick="openCourseDrawer('${course.code}')" style="width:100%;margin-top:auto;"><i data-lucide="sliders"></i> Fiche de cours & Notes</button>
    `;
    if (window.lucide) lucide.createIcons();
}

// Sliding details drawer handlers
function openCourseDrawer(courseCode) {
    const course = courses.find(c => c.code === courseCode);
    if (!course) return;

    currentSelectedCourseCode = courseCode;

    // Fill elements
    document.getElementById("drawer-code").innerText = course.code;
    document.getElementById("drawer-title").innerText = course.name;
    const frEl = document.getElementById("drawer-namefr");
    if (frEl) { frEl.innerText = course.nameFr || ""; frEl.style.display = course.nameFr ? "block" : "none"; }
    document.getElementById("drawer-credits").innerText = course.credits.toFixed(1);
    document.getElementById("drawer-period").innerText = course.period || NOT_IN_DOC;
    const catEl = document.getElementById("drawer-category");
    if (catEl) catEl.innerText = getCategoryLabel(course);
    const modeEl = document.getElementById("drawer-mode");
    if (modeEl) modeEl.innerText = course.mode || NOT_IN_DOC;

    // Semester selector : trimestres NON exclus par l'offre ; offre non confirmée signalée ; trimestre actuel toujours présent
    const semSelector = document.getElementById("drawer-semester-selector");
    semSelector.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.innerText = "Non planifié";
    semSelector.appendChild(defaultOpt);

    SEMESTER_ORDER.forEach(semKey => {
        const offer = getOffer(course, semKey);
        if (offer === "no" && course.semester !== semKey) return;
        const opt = document.createElement("option");
        opt.value = semKey;
        opt.innerText = SEMESTERS[semKey] + (offer === "maybe" ? " — offre à confirmer" : (offer === "no" ? " — NON offert" : ""));
        semSelector.appendChild(opt);
    });

    semSelector.value = course.semester || "";
    document.getElementById("drawer-notes").value = course.notes || "";
    document.getElementById("drawer-desc").innerText = course.desc || "";

    // Conditions d'inscription & admissibilité
    const condUl = document.getElementById("drawer-conditions");
    if (condUl) {
        const rows = [];
        rows.push(["Préalables", describePrerequisites(course)]);
        if (course.corequisites && course.corequisites.length) rows.push(["Concomitants", course.corequisites.join(", ")]);
        if (course.exclusions && course.exclusions.length) rows.push(["Exclusions", course.exclusions.join(", ") + " (incompatible si présent dans la structure)"]);
        if (course.restrictions) rows.push(["Conditions particulières", course.restrictions]);
        if (course.unlocks && course.unlocks.length) rows.push(["Débloque", course.unlocks.join(", ")]);
        if (course.status !== "done" && (course.prerequisites.length || course.exclusions.length || course.creditPrereq)) {
            const e = getEligibility(course);
            rows.push(["Admissibilité", e.text]);
        }
        const offerTxt = parseOfferTerms(course.period).explicit ? course.period : `${course.period || NOT_IN_DOC} — le trimestre exact d'offre n'est pas confirmé`;
        rows.push(["Période d'offre", offerTxt]);
        if (course.userRule) rows.push(["Information de l'étudiant", course.userRule]);
        if (course.source) rows.push(["Source", course.source]);
        condUl.innerHTML = rows.map(([k, v]) => `<li><strong>${escapeHtml(k)} :</strong> ${escapeHtml(v)}</li>`).join("");
    }
    const unvEl = document.getElementById("drawer-unverified");
    if (unvEl) {
        unvEl.style.display = course.unverified ? "block" : "none";
        unvEl.innerText = course.unverifiedNote || "";
    }

    // Themes
    const themesUl = document.getElementById("drawer-themes");
    themesUl.innerHTML = "";
    if (course.themes && course.themes.length > 0) {
        document.getElementById("drawer-themes-section").style.display = "block";
        course.themes.forEach(t => {
            const li = document.createElement("li");
            li.innerText = t;
            themesUl.appendChild(li);
        });
    } else {
        document.getElementById("drawer-themes-section").style.display = "none";
    }

    // Remarques
    if (course.remarques && course.remarques.trim() !== "") {
        document.getElementById("drawer-remarques-section").style.display = "block";
        document.getElementById("drawer-remarques").innerText = course.remarques;
    } else {
        document.getElementById("drawer-remarques-section").style.display = "none";
    }

    // Set Status active button
    updateStatusButtonsUI(course.status);

    // Show drawer overlay
    document.getElementById("course-details-drawer").classList.add("active");
    if (window.lucide) lucide.createIcons();
}

function updateStatusButtonsUI(status) {
    const todoBtn = document.querySelector(".btn-todo");
    const progressBtn = document.querySelector(".btn-progress");
    const doneBtn = document.querySelector(".btn-done");
    const gradeContainer = document.getElementById("grade-editor-container");

    todoBtn.classList.remove("active");
    progressBtn.classList.remove("active");
    doneBtn.classList.remove("active");

    if (status === "todo") todoBtn.classList.add("active");
    if (status === "progress") progressBtn.classList.add("active");
    if (status === "done") doneBtn.classList.add("active");

    // Statut effectif (planifié = trimestre futur)
    const course = courses.find(c => c.code === currentSelectedCourseCode);
    const effEl = document.getElementById("drawer-effective-status");
    if (effEl && course) {
        const st = getEffectiveStatus(course);
        const detail = st === "planned" ? ` — compté comme « planifié » (${SEMESTERS[course.semester]} est à venir)`
            : (st === "progress" && SEMESTERS[course.semester] ? ` — trimestre courant (${SEMESTERS[course.semester]})` : "");
        effEl.innerText = `Statut effectif : ${STATUS_LABELS[st]}${detail}`;
    }

    // Show/hide grade dropdown on 'done' status
    if (status === "done") {
        gradeContainer.style.display = "flex";
        if (course) {
            document.getElementById("drawer-grade-selector").value = course.grade || "";
        }
    } else {
        gradeContainer.style.display = "none";
    }
}

function updateCurrentCourseStatus(status) {
    const course = courses.find(c => c.code === currentSelectedCourseCode);
    if (!course) return;

    // Alerte (sans bloquer) si le cours est marqué en cours/réussi alors que ses conditions ne sont pas remplies
    if (status !== "todo") {
        const e = getEligibility(course);
        if (e.level === "blocked" || e.level === "excluded") {
            showNotification(`<strong>Attention :</strong> ${escapeHtml(course.code)} — ${escapeHtml(e.text)}.`, "error");
        }
    }

    course.status = status;
    if (status !== "done") course.grade = ""; // Clear grade if changed status

    updateStatusButtonsUI(status);
    renderAll();
}

function updateCurrentCourseGrade(grade) {
    const course = courses.find(c => c.code === currentSelectedCourseCode);
    if (course) {
        course.grade = grade;
        renderAll();
    }
}

function updateCurrentCourseSemester(sem) {
    const course = courses.find(c => c.code === currentSelectedCourseCode);
    if (course) {
        const success = handleMoveAndSolve(course.code, sem);
        if (!success) {
            document.getElementById("drawer-semester-selector").value = course.semester || "";
        } else {
            updateStatusButtonsUI(course.status);
        }
    }
}

function updateCurrentCourseNotes(notes) {
    const course = courses.find(c => c.code === currentSelectedCourseCode);
    if (course) {
        course.notes = notes;
        saveData(); // Save persists notes on keystroke
    }
}

function closeDrawer(e) {
    if (!e || e.target === document.getElementById("course-details-drawer")) {
        document.getElementById("course-details-drawer").classList.remove("active");
        currentSelectedCourseCode = null;
    }
}

// Custom course insertion Modal
function showAddCourseModal() {
    document.getElementById("add-course-modal").classList.add("active");
}

function closeAddCourseModal(e) {
    if (!e || e.target === document.getElementById("add-course-modal")) {
        document.getElementById("add-course-modal").classList.remove("active");
        document.getElementById("add-course-form").reset();
    }
}

function handleCustomCourseSubmit(e) {
    e.preventDefault();

    const code = document.getElementById("add-code").value.toUpperCase().replace(/\s+/g, " ").trim();
    const name = document.getElementById("add-name").value.trim();
    const credits = parseFloat(document.getElementById("add-credits").value) || 3.0;
    const period = document.getElementById("add-period").value.trim();
    const desc = document.getElementById("add-desc").value.trim() || "Cours au choix ajouté manuellement.";
    const normCode = /^[A-Z]{4}\d{5}$/.test(code) ? code.slice(0, 4) + " " + code.slice(4) : code;

    // Seuls les cours au choix peuvent être ajoutés : les autres catégories sont fermées par le document officiel.
    if (courses.some(c => c.code === normCode)) {
        showNotification("Un cours avec ce code existe déjà !", "error");
        return;
    }
    if (archivedCourses.some(a => a.code === normCode)) {
        showNotification(`<strong>${escapeHtml(normCode)}</strong> est dans les cours archivés : utilisez « Cours au choix » dans Paramètres → Cours archivés pour le restaurer avec ses données.`, "error");
        return;
    }
    const max = PROGRAM.required.choixMax;
    if (credits > max || choixCreditsUsed() + credits > max) {
        showNotification(`<strong>Impossible</strong> : le programme n'admet que ${max} crédits de cours au choix (déjà déclarés : ${fmtCr(choixCreditsUsed())} cr).`, "error");
        return;
    }

    courses.push(normalizeCustomCourse({
        code: normCode, name, category: "choix", credits, period, mode: NOT_IN_DOC, desc,
        remarques: "Admissibilité à valider : cours de 2e cycle ou campus international à HEC Montréal (ou autre université avec approbation préalable du responsable de spécialisation).",
        status: "todo", grade: "", semester: "", notes: ""
    }));
    recomputeUnlocks();
    closeAddCourseModal();
    renderAll();
    showNotification(`<strong>${escapeHtml(normCode)}</strong> ajouté comme cours au choix. Vérifiez son admissibilité auprès de HEC.`);
}

// Supervised Project timeline calculations
const PROJECT_PHASES = [
    { name: "Revue de littérature & Sujet", durationMonths: 2, percentStart: 0, percentEnd: 33 },
    { name: "Méthodologie & Données", durationMonths: 1, percentStart: 33, percentEnd: 50 },
    { name: "Analyses & Modélisation", durationMonths: 1, percentStart: 50, percentEnd: 66 },
    { name: "Rédaction du rapport", durationMonths: 1, percentStart: 66, percentEnd: 83 },
    { name: "Dépôt & Correction", durationMonths: 1, percentStart: 83, percentEnd: 100 }
];

function calculateProjectTimeline() {
    const gantt = document.getElementById("project-gantt-timeline");
    gantt.innerHTML = "";

    const startDateStr = document.getElementById("project-start-date").value;
    if (!startDateStr) {
        gantt.innerHTML = `<div class="no-results">Renseignez la date de début pour générer le calendrier.</div>`;
        return;
    }

    const start = new Date(startDateStr + 'T00:00:00');
    let currentMonthDate = new Date(start);

    PROJECT_PHASES.forEach(phase => {
        const phaseStart = new Date(currentMonthDate);
        currentMonthDate.setMonth(currentMonthDate.getMonth() + phase.durationMonths);
        const phaseEnd = new Date(currentMonthDate);

        // Format dates
        const opt = { month: 'short', year: 'numeric' };
        const dateRangeStr = `${phaseStart.toLocaleDateString('fr-CA', opt)} - ${phaseEnd.toLocaleDateString('fr-CA', opt)}`;

        const item = document.createElement("div");
        item.className = "gantt-phase-item";
        item.innerHTML = `
            <div class="phase-meta">
                <span class="phase-name">${phase.name}</span>
                <span class="phase-duration">${phase.durationMonths} mois (${dateRangeStr})</span>
            </div>
            <div class="phase-timeline-bar-container">
                <div class="phase-timeline-fill" style="width: 100%"></div>
            </div>
            <div class="phase-dates">
                <span>Début</span>
                <span>Fin</span>
            </div>
        `;
        gantt.appendChild(item);
    });

    saveData();
}

function initMilestonesChecklist() {
    const milestones = ["ethi", "sujet", "redac", "sout"];
    milestones.forEach(m => {
        const saved = storageGet(`hec_milestone_${m}`);
        const el = document.getElementById(`chk-${m}`);
        if (el) el.checked = saved === "true";
    });
}

function toggleProjectMilestone(m) {
    const checked = document.getElementById(`chk-${m}`).checked;
    storageSet(`hec_milestone_${m}`, checked ? "true" : "false");
    renderValidation(); // la règle « sujet avant 36 cr » en dépend
    if (window.lucide) lucide.createIcons();
}

// Draw dynamic prerequisite connection lines
function drawTreeConnections() {
    const svg = document.getElementById("tree-connections-svg");
    if (!svg) return;
    svg.innerHTML = ""; // Clear existing lines

    const container = document.querySelector(".tech-tree-container");
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return; // Safeguard if section is hidden

    // Loop through all courses that have prerequisites
    courses.forEach(course => {
        if (!course.prerequisites || course.prerequisites.length === 0) return;

        const targetNodeEl = document.getElementById(`node-${course.code.replace(" ", "-")}`);
        if (!targetNodeEl) return;
        const targetRect = targetNodeEl.getBoundingClientRect();

        // Calculate connection coordinates relative to the container
        const endX = targetRect.left - containerRect.left + targetRect.width / 2;
        const endY = targetRect.top - containerRect.top;

        course.prerequisites.forEach(preCode => {
            const sourceNodeEl = document.getElementById(`node-${preCode.replace(" ", "-")}`);
            if (!sourceNodeEl) return;
            const sourceRect = sourceNodeEl.getBoundingClientRect();

            const startX = sourceRect.left - containerRect.left + sourceRect.width / 2;
            const startY = sourceRect.top - containerRect.top + sourceRect.height;

            // Generate beautifully balanced Cubic Bezier curves
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const dy = endY - startY;
            const controlY1 = startY + dy * 0.45;
            const controlY2 = endY - dy * 0.45;
            path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`);

            // Style defaults
            let strokeColor = "rgba(255, 255, 255, 0.08)";
            let strokeWidth = "2";
            let strokeDash = prereqRelation(course) === "OR" ? "7 5" : "none";
            let filter = "none";

            // If a course is selected, highlight corresponding paths
            if (currentSelectedCourseCode) {
                if (currentSelectedCourseCode === course.code) {
                    // Clicking this course highlights its prerequisites in red/orange
                    strokeColor = "var(--danger)";
                    strokeWidth = "3";
                    filter = "drop-shadow(0px 0px 4px rgba(239, 68, 68, 0.5))";
                    strokeDash = prereqRelation(course) === "OR" ? "7 5" : "none";
                } else if (currentSelectedCourseCode === preCode) {
                    // Clicking a prerequisite highlights unlocked courses in green
                    strokeColor = "var(--success)";
                    strokeWidth = "3";
                    filter = "drop-shadow(0px 0px 4px rgba(16, 185, 129, 0.5))";
                    strokeDash = prereqRelation(course) === "OR" ? "7 5" : "none";
                }
            }

            path.setAttribute("stroke", strokeColor);
            path.setAttribute("stroke-width", strokeWidth);
            path.setAttribute("stroke-dasharray", strokeDash);
            path.setAttribute("fill", "transparent");
            if (filter !== "none") {
                path.setAttribute("style", `filter: ${filter}; transition: stroke 0.3s, stroke-width 0.3s, filter 0.3s;`);
            } else {
                path.setAttribute("style", "transition: stroke 0.3s, stroke-width 0.3s, filter 0.3s;");
            }

            svg.appendChild(path);
        });
    });
}

// Handle resize to keep lines aligned
window.addEventListener("resize", () => {
    const treeSec = document.getElementById("section-tree");
    if (treeSec && treeSec.classList.contains("active")) {
        drawTreeConnections();
    }
});

// Beautiful Premium Toast/Notification Utility
function showNotification(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.position = "fixed";
        container.style.bottom = "20px";
        container.style.right = "20px";
        container.style.zIndex = "99999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `glass-panel toast-card toast-${type}`;
    
    // Custom HSL HEC styles
    toast.style.background = type === "error" ? "rgba(239, 68, 68, 0.18)" : "rgba(16, 185, 129, 0.18)";
    toast.style.border = type === "error" ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(16, 185, 129, 0.35)";
    toast.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
    toast.style.backdropFilter = "blur(12px)";
    toast.style.borderRadius = "12px";
    toast.style.padding = "14px 20px";
    toast.style.color = "#fff";
    toast.style.fontSize = "0.82rem";
    toast.style.fontWeight = "500";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "12px";
    toast.style.minWidth = "320px";
    toast.style.maxWidth = "480px";
    toast.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    toast.style.transform = "translateY(50px)";
    toast.style.opacity = "0";

    const iconLucide = type === "error" ? "alert-octagon" : "check-circle";
    const iconColor = type === "error" ? "var(--danger)" : "var(--success)";
    
    toast.innerHTML = `
        <i data-lucide="${iconLucide}" style="color:${iconColor}; flex-shrink:0; width:20px; height:20px;"></i>
        <div style="flex:1; line-height:1.4;">${message}</div>
    `;

    container.appendChild(toast);
    
    if (window.lucide) {
        lucide.createIcons();
    }

    setTimeout(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
    }, 10);

    const duration = type === "error" ? 7500 : 4000;
    setTimeout(() => {
        toast.style.transform = "translateY(-20px)";
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Beautiful Premium Custom Choice Dialog for "OR" Prerequisites
function showPrerequisiteChoiceModal(course, targetSemesterKey, choices, onSelect, onCancel) {
    const existing = document.getElementById("prereq-choice-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "prereq-choice-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(10, 14, 22, 0.75)";
    modal.style.backdropFilter = "blur(12px)";
    modal.style.zIndex = "999999";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.25s ease";

    const content = document.createElement("div");
    content.className = "glass-panel";
    content.style.maxWidth = "480px";
    content.style.width = "90%";
    content.style.padding = "25px 30px";
    content.style.borderRadius = "20px";
    content.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.7)";
    content.style.border = "1px solid rgba(255, 255, 255, 0.12)";
    content.style.background = "rgba(18, 22, 33, 0.96)";
    content.style.color = "#fff";
    content.style.transform = "scale(0.92)";
    content.style.transition = "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)";
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.gap = "15px";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "12px";
    header.innerHTML = `
        <div style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="help-circle" style="color: var(--primary); width: 22px; height: 22px;"></i>
        </div>
        <div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 600; color: #fff;">Choix du préalable requis</h3>
            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: var(--primary); font-weight: 500;">Option de préalable ("OU") détectée</p>
        </div>
    `;
    content.appendChild(header);

    const text = document.createElement("div");
    text.style.fontSize = "0.85rem";
    text.style.lineHeight = "1.5";
    text.style.color = "rgba(255, 255, 255, 0.9)";
    text.innerHTML = `Le cours <strong>${course.code}</strong> (${course.name}) requiert au moins l'un des préalables suivants. Choisissez celui que vous souhaitez planifier automatiquement :`;
    content.appendChild(text);

    const optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexDirection = "column";
    optionsContainer.style.gap = "10px";
    optionsContainer.style.margin = "8px 0";

    choices.forEach(choiceCode => {
        const choiceCourse = courses.find(c => c.code === choiceCode);
        const nameText = choiceCourse ? choiceCourse.name : "";

        const optBtn = document.createElement("button");
        optBtn.style.padding = "14px 18px";
        optBtn.style.borderRadius = "12px";
        optBtn.style.border = "1px solid rgba(255, 255, 255, 0.08)";
        optBtn.style.background = "rgba(255, 255, 255, 0.03)";
        optBtn.style.display = "flex";
        optBtn.style.flexDirection = "column";
        optBtn.style.alignItems = "flex-start";
        optBtn.style.textAlign = "left";
        optBtn.style.gap = "5px";
        optBtn.style.transition = "all 0.2s ease";
        optBtn.style.cursor = "pointer";
        optBtn.style.width = "100%";
        optBtn.style.color = "#fff";

        optBtn.innerHTML = `
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary); display: flex; align-items: center; gap: 8px;">
                <span style="background: rgba(59, 130, 246, 0.15); padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; border: 1px solid rgba(59, 130, 246, 0.25);">${choiceCode}</span>
            </div>
            <div style="font-size: 0.78rem; color: rgba(255, 255, 255, 0.7); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; font-weight: 400;">${nameText}</div>
        `;

        optBtn.onmouseenter = () => {
            optBtn.style.background = "rgba(59, 130, 246, 0.12)";
            optBtn.style.borderColor = "rgba(59, 130, 246, 0.4)";
            optBtn.style.transform = "translateY(-1px)";
        };
        optBtn.onmouseleave = () => {
            optBtn.style.background = "rgba(255, 255, 255, 0.03)";
            optBtn.style.borderColor = "rgba(255, 255, 255, 0.08)";
            optBtn.style.transform = "none";
        };

        optBtn.onclick = () => {
            modal.style.opacity = "0";
            content.style.transform = "scale(0.92)";
            setTimeout(() => {
                modal.remove();
                onSelect(choiceCode);
            }, 250);
        };

        optionsContainer.appendChild(optBtn);
    });

    content.appendChild(optionsContainer);

    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Annuler la planification";
    cancelBtn.style.width = "100%";
    cancelBtn.style.padding = "12px";
    cancelBtn.style.borderRadius = "12px";
    cancelBtn.style.border = "1px solid rgba(239, 68, 68, 0.35)";
    cancelBtn.style.background = "rgba(239, 68, 68, 0.08)";
    cancelBtn.style.color = "var(--danger)";
    cancelBtn.style.fontSize = "0.82rem";
    cancelBtn.style.fontWeight = "600";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.transition = "all 0.2s ease";

    cancelBtn.onmouseenter = () => {
        cancelBtn.style.background = "rgba(239, 68, 68, 0.18)";
    };
    cancelBtn.onmouseleave = () => {
        cancelBtn.style.background = "rgba(239, 68, 68, 0.08)";
    };
        cancelBtn.onclick = () => {
        modal.style.opacity = "0";
        content.style.transform = "scale(0.92)";
        setTimeout(() => {
            modal.remove();
            onCancel();
        }, 250);
    };

    content.appendChild(cancelBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);

    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        modal.style.opacity = "1";
        content.style.transform = "scale(1)";
    }, 10);
}

// Charge (en crédits) d'un trimestre
function semesterLoad(sem) {
    return courses.filter(c => c.semester === sem).reduce((sum, c) => sum + c.credits, 0);
}

// Choisit le meilleur trimestre parmi des candidats : offre confirmée d'abord (jamais un trimestre exclu),
// puis la charge la plus faible. Retourne null si aucun trimestre n'est possible.
function pickBestSemester(course, candidates) {
    const valid = candidates.filter(s => getOffer(course, s) !== "no");
    if (valid.length === 0) return null;
    const confirmed = valid.filter(s => getOffer(course, s) === "yes");
    const pool = confirmed.length ? confirmed : valid;
    let best = pool[0];
    let min = Infinity;
    pool.forEach(sem => {
        const load = semesterLoad(sem);
        if (load < min) { min = load; best = sem; }
    });
    return best;
}

// SOLVEUR : planifie automatiquement les préalables manquants avant un cours (sans jamais utiliser un trimestre
// où le préalable n'est pas offert), et ne touche à rien si les conditions sont déjà remplies
// (y compris lorsqu'une alternative « OU » est déjà satisfaite).
function autoSchedulePrerequisites(courseCode, targetSemesterKey, scheduledThisSession = new Set(), selectedPrereqCode = null) {
    const course = findCourse(courseCode);
    if (!course || !course.prerequisites || course.prerequisites.length === 0) return [];

    const targetIdx = SEMESTER_ORDER.indexOf(targetSemesterKey);
    if (targetIdx < 0) return [];

    const ev = evaluatePrerequisites(course, "plan", targetIdx);
    if (ev.level !== "blocked") return []; // déjà satisfait

    // Dernier trimestre où le préalable peut être placé (même trimestre si la concomitance est permise)
    const lastIdx = course.coreqAllowed ? targetIdx : targetIdx - 1;
    if (lastIdx < 0) {
        throw new Error(`<strong>Erreur de cheminement !</strong><br>Aucun trimestre n'est disponible avant ${SEMESTERS[targetSemesterKey]} pour planifier le préalable de <strong>${course.code}</strong>.`);
    }
    const candidates = SEMESTER_ORDER.slice(0, lastIdx + 1);

    let prereqsToSchedule;
    if (prereqRelation(course) === "OR") {
        prereqsToSchedule = [selectedPrereqCode || course.prerequisites[0]];
    } else {
        prereqsToSchedule = ev.missing;
    }

    let scheduledActions = [];
    prereqsToSchedule.forEach(preCode => {
        const preCourse = findCourse(preCode);
        if (!preCourse || preCourse.status === "done") return;

        const bestSem = pickBestSemester(preCourse, candidates);
        if (!bestSem) {
            throw new Error(`<strong>Erreur de cheminement !</strong><br>Le préalable <strong>${preCode}</strong> ne peut pas être planifié car il n'est pas offert durant les trimestres disponibles avant ${SEMESTERS[targetSemesterKey]} (offre : ${preCourse.period}).`);
        }

        preCourse.semester = bestSem;
        scheduledActions.push({ code: preCode, semester: bestSem });
        scheduledThisSession.add(preCode);

        // Recursively plan sub-prerequisites
        scheduledActions = scheduledActions.concat(autoSchedulePrerequisites(preCode, bestSem, scheduledThisSession));
    });

    return scheduledActions;
}

// Repousse les cours qui dépendent d'un préalable déplacé (sauf si une autre alternative « OU » reste valide).
function autoPushDependents(courseCode, prerequisiteSemesterKey) {
    const course = findCourse(courseCode);
    if (!course || !course.unlocks || course.unlocks.length === 0) return [];

    const prereqIdx = SEMESTER_ORDER.indexOf(prerequisiteSemesterKey);
    if (prereqIdx === -1) return [];

    let pushedActions = [];
    course.unlocks.forEach(unlCode => {
        const unl = findCourse(unlCode);
        if (!unl || unl.status === "done" || !unl.semester) return;
        const unlIdx = SEMESTER_ORDER.indexOf(unl.semester);
        if (unlIdx === -1) return;

        // Toujours valide (autre alternative « OU », ou concomitance autorisée) : ne rien déplacer
        if (evaluatePrerequisites(unl, "plan", unlIdx).level !== "blocked") return;

        const firstIdx = unl.coreqAllowed ? prereqIdx : prereqIdx + 1;
        const candidates = SEMESTER_ORDER.slice(firstIdx);
        const bestSem = pickBestSemester(unl, candidates);
        if (!bestSem) {
            throw new Error(`<strong>Déplacement impossible !</strong><br>Le cours <strong>${unlCode}</strong> dépend de <strong>${courseCode}</strong>, mais il n'est pas offert dans les trimestres restants après ${SEMESTERS[prerequisiteSemesterKey]}.`);
        }

        unl.semester = bestSem;
        pushedActions.push({ code: unlCode, semester: bestSem });
        pushedActions = pushedActions.concat(autoPushDependents(unlCode, bestSem));
    });

    return pushedActions;
}

function handleMoveAndSolve(courseCode, semesterKey, selectedPrereqCode = null) {
    const targetIdx = SEMESTER_ORDER.indexOf(semesterKey);

    // Backup state for atomic rollback in case of error
    const backup = courses.map(c => ({ code: c.code, semester: c.semester, status: c.status }));

    try {
        const course = findCourse(courseCode);
        if (!course) return false;

        if (semesterKey) {
            // Le cours lui-même doit être offert à ce trimestre (l'offre non confirmée est permise mais signalée)
            if (getOffer(course, semesterKey) === "no") {
                showNotification(`<strong>Trimestre non offert !</strong><br>Le cours <strong>${escapeHtml(courseCode)}</strong> est offert uniquement à la période : <strong>${escapeHtml(course.period)}</strong>.<br>Vous ne pouvez pas le planifier en ${SEMESTERS[semesterKey]}.`, "error");
                return false;
            }

            if (course.status !== "done") {
                const cp = evaluateCreditPrereq(course, "plan", targetIdx);
                if (!cp.ok) {
                    showNotification(`<strong>Crédits insuffisants !</strong><br>Le cours <strong>${escapeHtml(courseCode)}</strong> exige ${cp.required} cr de cours terminés avant de commencer. Avant ${SEMESTERS[semesterKey]}, vous n'en aurez que <strong>${cp.have.toFixed(1)}</strong> : planifiez d'abord d'autres cours plus tôt.`, "error");
                    return false;
                }
                const ev = evaluatePrerequisites(course, "plan", targetIdx);
                if (ev.level === "blocked") {
                    if (targetIdx === 0 && !course.coreqAllowed) {
                        showNotification(`<strong>Planification impossible !</strong><br>Le cours <strong>${escapeHtml(courseCode)}</strong> requiert des préalables (${escapeHtml(describePrerequisites(course))}) mais vous l'avez placé au tout premier trimestre (${SEMESTERS[SEMESTER_ORDER[0]]}) où aucun cours ne peut être planifié avant.`, "error");
                        return false;
                    }
                    // Alternatives « OU » : demander lequel planifier
                    if (prereqRelation(course) === "OR" && !selectedPrereqCode && course.prerequisites.length > 1) {
                        showPrerequisiteChoiceModal(
                            course,
                            semesterKey,
                            course.prerequisites,
                            (chosen) => { handleMoveAndSolve(courseCode, semesterKey, chosen); },
                            () => { renderAll(); } // Rollback visually
                        );
                        return false;
                    }
                }
            }
        }

        // Apply the change
        course.semester = semesterKey;
        if (!semesterKey && course.status === "progress") course.status = "todo";

        let autoScheduled = [];
        let autoPushed = [];

        if (semesterKey && course.status !== "done") {
            autoScheduled = autoSchedulePrerequisites(courseCode, semesterKey, new Set(), selectedPrereqCode); // préalables vers l'arrière
            autoPushed = autoPushDependents(courseCode, semesterKey);                                           // dépendants vers l'avant
        }

        saveData();
        renderAll();

        let notificationMsg = `Cours <strong>${escapeHtml(courseCode)}</strong> planifié en <strong>${SEMESTERS[semesterKey] || "sans trimestre"}</strong>.`;
        if (semesterKey && getOffer(course, semesterKey) === "maybe") {
            notificationMsg += `<br><span style="font-size:0.75rem;">⚠ Offre non confirmée à ce trimestre (« ${escapeHtml(course.period || "non précisée")} ») : à vérifier auprès de HEC.</span>`;
        }

        if (autoScheduled.length > 0 || autoPushed.length > 0) {
            notificationMsg += `<br><span style="font-size:0.75rem; color:rgba(255,255,255,0.85); font-weight:600; margin-top:5px; display:inline-block;">Ajustements intelligents appliqués :</span><ul style="margin-top:4px; padding-left:15px; font-size:0.72rem; text-align:left; gap:3px; display:flex; flex-direction:column;">`;
            if (autoScheduled.length > 0) {
                notificationMsg += autoScheduled.map(a => `<li>✨ Préalable <strong>${escapeHtml(a.code)}</strong> planifié en ${SEMESTERS[a.semester]}</li>`).join("");
            }
            if (autoPushed.length > 0) {
                notificationMsg += autoPushed.map(a => `<li>➡️ Cours dépendant <strong>${escapeHtml(a.code)}</strong> repoussé en ${SEMESTERS[a.semester]}</li>`).join("");
            }
            notificationMsg += `</ul>`;
        }

        showNotification(notificationMsg, "success");
        return true;
    } catch (error) {
        // Rollback state atomically
        courses.forEach((c, idx) => {
            c.semester = backup[idx].semester;
            c.status = backup[idx].status;
        });
        showNotification(error.message, "error");
        renderAll();
        return false;
    }
}

// Drag & Drop event handlers
let draggedCourseCode = null;

function dragStart(event, courseCode) {
    draggedCourseCode = courseCode;
    event.dataTransfer.setData("text/plain", courseCode);
    event.dataTransfer.effectAllowed = "move";
}

function allowDrop(event) {
    event.preventDefault();
}

function dragEnter(event, semKey) {
    event.preventDefault();
    const col = event.currentTarget;
    if (col) col.classList.add("drag-over");
}

function dragLeave(event, semKey) {
    const col = event.currentTarget;
    if (col) col.classList.remove("drag-over");
}

function dropToSemester(event, semesterKey) {
    event.preventDefault();
    const col = event.currentTarget;
    if (col) col.classList.remove("drag-over");

    const code = event.dataTransfer.getData("text/plain") || draggedCourseCode;
    if (!code) return;

    handleMoveAndSolve(code, semesterKey);
    draggedCourseCode = null;
}

function dropToPool(event) {
    event.preventDefault();
    const code = event.dataTransfer.getData("text/plain") || draggedCourseCode;
    if (!code) return;

    unscheduleCourse(code);
    draggedCourseCode = null;
}

function unscheduleCourse(courseCode) {
    const course = courses.find(c => c.code === courseCode);
    if (course) {
        course.semester = "";
        if (course.status === "progress") {
            course.status = "todo";
        }
        saveData();
        renderAll();
        showNotification(`Cours <strong>${courseCode}</strong> retiré du planificateur.`);
    }
}

// Quick Assign floating absolute popup menu
let currentOpenMenu = null;

function toggleQuickAssignMenu(event, courseCode) {
    event.stopPropagation();
    
    // Close existing menu
    if (currentOpenMenu) {
        currentOpenMenu.remove();
        currentOpenMenu = null;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const menu = document.createElement("div");
    menu.className = "quick-assign-menu";
    menu.style.top = `${window.scrollY + rect.bottom + 5}px`;
    menu.style.left = `${window.scrollX + rect.left - 50}px`;

    SEMESTER_ORDER.forEach(semKey => {
        const item = document.createElement("button");
        item.className = "quick-assign-item";
        const qaCourse = findCourse(courseCode);
        const qaOffer = qaCourse ? getOffer(qaCourse, semKey) : "yes";
        const qaHint = qaOffer === "no" ? ' <small class="qa-hint no">non offert</small>' : (qaOffer === "maybe" ? ' <small class="qa-hint maybe">à confirmer</small>' : "");
        item.innerHTML = `<span>${SEMESTERS[semKey]}${qaHint}</span> <i data-lucide="chevron-right" style="width:10px;height:10px;"></i>`;
        item.onclick = (e) => {
            e.stopPropagation();
            
            handleMoveAndSolve(courseCode, semKey);
            
            menu.remove();
            currentOpenMenu = null;
        };
        menu.appendChild(item);
    });

    document.body.appendChild(menu);
    currentOpenMenu = menu;

    // Click outside to close
    setTimeout(() => {
        window.addEventListener("click", closeQuickMenu);
    }, 50);

    if (window.lucide) lucide.createIcons();
}

function closeQuickMenu() {
    if (currentOpenMenu) {
        currentOpenMenu.remove();
        currentOpenMenu = null;
    }
    window.removeEventListener("click", closeQuickMenu);
}

// ─── Aide d'introduction par section (1re visite) + icône ⓘ pour la rouvrir ───
const INTRO_CONTENT = {
    "section-dashboard": {
        icon: "layout-dashboard", title: "Tableau de bord",
        what: "Votre vue d'ensemble du M. Sc. Intelligence d'affaires (projet supervisé) : 45 crédits.",
        goal: "Savoir en un coup d'œil où vous en êtes et ce qu'il reste à faire.",
        how: ["Les tuiles du haut montrent vos crédits : terminés, en cours, planifiés, restants.",
              "La carte « Validation du cheminement » signale les problèmes de votre plan.",
              "Cliquez sur un cours dans les listes pour ouvrir sa fiche."]
    },
    "section-courses": {
        icon: "book-open", title: "Mes cours",
        what: "Le catalogue des 26 cours du programme.",
        goal: "Consulter chaque cours et suivre votre avancement : statut, note, trimestre.",
        how: ["Filtrez avec les onglets (catégories) ou la barre de recherche.",
              "Cliquez sur une carte pour ouvrir la fiche et saisir statut, note, trimestre et notes.",
              "La pastille « Admissible » ou « Préalable manquant » indique si vous pouvez le suivre."]
    },
    "section-tree": {
        icon: "network", title: "Arbre d'études",
        what: "La carte des cours du programme et de leurs préalables.",
        goal: "Comprendre dans quel ordre suivre vos cours.",
        how: ["Cliquez sur un cours : ses préalables s'illuminent en rouge, les cours qu'il débloque en vert.",
              "Un trait en pointillés signifie « l'un OU l'autre ».",
              "Les couleurs montrent Terminé, En cours ou Planifié ; « Fiche de cours » ouvre le détail."]
    },
    "section-planner": {
        icon: "calendar-range", title: "Planificateur",
        what: "Un calendrier par trimestre, d'automne 2026 à été 2028.",
        goal: "Répartir vos 45 crédits en respectant les préalables et les trimestres d'offre.",
        how: ["Glissez une carte de la liste de gauche vers un trimestre, ou cliquez « Planifier » puis choisissez le trimestre.",
              "Le × d'une carte la retire du calendrier ; vous pouvez aussi la glisser vers un autre trimestre.",
              "Filtrez la liste par catégorie, profil (Marketing, Sciences de la décision, TI) ou recherche.",
              "Un ⚠ signale un problème : survolez-le pour le détail.",
              "Ouvrez « Conseils pour choisir vos cours » pour les recommandations d'un professeur."]
    },
    "section-project": {
        icon: "folder-kanban", title: "Projet supervisé",
        what: "Le suivi de votre projet supervisé (9 crédits, 6 mois maximum).",
        goal: "Planifier les étapes jusqu'au dépôt final.",
        how: ["Entrez votre date de début : la chronologie se calcule automatiquement.",
              "Cochez les jalons au fil du projet (ETHI 66200, sujet approuvé, rédaction, dépôt).",
              "Rappel : le sujet doit être soumis avant d'avoir cumulé 36 crédits de cours."]
    },
    "section-settings": {
        icon: "settings", title: "Paramètres",
        what: "Vos objectifs et la gestion de vos données.",
        goal: "Garder vos données en sécurité et ajuster vos objectifs.",
        how: ["Fixez votre moyenne cible et votre année de fin.",
              "Exportez régulièrement vos données (fichier JSON) : elles ne sont stockées que dans ce navigateur.",
              "Importez un export pour restaurer vos données ou changer d'appareil."]
    }
};

const INTRO_STORAGE_KEY = "hec_intro_seen";
let introOpenSection = null;
let introReturnFocus = null;

function introSeenMap() {
    try { const m = JSON.parse(storageGet(INTRO_STORAGE_KEY) || "{}"); return (m && typeof m === "object") ? m : {}; } catch (e) { return {}; }
}
function introMarkSeen(sectionId) {
    const m = introSeenMap(); m[sectionId] = true;
    storageSet(INTRO_STORAGE_KEY, JSON.stringify(m));
}

function closeIntro() {
    const ov = document.getElementById("intro-overlay");
    if (!ov) return;
    if (introOpenSection) introMarkSeen(introOpenSection);
    ov.remove();
    introOpenSection = null;
    document.removeEventListener("keydown", introKeyHandler, true);
    if (introReturnFocus && document.contains(introReturnFocus)) { try { introReturnFocus.focus(); } catch (e) { /* ignore */ } }
    introReturnFocus = null;
}

function introKeyHandler(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeIntro(); return; }
    if (e.key === "Tab") {           // le focus reste dans la fenêtre
        const btns = [...document.querySelectorAll("#intro-overlay button")];
        if (!btns.length) return;
        const first = btns[0], last = btns[btns.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
}

// force = true quand l'utilisateur clique sur l'icône ⓘ
function showIntro(sectionId, force) {
    const c = INTRO_CONTENT[sectionId];
    if (!c) return;
    if (!force && (window.__HEC_SKIP_INTRO__ || introSeenMap()[sectionId])) return;
    if (document.getElementById("intro-overlay")) closeIntro();
    introReturnFocus = document.activeElement;
    introOpenSection = sectionId;
    const ov = document.createElement("div");
    ov.id = "intro-overlay";
    ov.className = "intro-overlay";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-labelledby", "intro-title");
    ov.innerHTML = `
        <div class="intro-card" data-section="${sectionId}">
            <div class="intro-head">
                <span class="intro-head-icon"><i data-lucide="${c.icon}"></i></span>
                <h2 id="intro-title">${escapeHtml(c.title)}</h2>
                <button type="button" class="intro-close" aria-label="Fermer" onclick="closeIntro()"><i data-lucide="x"></i></button>
            </div>
            <div class="intro-block"><h4>C'est quoi ?</h4><p>${escapeHtml(c.what)}</p></div>
            <div class="intro-block"><h4>Objectif</h4><p>${escapeHtml(c.goal)}</p></div>
            <div class="intro-block"><h4>Comment s'en servir</h4><ul>${c.how.map(h => `<li>${escapeHtml(h)}</li>`).join("")}</ul></div>
            <div class="intro-footer">
                <span class="intro-hint"><i data-lucide="info"></i> Réaffichez cette aide avec l'icône ⓘ à côté du titre.</span>
                <button type="button" class="btn btn-primary" id="intro-ok" onclick="closeIntro()">Compris</button>
            </div>
        </div>`;
    ov.addEventListener("mousedown", e => { if (e.target === ov) closeIntro(); });
    document.body.appendChild(ov);
    document.addEventListener("keydown", introKeyHandler, true);
    if (window.lucide) lucide.createIcons();
    const ok = document.getElementById("intro-ok"); if (ok) ok.focus();
}

// Affiche l'aide la première fois qu'une section devient active (navigation latérale ou boutons internes)
function initSectionIntros() {
    const sections = document.querySelectorAll(".app-section");
    const check = el => { if (el.classList.contains("active")) setTimeout(() => showIntro(el.id, false), 250); };
    const obs = new MutationObserver(muts => muts.forEach(m => { if (m.attributeName === "class") check(m.target); }));
    sections.forEach(s => obs.observe(s, { attributes: true, attributeFilter: ["class"] }));
    const active = document.querySelector(".app-section.active");
    if (active) check(active);
}
document.addEventListener("DOMContentLoaded", initSectionIntros);


// ─── Conseils pour choisir ses cours (résumé des recommandations de Léo Belzile, professeur) ───
const ADVICE_SOURCE_URL = "https://lbelzile.bitbucket.io/ia.html#cours-obligatoires";
const ADVICE_STORAGE_KEY = "hec_advice_open";
const ADVICE_STATS_ORDER = ["MATH 60619", "MATH 60602", "MATH 60600"];

const ADVICE_SUMMARY = [
    "<strong>Spécialisation :</strong> 5 cours obligatoires (3 en science des données, 1 en TI, 1 en marketing), plus GEST 60401, obligatoire dans toutes les spécialisations — offert très souvent, y compris le soir et l'été.",
    "<strong>Ordre en statistiques :</strong> MATH 60619 (SAS) → MATH 60602 (R) → MATH 60600 (Python et R).",
    "<strong>Pas les trois à la fois :</strong> trop de logiciels à apprendre d'un coup. Si vous commencez à l'automne : 60619 et 60602 à l'automne, 60600 à l'hiver.",
    "<strong>MARK 60105 :</strong> offert à l'hiver seulement, après au moins un cours de statistique obligatoire.",
    "<strong>TECH 60701</strong> (offert chaque trimestre) : un cours de préparation, TECH 20712, peut être exigé avant. Si c'est votre cas, inscrivez-vous-y dès le 1er trimestre (hors des 45 crédits, non géré par cet outil).",
    "<strong>TECH 60771</strong> (option) : fortement recommandé si vous n'avez pas de cours équivalent au 1er cycle ; les tableaux de bord servent dans la plupart des stages."
];

// Position chronologique d'un cours pour les conseils : index du trimestre, -1 = réussi sans trimestre, null = non placé
function adviceOrder(c) {
    if (!c) return null;
    const i = SEMESTER_ORDER.indexOf(c.semester);
    if (i !== -1) return i;
    return c.status === "done" ? -1 : null;
}

// Conseils appliqués au plan de l'utilisateur (non bloquants : ce sont des recommandations, pas des règles)
function getPlanningAdvice() {
    const out = [];
    const o = Object.fromEntries(ADVICE_STATS_ORDER.map(code => [code, adviceOrder(findCourse(code))]));

    const same = ADVICE_STATS_ORDER.map(c => o[c]).filter(v => v !== null && v >= 0);
    if (same.length === 3 && same[0] === same[1] && same[1] === same[2]) {
        out.push({ level: "warn", text: `Vos 3 cours de statistique sont tous en ${SEMESTERS[SEMESTER_ORDER[same[0]]]} : fortement déconseillé (trop de logiciels en même temps). Étalez-les sur au moins deux trimestres.` });
    }
    const wrong = [];
    [["MATH 60619", "MATH 60602"], ["MATH 60602", "MATH 60600"], ["MATH 60619", "MATH 60600"]].forEach(([first, second]) => {
        if (o[first] !== null && o[second] !== null && o[second] < o[first]) wrong.push(`${second} avant ${first}`);
    });
    if (wrong.length) out.push({ level: "tip", text: `Ordre conseillé : MATH 60619 → 60602 → 60600. Dans votre plan : ${wrong.join(" ; ")}.` });

    const mark = findCourse("MARK 60105");
    if (mark && mark.status !== "done" && adviceOrder(mark) === null) {
        out.push({ level: "tip", text: "MARK 60105 n'est pas encore placé : il n'est offert qu'à l'hiver, après au moins un cours de statistique." });
    }
    const dash = findCourse("TECH 60771");
    if (dash) {
        if (adviceOrder(dash) === null) out.push({ level: "tip", text: "TECH 60771 (tableaux de bord) : à envisager si vous n'avez pas de cours équivalent au 1er cycle." });
        else out.push({ level: "ok", text: "TECH 60771 (tableaux de bord) fait partie de votre plan." });
    }
    return out;
}

function toggleAdvice() {
    const open = storageGet(ADVICE_STORAGE_KEY) !== "false";
    storageSet(ADVICE_STORAGE_KEY, open ? "false" : "true");
    renderPlannerAdvice();
}

function renderPlannerAdvice() {
    const box = document.getElementById("planner-advice");
    if (!box) return;
    const open = storageGet(ADVICE_STORAGE_KEY) !== "false";
    const tips = getPlanningAdvice();
    const icon = { warn: "alert-triangle", tip: "lightbulb", ok: "check-circle" };
    box.innerHTML = `
        <button type="button" class="advice-toggle" onclick="toggleAdvice()" aria-expanded="${open}" aria-controls="advice-body">
            <span class="advice-title"><i data-lucide="lightbulb"></i> Conseils pour choisir vos cours</span>
            <i data-lucide="${open ? "chevron-up" : "chevron-down"}"></i>
        </button>
        <div id="advice-body" class="advice-body"${open ? "" : " hidden"}>
            <p class="advice-source">Conseils de <strong>Léo Belzile</strong>, professeur — source :
                <a href="${ADVICE_SOURCE_URL}" target="_blank" rel="noopener noreferrer">lbelzile.bitbucket.io/ia.html#cours-obligatoires</a>.
                <em>Avis d'un professeur, pas des règles officielles de HEC.</em></p>
            <div class="advice-cols">
                <div>
                    <h4>L'essentiel</h4>
                    <ul class="advice-list">${ADVICE_SUMMARY.map(t => `<li>${t}</li>`).join("")}</ul>
                </div>
                <div>
                    <h4>Dans votre plan</h4>
                    ${tips.length ? `<ul class="advice-live">${tips.map(t => `<li class="advice-${t.level}"><i data-lucide="${icon[t.level]}"></i><span>${escapeHtml(t.text)}</span></li>`).join("")}</ul>`
                                  : `<p class="text-secondary" style="font-size:0.8rem;">Aucun conseil particulier pour l'instant.</p>`}
                </div>
            </div>
        </div>`;
    if (window.lucide) lucide.createIcons();
}

