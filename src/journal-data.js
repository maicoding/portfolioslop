export const trends = [
  {
    id: 'interface-compression',
    label: 'Interface Compression',
    short: 'Kommunikation wird kuerzer, direkter und vergleichbarer.',
    long:
      'Interfaces, Ads und Produkttexte bewegen sich weg von Kampagne und hin zu Entscheidungshilfe. Was nicht sofort lesbar und anschlussfaehig ist, verliert an Sichtbarkeit.',
    keywords: ['copy', 'headline', 'ui', 'ads', 'prompt', 'tool', 'conversion', 'text'],
    temperature: 'cool',
    relatedResponses: ['slop-o-matic', 'i-find-the-luck'],
  },
  {
    id: 'commodity-aesthetic',
    label: 'Commodity Aesthetic',
    short: 'Alles wirkt vertraut, glatt, austauschbar und dadurch schwer erinnerbar.',
    long:
      'Sobald Interfaces dieselben Muster, Benefits und Tonlagen wiederholen, erscheint Standard wie Vernunft. Differenz wird dann riskant und visuelle Eigenheit schnell wegoptimiert.',
    keywords: ['same', 'template', 'uniform', 'brand', 'safe', 'neutral', 'interface', 'landing'],
    temperature: 'warm',
    relatedResponses: ['flexible-visual-systems', 'logo-generator'],
  },
  {
    id: 'tool-performativity',
    label: 'Tool Performativity',
    short: 'Werkzeuge sind nicht nur Mittel, sondern inszenieren Haltungen und Arbeitsweisen.',
    long:
      'Tools tragen ihre eigene Aesthetik und Ideologie mit. Wer mit ihnen arbeitet, produziert nicht nur Ergebnisse, sondern auch sichtbare Spuren des verwendeten Systems.',
    keywords: ['tool', 'workflow', 'generator', 'system', 'software', 'process', 'automation'],
    temperature: 'neutral',
    relatedResponses: ['swarm-gen', 'copy-machine'],
  },
  {
    id: 'archive-drift',
    label: 'Archive Drift',
    short: 'Feeds, Notizen und Links kippen langsam in ein persoenliches Evidenzsystem.',
    long:
      'Archive sind keine festen Speicher mehr, sondern bewegliche Schichten aus aktuellen Signalen, Resten und Wiederholungen. Bedeutung entsteht durch Verdichtung, nicht durch Ordnung allein.',
    keywords: ['archive', 'rss', 'discord', 'feed', 'signal', 'memory', 'trace', 'log'],
    temperature: 'dust',
    relatedResponses: ['i-find-the-luck'],
  },
  {
    id: 'machine-intimacy',
    label: 'Machine Intimacy',
    short: 'Fragen an Maschinen werden zu privaten, halb oeffentlichen Denkspuren.',
    long:
      'Wer Systeme befragt, dokumentiert nicht nur ein Problem, sondern auch eine Haltung. Die Frage selbst wird zum Artefakt und bleibt als Spur im Interface haengen.',
    keywords: ['question', 'ki', 'ai', 'machine', 'trust', 'answer', 'body', 'thought'],
    temperature: 'cool',
    relatedResponses: ['i-find-the-luck', 'copy-machine'],
  },
];

export const seedFragments = [
  {
    id: 'seed-001',
    text: 'Headline: 5 Woerter. Body: 2 Saetze. Kein Raum fuer Mythos.',
    trendIds: ['interface-compression'],
    source: 'essay',
    weight: 3,
  },
  {
    id: 'seed-002',
    text: 'Gute Interfaces wollen nicht mehr ueberzeugen. Sie wollen passen.',
    trendIds: ['interface-compression', 'commodity-aesthetic'],
    source: 'essay',
    weight: 3,
  },
  {
    id: 'seed-003',
    text: 'Was funktioniert, wird kopiert, bis die Norm wie Vernunft aussieht.',
    trendIds: ['commodity-aesthetic'],
    source: 'essay',
    weight: 2,
  },
  {
    id: 'seed-004',
    text: 'Das Werkzeug hinterlaesst seine Haltung im Resultat.',
    trendIds: ['tool-performativity'],
    source: 'essay',
    weight: 2,
  },
  {
    id: 'seed-005',
    text: 'Archive sind keine Schubladen mehr, sondern driftende Beweisfelder.',
    trendIds: ['archive-drift'],
    source: 'essay',
    weight: 2,
  },
  {
    id: 'seed-006',
    text: 'Eine Frage an die Maschine ist schon eine Form von Selbstprotokoll.',
    trendIds: ['machine-intimacy'],
    source: 'essay',
    weight: 2,
  },
  {
    id: 'seed-007',
    text: 'Differenz wird heute oft erst spaeter sichtbar, nicht in der ersten Oberflaeche.',
    trendIds: ['commodity-aesthetic', 'tool-performativity'],
    source: 'essay',
    weight: 1,
  },
];

export const relatedResponses = {
  'swarm-gen': {
    label: 'Swarm Gen',
    href: '/swarm-gen.html',
    note: 'Ein Partikelsystem, in dem Form aus Verhalten entsteht statt aus Vorlage.',
  },
  'slop-o-matic': {
    label: 'Slop-O-Matic',
    href: '/slop-o-matic.html',
    note: 'Eine operative Ueberzeichnung jener Sprach- und Interface-Muster, die gerade ueberall auftauchen.',
  },
  'copy-machine': {
    label: 'Copy Machine',
    href: '/copy-machine.html',
    note: 'Ein Tool fuer Druck, Abrieb und mediale Erschoepfung als sichtbare Aesthetik.',
  },
  'flexible-visual-systems': {
    label: 'Flexible Visual Systems',
    href: '/flexible-visual-systems.html',
    note: 'Ein Gegenentwurf zu starren Templates: Form entsteht jedes Mal neu aus Kontext und Raster.',
  },
  'i-find-the-luck': {
    label: 'I find the Luck 2.0',
    href: '/version-3.html',
    note: 'Eine Frage-Maschine, die Suchspuren, Bilder und Textreste zu unsteten Antworten verschaltet.',
  },
  'logo-generator': {
    label: 'Generative Logo',
    href: '/logo-generator.html',
    note: 'Ein variables Zeichensystem zwischen Identitaet, Wiederholung und Drift.',
  },
};

export const askExamples = [
  'Warum klingen gerade so viele Interfaces gleich?',
  'Was passiert mit Gestaltung, wenn Systeme auf Entscheidung statt Aufmerksamkeit optimieren?',
  'Ist ein persoenliches Archiv heute eher Feed als Sammlung?',
];
