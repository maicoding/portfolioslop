export const lehrkonzeptQuestionMap = [
  {
    question: 'Was unterscheidet Sie',
    chunks: ['lp_system_001', 'lp_aug_001', 'lp_seminar_007'],
  },
  {
    question: 'Wie arbeiten Studierende',
    chunks: ['lp_seminar_001', 'lp_seminar_004'],
  },
  {
    question: 'Was lernen Studierende',
    chunks: ['lp_seminar_002', 'lp_seminar_003'],
  },
  {
    question: 'Warum ist KI wichtig',
    chunks: ['lp_aug_001', 'lp_seminar_007'],
  },
];

export const lehrkonzeptChunks = [
  {
    id: 'lp_core_001',
    title: 'Lehre an der Schnittstelle von Praxis, KI und Reflexion',
    category: 'lehrkonzept',
    type: 'haltung',
    level: 'advanced',
    tags: ['Lehrkonzept', 'Praxis', 'KI', 'Reflexion'],
    questionVariants: [
      'Was ist der Kern deines Lehrkonzepts',
      'Worum geht es in deinem Lehrkonzept',
      'Was ist die Grundhaltung deiner Lehre',
    ],
    explanation:
      'Die Lehre entsteht an der Schnittstelle von gestalterischer Praxis, KI-basierter Produktion und kritischer Reflexion. Sie ist nicht auf einzelne Tools ausgerichtet, sondern auf die Faehigkeit, mit dynamischen Systemen umzugehen, Entscheidungen zu treffen und die eigene Praxis weiterzuentwickeln.',
    example:
      'Studierende arbeiten nicht auf Tool-Beherrschung hin, sondern darauf, Ergebnisse einordnen und in wechselnden technologischen Umgebungen handlungsfaehig bleiben zu koennen.',
    related: ['lp_future_001', 'lp_learning_001', 'lp_system_001'],
  },
  {
    id: 'lp_future_001',
    title: 'Future Skills als kontinuierliche Praxis',
    category: 'future_skills',
    type: 'haltung',
    level: 'advanced',
    tags: ['Future Skills', 'Technologie', 'Praxis'],
    questionVariants: [
      'Welche Future Skills vermittelst du',
      'Was verstehst du unter Future Skills',
      'Welche Kompetenzen sind dir wichtig',
    ],
    explanation:
      'Future Skills werden im Kontext KI-basierter Gestaltung vermittelt. Diese Kompetenzen sind nicht statisch, sondern an veraenderte Produktionsbedingungen gebunden und entstehen durch wiederholte, reflektierte Auseinandersetzung mit neuen Technologien.',
    example:
      'Statt einer einmaligen Tool-Einfuehrung entsteht Kompetenz durch kontinuierliche Praxis und Reflexion ueber neue Werkzeuge und ihre Folgen.',
    related: ['lp_core_001', 'lp_learning_001'],
  },
  {
    id: 'lp_learning_001',
    title: 'Handlungsfaehigkeit statt Tool-Beherrschung',
    category: 'lernen',
    type: 'haltung',
    level: 'advanced',
    tags: ['Studierende', 'Lernprozess', 'Technik'],
    questionVariants: [
      'Was sollen Studierende am Ende koennen',
      'Wie arbeiten Studierende mit neuen Technologien',
      'Wie fuehrst du Technik ein',
    ],
    explanation:
      'Studierende lernen, sich auf neue Technologien einzulassen, diese einzuordnen und in eigene Arbeitsweisen zu ueberfuehren. Ziel ist keine Beherrschung einzelner Tools, sondern Handlungsfaehigkeit in offenen, sich veraendernden Systemen.',
    example:
      'Technik wird nur so weit eingefuehrt, wie sie im jeweiligen Projekt noetig ist. Technisches Grundwissen ist keine Voraussetzung, sondern entsteht im gemeinsamen Prozess.',
    related: ['lp_core_001', 'lp_future_001'],
  },
  {
    id: 'lp_prompting_001',
    title: 'Prompting als Entwurfsform',
    category: 'prompting',
    type: 'haltung',
    level: 'advanced',
    tags: ['Prompting', 'Entwurf', 'Gestaltung', 'Interfaces'],
    questionVariants: [
      'Wie nutzt du Prompting in der Lehre',
      'Welche Rolle spielt Prompting',
      'Wie setzt du sprachbasierte Interfaces ein',
      'Wie lehren Sie KI Bildgestaltung',
    ],
    explanation:
      'Prompting ist eine gestalterische Praxis, keine technische Faehigkeit. Im Zentrum stehen Prompt-Systeme, iterative Feedback-Prozesse zwischen Mensch und Modell, die Uebersetzung gestalterischer Konzepte in Sprache sowie die gezielte Steuerung und Bewertung von Outputs.',
    example:
      'Studierende formulieren Konzepte sprachlich, pruefen die erzeugten Ergebnisse und verfeinern ihre Entscheidungen ueber mehrere Iterationen oder Bildserien.',
    skills: ['Prompting', 'visuelle Analyse', 'Iteration', 'Stilentwicklung'],
    related: ['lp_methods_001', 'lp_learning_001', 'lp_seminar_004'],
  },
  {
    id: 'lp_methods_001',
    title: 'Eigene Methoden fuer die Arbeit mit KI-Outputs',
    category: 'methoden',
    type: 'methode',
    level: 'advanced',
    tags: ['Reverse Prompting', 'Critical Audit Mode', 'Critical Foresight Mode'],
    questionVariants: [
      'Welche eigenen Methoden nutzt du',
      'Was ist Reverse Prompting',
      'Was ist Critical Audit Mode',
      'Was ist Critical Foresight Mode',
      'Welche Methoden nutzen Sie',
    ],
    explanation:
      'Eigene Methoden wie Reverse Prompting, Critical Audit Mode und Critical Foresight Mode strukturieren die Auseinandersetzung mit KI-Outputs. Sie machen sichtbar, wie Modelle funktionieren, wo ihre Grenzen liegen und wie gestalterische Qualitaet im Dialog mit Systemen entwickelt werden kann.',
    example:
      'Reverse Prompting hilft dabei, die eigene Idee ueber Rueckfragen des Systems zu schaerfen. Critical Audit Mode liest Outputs als etwas, das analysiert und herausgefordert werden muss. Critical Foresight Mode denkt Konsequenzen von Entscheidungen frueh mit.',
    related: ['lp_prompting_001', 'lp_ki_001', 'lp_seminar_005'],
  },
  {
    id: 'lp_formats_001',
    title: 'Kursformate zwischen Gestaltung, Code und kritischer Praxis',
    category: 'formate',
    type: 'praxis',
    level: 'intermediate',
    tags: ['Beyond HTML', 'HTTPoetics', 'Truth Machine', 'Kollaboration'],
    questionVariants: [
      'Welche Kursformate hast du entwickelt',
      'Was sind Beyond HTML und HTTPoetics',
      'Was ist Truth Machine',
      'Wie arbeitest du kollaborativ',
    ],
    explanation:
      'Zu den Lehrformaten gehoeren Kurse wie Beyond HTML und HTTPoetics, in denen Gestaltung, Code und kritische Praxis zusammengefuehrt werden. Kollaborative Projekte wie Truth Machine erweitern den Lehrraum ueber institutionelle Grenzen hinaus und verbinden unterschiedliche disziplinaere Perspektiven.',
    example:
      'Zusammenarbeit findet zwischen Studierenden, Lehrenden und Akteurinnen und Akteuren aus der Praxis statt, etwa in einem Net-Art-Projekt mit Gruppen aus Dortmund und Nairobi.',
    related: ['lp_core_001', 'lp_ki_001'],
  },
  {
    id: 'lp_ki_001',
    title: 'KI als Werkzeug und Gegenstand der Lehre',
    category: 'ki',
    type: 'haltung',
    level: 'advanced',
    tags: ['KI', 'Produktionslogiken', 'Aesthetik', 'Kontrolle'],
    questionVariants: [
      'Warum spielt KI in deinem Lehrkonzept so eine grosse Rolle',
      'Welche Rolle spielt KI in deiner Lehre',
      'Ist KI nur ein Werkzeug in deiner Lehre',
    ],
    explanation:
      'KI ist nicht nur Werkzeug, sondern auch Gegenstand der Lehre. Studierende untersuchen, wie KI-basierte Systeme Produktionslogiken veraendern, welche aesthetischen und inhaltlichen Konsequenzen daraus entstehen und wie sich gestalterische Kontrolle verschiebt, wenn Modelle und Interfaces in den Prozess eingebunden werden.',
    example:
      'Im Projekt wird nicht nur mit KI produziert, sondern auch analysiert, wie das System Entscheidungen, Ergebnisse und Rollen im Prozess mitpraegt.',
    related: ['lp_prompting_001', 'lp_methods_001', 'lp_aug_001'],
  },
  {
    id: 'lp_open_001',
    title: 'Lehre als offene und sich aktualisierende Praxis',
    category: 'haltung',
    type: 'abschluss',
    level: 'advanced',
    tags: ['Aktualitaet', 'Offenheit', 'Wandel'],
    questionVariants: [
      'Wie bleibt deine Lehre aktuell',
      'Wie verstehst du Lehre im KI Kontext',
      'Warum ist Offenheit wichtig',
    ],
    explanation:
      'Lehre wird als kritische Praxis verstanden, die sich selbst immer wieder aktualisieren muss. Gerade im Kontext von KI veraendern sich Werkzeuge, Interfaces und Moeglichkeiten schnell und grundlegend. Der Anspruch ist, diesen Wandel gemeinsam mit Studierenden zu durchdenken und zu gestalten.',
    example:
      'Aktualitaet entsteht nicht durch starre Curricula, sondern durch eine Lehre, die neue technologische Entwicklungen laufend in Reflexion und Praxis aufnimmt.',
    related: ['lp_future_001', 'lp_ki_001'],
  },
  {
    id: 'lp_system_001',
    title: 'Gestaltung als System',
    category: 'tools_workflows',
    type: 'haltung',
    level: 'advanced',
    tags: ['System', 'Design', 'Entwurf'],
    questionVariants: [
      'Was unterscheidet Sie',
      'Was unterscheidet dein Lehrkonzept',
      'Wie verstehst du Gestaltung heute',
    ],
    explanation:
      'Gestaltung wird als Aufbau von Systemen verstanden, nicht als Einzelproduktion.',
    example:
      'Ein Projekt wird als Struktur angelegt, die Inhalte generiert, verbindet und weiterentwickelt, statt nur ein einzelnes Endprodukt zu erzeugen.',
    related: ['lp_core_001', 'lp_workflow_001'],
  },
  {
    id: 'lp_workflow_001',
    title: 'Toolchains statt Einzeltools',
    category: 'tools_workflows',
    type: 'methode',
    level: 'advanced',
    tags: ['Workflow', 'Toolchains', 'System'],
    questionVariants: [
      'Wie arbeiten Studierende mit Tools',
      'Wie kombinieren Studierende mehrere Tools',
      'Welche Rolle spielen Daten',
    ],
    explanation:
      'Studierende kombinieren Tools zu eigenen Systemen.',
    example:
      'Mehrere Werkzeuge werden zu einem durchgaengigen Workflow verbunden, in dem Daten, Generierung und Ausgabe aufeinander reagieren.',
    related: ['lp_system_001', 'lp_seminar_002'],
  },
  {
    id: 'lp_aug_001',
    title: 'Augmented Creativity',
    category: 'kritik_reflexion',
    type: 'haltung',
    level: 'advanced',
    tags: ['Augmented Creativity', 'KI', 'Strategie'],
    questionVariants: [
      'Warum ist KI wichtig',
      'Wie behandeln Sie KI aktuell',
      'Wie verändert KI die Rolle von Designerinnen und Designern',
    ],
    explanation:
      'Designer arbeiten als Strategen und Kuratoren von Prozessen.',
    example:
      'KI wird als Erweiterung von Gestaltung verstanden, nicht als Ersatz. Relevanz entsteht dort, wo Systeme, Entscheidungen und Kontexte gestaltet werden.',
    related: ['lp_ki_001', 'lp_seminar_007'],
  },
  {
    id: 'lp_seminar_001',
    title: 'Postdigitale visuelle Kultur',
    category: 'workshops',
    type: 'projekt',
    level: 'advanced',
    tags: ['Postdigital', 'Mixed Media', 'Konzept'],
    questionVariants: ['Welche Inhalte vermitteln Sie', 'Womit arbeiten Studierende'],
    explanation:
      'Seminare verbinden digitale und analoge Realitaeten zu einem gemeinsamen Entwurfsraum. Projekte entstehen nicht innerhalb eines Mediums, sondern durch deren Kombination.',
    example: 'Virtuelle Skulpturen, spekulative Szenarien, Mixed-Media Publikationen.',
    skills: [
      'Konzeptentwicklung',
      'Arbeiten mit hybriden Medien',
      'Uebersetzung zwischen analog und digital',
      'Entwicklung spekulativer Szenarien',
    ],
    related: ['lp_system_001'],
  },
  {
    id: 'lp_seminar_002',
    title: 'Daten als gestalterisches System',
    category: 'tools_workflows',
    type: 'projekt',
    level: 'advanced',
    tags: ['Daten', 'Generativ'],
    questionVariants: ['Welche Rolle spielen Daten', 'Was lernen Studierende ueber Daten'],
    explanation:
      'Daten werden als aktives Gestaltungssystem verstanden. Studierende lernen, wie Daten Prozesse steuern und Gestaltung generieren koennen.',
    example: 'Datenbasierte Installationen, generative Visualisierungen.',
    skills: [
      'Datenverstaendnis',
      'generatives Denken',
      'Systemgestaltung',
      'Uebersetzung von Daten in visuelle Formen',
    ],
    related: ['lp_workflow_001'],
  },
  {
    id: 'lp_seminar_003',
    title: 'Mixed Realities und digitale Raeume',
    category: 'xr_vr',
    type: 'projekt',
    level: 'advanced',
    tags: ['VR', 'AR', 'Raum'],
    questionVariants: ['Wie arbeiten Sie mit VR und AR', 'Was lernen Studierende ueber Raum'],
    explanation:
      'Digitale Raeume werden als eigenstaendige Entwurfsform behandelt. Studierende arbeiten mit raeumlicher Wahrnehmung und Interaktion.',
    example: 'Hybride Raeume, AR-Interventionen, virtuelle Umgebungen.',
    skills: ['Spatial Design', 'VR/AR Verstaendnis', 'Interaktionslogik', 'Arbeiten mit digitalen Tools'],
    related: ['lp_system_001'],
  },
  {
    id: 'lp_seminar_004',
    title: 'Generative Bildpraxis',
    category: 'prompting',
    type: 'projekt',
    level: 'intermediate',
    tags: ['Prompting', 'KI Bild'],
    questionVariants: ['Wie lehren Sie KI Bildgestaltung'],
    explanation:
      'Bildgestaltung wird als generativer Prozess vermittelt. Studierende lernen Prompting als gestalterische Methode.',
    example: 'Bildserien durch iterative Promptentwicklung.',
    skills: ['Prompting', 'visuelle Analyse', 'Iteration', 'Stilentwicklung'],
    related: ['lp_prompting_001'],
  },
  {
    id: 'lp_seminar_005',
    title: 'Spiel als Methode',
    category: 'workshops',
    type: 'methode',
    level: 'intermediate',
    tags: ['Play', 'Experiment'],
    questionVariants: ['Welche Methoden nutzen Sie'],
    explanation:
      'Spiel wird als explorative Methode genutzt, um Systeme offen zu untersuchen.',
    example: 'Interaktive Installationen, spielbasierte Projekte.',
    skills: ['experimentelles Arbeiten', 'Iteration', 'Prototyping', 'Interaktion'],
    related: ['lp_methods_001'],
  },
  {
    id: 'lp_seminar_006',
    title: 'Digitale Raeume und Systeme',
    category: 'xr_vr',
    type: 'projekt',
    level: 'advanced',
    tags: ['Raum', 'System'],
    questionVariants: ['Was lernen Studierende ueber digitale Raeume'],
    explanation:
      'Digitale Raeume werden als Systeme gedacht, nicht als statische Umgebungen.',
    example: 'Interaktive virtuelle Umgebungen.',
    skills: ['Systemdenken', 'raeumliche Gestaltung', 'Interaktion', 'Narrative Raeume'],
    related: ['lp_system_001'],
  },
  {
    id: 'lp_seminar_007',
    title: 'Augmented Creativity im Entwurf',
    category: 'kritik_reflexion',
    type: 'projekt',
    level: 'advanced',
    tags: ['Augmented Creativity', 'KI'],
    questionVariants: ['Wie behandeln Sie KI aktuell'],
    explanation:
      'KI wird als Erweiterung von Gestaltung verstanden, nicht als Ersatz.',
    example: 'Analyse von AI Slop und Vibe Design.',
    skills: ['kritisches Denken', 'strategische Gestaltung', 'Systemverstaendnis', 'Reflexion'],
    related: ['lp_aug_001'],
  },
];

function normalizeToken(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');
}

export function tokenizeLehrkonzeptText(value = '') {
  return normalizeToken(value)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 1);
}

export function scoreLehrkonzeptChunk(question, chunk) {
  const questionTokens = tokenizeLehrkonzeptText(question);
  const haystackTokens = tokenizeLehrkonzeptText([
    chunk.title,
    chunk.category,
    chunk.type,
    chunk.level,
    ...(chunk.tags || []),
    ...(chunk.questionVariants || []),
    ...(chunk.skills || []),
    chunk.explanation,
    chunk.example,
  ].join(' '));

  const haystack = new Set(haystackTokens);
  const overlap = questionTokens.reduce((sum, token) => sum + (haystack.has(token) ? 1 : 0), 0);
  const variantBoost = (chunk.questionVariants || []).some((variant) =>
    normalizeToken(variant).includes(normalizeToken(question).trim())
  )
    ? 4
    : 0;

  const tagBoost = (chunk.tags || []).reduce(
    (sum, tag) => sum + (normalizeToken(question).includes(normalizeToken(tag)) ? 1.5 : 0),
    0,
  );

  return overlap + variantBoost + tagBoost;
}

export function retrieveLehrkonzeptChunks(question, limit = 4) {
  return lehrkonzeptChunks
    .map((chunk) => ({
      ...chunk,
      score: scoreLehrkonzeptChunk(question, chunk),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
