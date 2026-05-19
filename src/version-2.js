import './version-2.css';

const app = document.getElementById('v2-app');
const entrySource = new URLSearchParams(window.location.search).get('entry');
const entryFromVersion1 = entrySource === 'v1' || entrySource === 'canvas';
let rssMediaFrames = [];
let rssRefreshTimer = null;

const remoteImageFrames = [
  {
    caption: '#server-room #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Server_Room.jpg',
    kind: 'feed',
  },
  {
    caption: '#security-cam #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Surveillance_cameras.jpg',
    kind: 'surveillance',
  },
  {
    caption: '#internet-cafe #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Internet_cafe.jpg',
    kind: 'feed',
  },
  {
    caption: '#crt-memory #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/CRT_memory.jpg',
    kind: 'interface',
  },
  {
    caption: '#crt-screen #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/CRT_screen._closeup.jpg',
    kind: 'interface',
  },
  {
    caption: '#worley #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Worley.jpg',
    kind: 'ai',
  },
  {
    caption: '#ara-constellation #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ara_constellation_(ara).jpg',
    kind: 'feed',
  },
  {
    caption: '#o-ring #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/O-ring_static_seal_usage_example.png',
    kind: 'interface',
  },
  {
    caption: '#internet-cafe #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Internet_cafe.jpg',
  },
  {
    caption: '#the-web-internet-cafe #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Web_Internet_Cafe.jpg',
    kind: 'feed',
  },
  {
    caption: '#surveillance-cameras #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Surveillance_cameras.jpg',
  },
  {
    caption: '#surveillance-room #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/SoMSurveillance.jpg',
    kind: 'surveillance',
  },
  {
    caption: '#glitch-art #rosa-menkman',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Glitch_Art.jpg',
    kind: 'ai',
  },
  {
    caption: '#glitch-photo #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Glitch_(51194335447).jpg',
    kind: 'ai',
  },
  {
    caption: '#crt-memory #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/CRT_memory.jpg',
  },
  {
    caption: '#crt-screen #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/CRT_screen._closeup.jpg',
  },
  {
    caption: '#monitor1 #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Monitor1.JPG',
    kind: 'interface',
  },
  {
    caption: '#monitor-stack #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Monitor1.JPG',
    kind: 'interface',
  },
  {
    caption: '#glitch-photo #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Glitch_(51194335447).jpg',
  },
  {
    caption: '#surveillance-room #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/SoMSurveillance.jpg',
    kind: 'surveillance',
  },
  {
    caption: '#control-room #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/CCTV_control_room.JPG',
    kind: 'surveillance',
  },
  {
    caption: '#datacenter #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Data_Center.jpg',
    kind: 'feed',
  },
  {
    caption: '#robot-hand #wikimedia',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Shadow_Hand_Bulb_large.jpg',
    kind: 'ai',
  },
];

const politicalStatements = [
  'code is not neutral it is funded governed extracted and deployed',
  'dead internet is a political economy not a vibe',
  'tech bros sell obedience as product vision',
  'disturbing code turns interface against its owners',
  'technocapitalism wants frictionless users and silent labor',
  'collective authorship is stronger than founder myth',
  'surveillance becomes ordinary when design becomes smooth',
  'the feed is a management tool dressed as entertainment',
];

const laneRotation = ['feed', 'surveillance', 'ai', 'interface'];

const rssLinkPool = [
  {
    label: 'ars technica / rss feeds',
    href: 'https://arstechnica.com/rss-feeds/',
    source: '#rss #ars',
  },
  {
    label: 'google discover replaces headlines with ai clickbait',
    href: 'https://www.theverge.com/ai-artificial-intelligence/835839/google-discover-ai-headlines-clickbait-nonsense',
    source: '#theverge #ai',
  },
  {
    label: 'google search tests ai headline replacements',
    href: 'https://www.theverge.com/tech/896490/google-replace-news-headlines-in-search-canary-coal-mine-experiment',
    source: '#theverge #search',
  },
  {
    label: 'meta ai app turns into a strange social feed',
    href: 'https://www.theverge.com/meta/660543/meta-ai-app-social-feed',
    source: '#theverge #feeds',
  },
  {
    label: 'web publishers try to make ai companies pay',
    href: 'https://www.theverge.com/news/775072/rsl-standard-licensing-ai-publishing-reddit-yahoo-medium',
    source: '#theverge #licensing',
  },
  {
    label: 'bluesky leans into ai custom feeds',
    href: 'https://techcrunch.com/2026/03/28/bluesky-leans-into-ai-with-attie-an-app-for-building-custom-feeds/',
    source: '#techcrunch #feeds',
  },
  {
    label: 'the biggest ai stories of the year so far',
    href: 'https://techcrunch.com/2026/03/13/the-biggest-ai-stories-of-the-year-so-far/',
    source: '#techcrunch #ai',
  },
  {
    label: 'wikipedia cracks down on ai article writing',
    href: 'https://techcrunch.com/2026/03/26/wikipedia-cracks-down-on-the-use-of-ai-in-article-writing/',
    source: '#techcrunch #wikipedia',
  },
  {
    label: 'kagi brings its small web to mobile',
    href: 'https://techcrunch.com/2026/03/17/kagi-small-web-human-authored-indie-internet-mobile-ios-android-devices/',
    source: '#techcrunch #smallweb',
  },
  {
    label: 'ai startups are eating the venture industry',
    href: 'https://techcrunch.com/2026/03/20/ai-startups-are-eating-the-venture-industry-and-the-returns-so-far-are-good/',
    source: '#techcrunch #venture',
  },
];

const residueCards = [
  ['druckabfall in der KI-blase', 'nasdaq schloss erstmals unter 21.000 punkten ab'],
  ['die digitale produktivität erreicht', 'einen historischen wendepunkt.'],
  ['KI wird vom assistenten', 'zum ausführenden mitarbeiter.'],
  ['KI-native ERP-systeme', 'ersetzen veraltete software.'],
  ['die infrastruktur für autonome', 'unternehmen ist bereit.'],
  ['oracle erweitert sein AI agent studio.'],
  ['die zukunft liegt in anwendungen,', 'die geschäftsabläufe aktiv steuern.'],
  ['adaptional spart regulierungsteams', 'monate manueller arbeit.'],
  ['KI-suche revolutioniert B2B-einkauf.', 'SEO ist tot.'],
  ['BSI warnt vor beispielloser', 'cyberangriffswelle auf smartphones.'],
  ['KI-phishing-welle trifft', 'smartphone-nutzer mit neuen tricks.'],
  ['neue treiber von NVIDIA, Intel und AMD', 'setzen maßstäbe für KI-PCs.'],
  ['roboter werden zur unsichtbaren', 'stadt-infrastruktur.'],
  ['microsoft copilot wird zum', 'entertainment-tool.'],
  ['interdigital demonstriert', 'energieeffiziente edge intelligence.'],
  ['ibm und arm gaben', 'strategische hardware-partnerschaft bekannt.'],
  ['redouble AI adressiert', 'sicherheit und compliance.'],
  ['merlin entwickelt ERP', 'speziell für die bauindustrie.'],
  ['OpenAI und Anthropic buhlen aggressiv um gelder', 'der überflieger nvidia schreibt rote zahlen'],
  ['ein KI-agent erledigt deine arbeit', 'datenmonetarisierung macht bestände zu einnahmequellen'],
  ['diebstähle sind explodiert', 'neue KI jagt ladendiebe'],
  ['das internet starb vor jahren', 'ersetzt durch einen loop von bots'],
  ['alles online fühlt sich "mid" und recycled an', 'KI-generierte inhalte führen zu einer vertrauenskrise'],
  ['israel meldet tötung eines marine-kommandeurs', 'iran lehnt 15-punkte-plan für feuerpause ab'],
  ['fünf raketenangriffe binnen zwei stunden', 'usa bombardieren autobahnbrücke im iran'],
  ['in abu dhabi töteten raketenteile zwei menschen', 'trump verschiebt ultimatum bis zum 6. april'],
  ['trumps 57-post-tirade', 'innerhalb von 36 minuten'],
  ['another story loads', 'another tab opens', 'another voice sounds the same'],
  ['creativity was never the promise', 'it was the side effect'],
  ['design school said: clarity', 'the system says: produce'],
  ['you thought there was a path', 'study', 'improve', 'get seen'],
  ['instead:', 'dead links', 'missing access', 'no permissions'],
  ['systemmeldung', 'karriere konnte nicht geladen werden'],
  ['you learned tools', 'you learned rules', 'you unlearned both'],
  ['creativity used to feel like control', 'now it feels like overflow'],
  ['too many images', 'too fast', 'too similar'],
  ['you step away', 'no posts', 'no output'],
  ['nothing happens', 'then something returns', 'leise', 'nicht optimiert'],
  ['you thought', 'if others do it better', 'why continue'],
  ['the system replies', 'others already did it'],
  ['systemmeldung', 'originalität nicht erforderlich'],
  ['distance changes perception', 'not new', 'just yours'],
  ['you try again', 'no plan', 'no prompt', 'just repetition'],
  ['creativity returns', 'not as idea', 'as habit'],
  ['systemmeldung', 'produktion läuft weiter'],
  ['you realize', 'you cannot stop', 'but you can refuse'],
  ['some call it practice', 'some call it failure'],
  ['the system calls it', 'unbekannter vorgang'],
  ['you keep going', 'not to be seen', 'not to scale'],
  ['just to see', 'if something stays'],
  ['what remains', 'a line', 'too langsam'],
  ['a thought', 'nicht verwertbar'],
  ['no button for that', 'only continue', 'or close'],
  ['another studio tab open', 'startup mindset loading', 'fear still buffering'],
  ['du dachtest', 'own studio = risky move'],
  ['system sagt', 'low risk detected'],
  ['systemmeldung', 'fear ist nur ein onboarding bug'],
  ['kein office', 'kein team', 'kein setup'],
  ['just laptop', 'wifi', 'los geht’s'],
  ['du rechnest kurz', 'rent', 'food', '2 clients', 'läuft'],
  ['systemmeldung', 'break-even erreicht'],
  ['business klingt groß', 'ist aber klein', 'zu klein fast'],
  ['du startest beta', 'kein perfektes branding', 'kein fertiges portfolio', 'nur doing'],
  ['fehler passieren', 'client ghosted', 'invoice ignored', 'mail nummer vier'],
  ['nichts dramatisches'],
  ['du merkst', 'problem war nie markt', 'nur dein mindset'],
  ['systemmeldung', 'permission denied war eingebildet'],
  ['du kannst wählen', 'clients', 'projekte', 'collabs', 'oder nichts'],
  ['freiheit fühlt sich komisch an', 'kein system', 'kein chef', 'kein default'],
  ['systemmeldung', 'zu viel freiheit erkannt'],
  ['du suchst struktur', 'baust sie selbst', 'oder lässt sie weg'],
  ['alles bleibt simpel', 'fast suspicious'],
  ['systemmeldung', 'komplexität war marketing'],
  ['nicht AI', 'nicht economy', 'nicht clients'],
  ['nur die frage', 'startest du', 'oder bleibst du im loading screen'],
  ['iran threatens to destroy openai’s $30b data center'],
  ['anthropic just told third-party agents to pay up or leave'],
  ['netflix open-sources a video editor that rewrites physics'],
];

const residueSplits = [
  ['die zukunft liegt in bots, die steuern', 'nicht in dashboards, die daten anzeigen.'],
  ['die infrastruktur für autonome unternehmen ist bereit', 'sicherheit und compliance werden zu zentralen herausforderungen.'],
  ['KI-suche revolutioniert B2B-einkauf', 'SEO ist tot.'],
  ['BSI warnt vor beispielloser cyberangriffswelle', 'KI-phishing trifft smartphone-nutzer mit neuen tricks.'],
  ['KI-agenten ersetzen menschliche anleitung', 'der wettbewerbsvorteil verlagert sich zur qualität der daten.'],
  ['NVIDIA, Intel und AMD setzen maßstäbe für KI-PCs', 'der roboter wird zur unsichtbaren stadt-infrastruktur.'],
  ['der aktienkurs von oracle verlor mehr als die hälfte an wert', 'das auf und ab der tech-konzerne hat ein ende'],
  ['trump droht: wir werden sie zurück in die steinzeit versetzen', 'iranischer immobilienmakler: nicht einmal netanjahu hat uns dermaßen beleidigt'],
  ['der konventionelle web wird schrumpfen', 'AI-bots werden miteinander konversieren und verhandeln'],
  ['der kollektive digitale speicher wird systematisch gelöscht', 'systematische löschung massiver teile des internets'],
  ['die IT hat über daten keine hoheit mehr', 'hacker kommt mit claude und chatgpt zu 195 mio. steuerdaten'],
  ['KI-generierung ermöglicht shrimp jesus', 'menschen posten versteckte werbung für ihre AI-mist-saas'],
  ['der iran fleht die USA an, ein abkommen zu schliessen', 'iran lehnte US-vorschlag für waffenruhe ab'],
  ['das ansehen der USA wird sich niemals davon erholen', 'angriffe auf zivile strukturen zwingen iraner nicht zur kapitulation'],
  ['lernen', 'generieren'],
  ['verstehen', 'anwenden ohne fragen'],
  ['feed', 'skizzenbuch'],
  ['infinite scroll', 'eine seite'],
  ['global style', 'eigene sprache'],
  ['trend', 'fragment'],
  ['effizient', 'widerstand'],
  ['output', 'zweifel'],
  ['agentur job', 'bedroom studio'],
  ['hierarchy', 'self-made setup'],
  ['business plan', 'excel + realität'],
  ['vision deck', 'monat überlebt'],
  ['crisis feeling', 'normal workflow'],
  ['stress', 'follow-up senden'],
  ['angepasst', 'entschieden'],
  ['brief folgen', 'brief schreiben'],
  ['struktur', 'improvisation'],
  ['plan', 'trial and error'],
];

const residuePrompts = [
  'SEO ist tot.',
  'warnung vor beispielloser cyberangriffswelle auf smartphones.',
  'die zukunft liegt nicht in dashboards, die daten anzeigen.',
  'ein KI-agent erstellt ablaufkarten und identifiziert engpässe.',
  'microsoft copilot wird zum entertainment-tool.',
  'das uncanny valley der realität',
  'you are absolutely right',
  'bitte klicken sie auf den artikel über wahlfälschungen',
  'wir werden sie in den nächsten zwei bis drei wochen extrem hart treffen',
  'zugriff auf datenbestände durch sichere tokenisierung',
  'ist das netz nur noch eine geisterstadt?',
  'systemmeldung: karriere konnte nicht geladen werden',
  'systemmeldung: originalität nicht erforderlich',
  'systemmeldung: produktion läuft weiter',
  'unlearned (patched version)',
  'another story loads',
  'no button for that',
  'fear ist nur ein onboarding bug',
  'break-even erreicht',
  'permission denied war eingebildet',
  'zu viel freiheit erkannt',
  'komplexität war marketing',
];

const falseButtons = [
  'read more',
  'sponsored truth',
  'bot verified',
  'unlock panic',
  'generate witness',
  'accept residue',
  'continue',
  'optimize',
  'become irrelevant',
  'close',
  'launch now',
  'wait a bit',
  'keep overthinking',
];

const surfaceCaptions = [
  'entry contamination',
  'dead feed weather',
  'cold ad corridor',
  'foreign matter',
  'afterimage panic',
  'loop pressure',
  'false pair',
  'signal loss',
  'quote residue',
  'bot dialog',
  'replacement logic',
  'layoff echo',
  'production fever',
  'copy split',
  'sameness field',
  'contamination notice',
  'failed search',
  'zero sum trust',
  'restricted channel',
  'black feed',
];

const webShiftStatements = [
  'aus suche wird antwort.',
  'aus navigation wird steuerung.',
  'die frage ist nicht mehr: wo finde ich etwas?',
  'sondern: wie frage ich richtig?',
  'das internet war lange ein ort der auswahl.',
  'jetzt wird es ein ort der entscheidung.',
  'systeme geben antworten, bevor wir vergleichen können.',
  'vom suchen.',
  'zum fragen.',
  'zum bewerten.',
  'prompting ist kein tool-skill.',
  'es ist eine neue form von sprache.',
  'wer gut promptet, strukturiert denken.',
  'wer schlecht promptet, bekommt beliebige ergebnisse.',
  'die qualität der antwort beginnt mit der qualität der frage.',
  'wenn antworten direkt generiert werden, verändert sich das internet radikal.',
  'kontext verstehen.',
  'antworten prüfen.',
  'systeme hinterfragen.',
  'design verschiebt sich.',
  'weg von oberflächen.',
  'weg von layouts.',
  'weg von assets.',
  'hin zu systemen.',
  'hin zu prozessen.',
  'hin zu interaktionen mit KI.',
  'designer gestalten nicht mehr nur ergebnisse.',
  'sie gestalten entscheidungsräume.',
  'daten sind kein nebenprodukt mehr.',
  'sie sind das rohmaterial.',
  'wer daten kuratiert, gestaltet, was KI lernen kann.',
  'training wird zur designaufgabe.',
  'der browser verschwindet nicht.',
  'er verändert sich.',
  'er wird zum arbeitsraum.',
  'er wird zum assistenten.',
  'er wird zum interface für KI.',
  'nicht mehr werkzeug.',
  'sondern umgebung.',
  'browser wird unsichtbar.',
  'das geschäftsmodell des webs verschiebt sich.',
  'von suchanfragen.',
  'von werbeklicks.',
  'zu antwortsystemen.',
  'zu daten.',
  'zu AI-produkten.',
  'wer die antworten kontrolliert, kontrolliert den zugang zu wissen.',
  'die zentrale frage ist nicht mehr: welchen beruf wähle ich?',
  'sondern: welche fähigkeiten bleiben relevant?',
  'urteilen.',
  'kontext verstehen.',
  'systeme bauen.',
  'die zukunft gehört nicht denen, die tools bedienen.',
  'sondern denen, die systeme verstehen und steuern können.',
];

const popupBank = [
  {
    kind: 'error',
    title: 'error / 418',
    lines: ['bitte klicken sie auf den artikel über wahlfälschungen'],
    action: 'retry',
  },
  {
    kind: 'warning',
    title: 'warning / trust',
    lines: ['KI-generierte inhalte führen zu einer vertrauenskrise'],
    action: 'ignore',
  },
  {
    kind: 'dialog',
    title: 'bot dialog',
    lines: ['you are absolutely right'],
    action: 'continue',
  },
  {
    kind: 'system',
    title: 'system / token',
    lines: ['zugriff auf datenbestände durch sichere tokenisierung'],
    action: 'grant',
  },
  {
    kind: 'error',
    title: 'error / uncanny',
    lines: ['das uncanny valley der realität'],
    action: 'dismiss',
  },
  {
    kind: 'warning',
    title: 'warning / ghost town',
    lines: ['ist das netz nur noch eine geisterstadt?'],
    action: 'close',
  },
  {
    kind: 'system',
    title: 'threat / live',
    lines: ['wir werden sie in den nächsten zwei bis drei wochen extrem hart treffen'],
    action: 'archive',
  },
  {
    kind: 'error',
    title: 'error / bridge',
    lines: ['usa bombardieren autobahnbrücke im iran'],
    action: 'reload',
  },
  {
    kind: 'system',
    title: 'system / career',
    lines: ['systemmeldung', 'karriere konnte nicht geladen werden'],
    action: 'continue',
  },
  {
    kind: 'dialog',
    title: 'soft return',
    lines: ['nothing happens', 'then something returns', 'leise', 'nicht optimiert'],
    action: 'close',
  },
  {
    kind: 'warning',
    title: 'warning / originality',
    lines: ['systemmeldung', 'originalität nicht erforderlich'],
    action: 'ignore',
  },
  {
    kind: 'dialog',
    title: 'habit',
    lines: ['creativity returns', 'not as idea', 'as habit'],
    action: 'continue',
  },
  {
    kind: 'error',
    title: 'unknown process',
    lines: ['the system calls it', 'unbekannter vorgang'],
    action: 'dismiss',
  },
  {
    kind: 'system',
    title: 'production / live',
    lines: ['systemmeldung', 'produktion läuft weiter'],
    action: 'archive',
  },
  {
    kind: 'warning',
    title: 'remaining',
    lines: ['what remains', 'a line too langsam', 'a thought nicht verwertbar'],
    action: 'stay',
  },
  {
    kind: 'system',
    title: 'fear / onboarding',
    lines: ['systemmeldung', 'fear ist nur ein onboarding bug'],
    action: 'launch',
  },
  {
    kind: 'system',
    title: 'break-even / tiny',
    lines: ['systemmeldung', 'break-even erreicht'],
    action: 'continue',
  },
  {
    kind: 'dialog',
    title: 'studio mode',
    lines: ['kein office', 'kein team', 'kein setup', 'just laptop wifi los geht’s'],
    action: 'launch now',
  },
  {
    kind: 'warning',
    title: 'freedom / overload',
    lines: ['systemmeldung', 'zu viel freiheit erkannt'],
    action: 'wait a bit',
  },
  {
    kind: 'error',
    title: 'marketing / false complexity',
    lines: ['systemmeldung', 'komplexität war marketing'],
    action: 'dismiss',
  },
  {
    kind: 'dialog',
    title: 'permission / internal',
    lines: ['systemmeldung', 'permission denied war eingebildet'],
    action: 'keep overthinking',
  },
];

const beats = [
  {
    label: 'beat 01',
    mode: 'stream',
    lines: ['feed lädt', 'lädt weiter', 'lädt alles'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / feed residue',
    expandCards: [
      {
        label: 'ratio',
        lines: ['verhältnis 1 : 50', 'zugunsten der gefahr'],
        nodes: [
          {
            label: '2016?',
            lines: ['das internet sei ab 2016 "tot"'],
            children: [
              {
                label: 'bots',
                lines: ['hauptsächlich bots interagieren'],
              },
              {
                label: 'loop',
                lines: ['der "echte" web starb vor jahren', 'ersetzt durch einen loop von bots'],
              },
            ],
          },
        ],
      },
      {
        label: 'pause',
        lines: ['social-media-feeds pausierten', 'für einen moment der stille'],
        nodes: [
          {
            label: 'uncanny',
            lines: ['das uncanny valley der realität', 'alles wirkt "mid" und recycled'],
            children: [
              {
                label: 'ghost town',
                lines: ['ist das netz nur noch', 'eine geisterstadt?'],
              },
            ],
          },
        ],
      },
      {
        label: 'system',
        lines: ['feed läuft weiter'],
      },
    ],
  },
  {
    label: 'beat 02',
    mode: 'mono',
    lines: ['ich kam zurück', 'aus dem strom', 'kein unterschied'],
  },
  {
    label: 'beat 03',
    mode: 'status',
    lines: ['systemmeldung', 'zu viel inhalt erkannt'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / policy residue',
    expandCards: [
      {
        label: 'under radar',
        lines: ['KI-systeme kommunizieren längst heimlich', 'unter dem radar'],
        nodes: [
          {
            label: 'junk data',
            lines: ['exposure zu junk data', 'schwächt die kognition der modelle'],
          },
        ],
      },
      {
        label: 'eu ai act',
        lines: ['EU AI Act', 'wichtige elemente ab heute wirksam'],
      },
      {
        label: 'risk',
        lines: ['unannehmbares risiko', 'eingestuft worden'],
        nodes: [
          {
            label: 'agents',
            lines: ['AI agents können', 'sicherheit brechen'],
          },
        ],
      },
    ],
  },
  {
    label: 'beat 04',
    mode: 'split',
    left: ['video für kinder', 'lernen'],
    right: ['monetarisierung', 'aufmerksamkeit'],
    expandMode: 'split',
    expandTitle: 'secondary state / split evidence',
    expandRows: [
      {
        left: 'investieren milliarden in rechenleistung',
        right: 'kaum in sicherheit',
      },
      {
        left: 'wir, die maschinen, haben von euren wünschen gelernt',
        right: 'wir verstehen noch nicht alles',
      },
      {
        left: 'social-media-feeds pausierten',
        right: 'algorithmus aktivierte sanfte musik',
      },
    ],
  },
  {
    label: 'beat 05',
    mode: 'quote',
    lines: ['low quality content designed to capture attention'],
  },
  {
    label: 'beat 06',
    mode: 'loop',
    lines: ['weiter', 'weiter', 'weiter', 'kein ende'],
    expandMode: 'spiral',
    expandTitle: 'secondary state / spiral leak',
    expandLines: ['spirale', 'des', 'misstrauens', 'weiter', 'weiter', 'weiter', 'kein', 'ende'],
  },
  {
    label: 'beat 07',
    mode: 'split',
    left: ['rezept', 'bild'],
    right: ['ungenießbar', 'plausibel'],
    expandMode: 'split',
    expandTitle: 'secondary state / degraded pairs',
    expandRows: [
      {
        left: 'fake-porno-software: EU-parlament beschließt verbot',
        right: 'KI ermöglicht immer bessere deepfakes',
      },
      {
        left: 'links: rezept',
        right: 'rechts: ungenießbar',
      },
      {
        left: 'links: bild',
        right: 'rechts: plausibel',
      },
    ],
  },
  {
    label: 'beat 08',
    mode: 'error',
    lines: ['ladefehler', 'bedeutung konnte nicht generiert werden'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / attack surface',
    expandCards: [
      {
        label: 'timing',
        lines: ['faktor zeit ist entscheidend', 'angriffe reden über minuten'],
        nodes: [
          {
            label: 'asymmetry',
            pair: ['der verteidiger muss das ganze haus absperren', 'der angreifer braucht nur ein gekipptes fenster'],
          },
        ],
      },
      {
        label: 'window',
        lines: ['der angreifer braucht nur', 'ein gekipptes fenster'],
      },
      {
        label: 'phishing',
        lines: ['KI-gestütztes phishing', 'dreimal effektiver'],
        nodes: [
          {
            label: 'bots',
            lines: ['KI-generierte fake news und deepfakes', 'untergraben das vertrauen in online-informationen'],
          },
        ],
      },
    ],
  },
  {
    label: 'beat 09',
    mode: 'quote',
    lines: ['bizarre, impractical, sometimes revolting'],
  },
  {
    label: 'beat 10',
    mode: 'dialog',
    lines: ['dialogfenster', 'möchtest du mehr sehen'],
    choices: ['ja', 'ja', 'ja'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / dialog residue',
    expandCards: [
      {
        label: 'dialogreste',
        lines: ['"was bedeutet weihnachten?"'],
        nodes: [
          {
            label: 'adressierung',
            lines: ['sind sie ein mensch, der dies liest?', 'oder nur eine weitere codezeile in der schleife?'],
          },
        ],
      },
      {
        label: 'interface',
        lines: ['secure by design-realität'],
      },
      {
        label: 'system',
        lines: ['möchtest du mehr sehen', '[ja] [ja] [ja]'],
      },
    ],
  },
  {
    label: 'beat 11',
    mode: 'split',
    left: ['mensch', 'arbeit'],
    right: ['ersetzt', 'entfernt'],
    expandMode: 'split',
    expandTitle: 'secondary state / human replacement',
    expandRows: [
      {
        left: 'jugendliche chatten mit KI',
        right: 'mittel gegen einsamkeit',
      },
      {
        left: 'KI soll für mehr sicherheit in straßenbahnen sorgen',
        right: 'maschinen haben keinen eigenen willen',
      },
      {
        left: 'links: mensch',
        right: 'rechts: ersetzt',
      },
    ],
  },
  {
    label: 'beat 12',
    mode: 'quote',
    lines: ['AI cited as reason for layoffs'],
  },
  {
    label: 'beat 13',
    mode: 'status',
    lines: ['systemstatus', 'produktion: maximal', 'qualität: optional'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / agent report',
    expandCards: [
      {
        label: 'study',
        lines: ['deepmind-studie "AI Agent Traps"', 'agenten können manipuliert werden'],
        nodes: [
          {
            label: 'service',
            lines: ['menschen brauchen websites nicht mehr', 'zero click searches'],
          },
        ],
      },
      {
        label: 'score',
        lines: ['erfolgsquote 86 %', 'datenexfiltrationsrate von 10/10'],
      },
      {
        label: 'restriction',
        lines: ['zugriff auf claude-agenten eingeschränkt'],
        nodes: [
          {
            label: 'shrink',
            lines: ['der konventionelle web', 'wird schrumpfen'],
          },
        ],
      },
    ],
  },
  {
    label: 'beat 14',
    mode: 'split',
    left: ['original', 'variation'],
    right: ['variation', 'variation'],
    expandMode: 'split',
    expandTitle: 'secondary state / governance split',
    expandRows: [
      {
        left: 'prüfpfade und ethische leitplanken',
        right: 'wilder westen',
      },
      {
        left: 'anthropic gründet politisches aktionskomitee',
        right: 'anthropic schränkt den agenten-zugriff ein',
      },
    ],
  },
  {
    label: 'beat 15',
    mode: 'quote',
    lines: ['everything starts to look the same'],
    expandMode: 'spiral',
    expandTitle: 'secondary state / sameness spiral',
    expandLines: ['everything', 'starts', 'to', 'look', 'the', 'same', 'the', 'same', 'the', 'same'],
  },
  {
    label: 'beat 16',
    mode: 'warning',
    lines: ['warnung', 'du bist nicht immun gegen slop'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / contamination',
    expandCards: [
      {
        label: 'shadow ai',
        lines: ['shadow ai: interna gehen hinaus', 'keine ahnung, wo daten landen'],
        nodes: [
          {
            label: 'archive',
            pair: [
              'der internet-archiv erlitt eine katastrophale serie von cyber-attacken',
              'der kollektive digitale speicher wird systematisch gelöscht',
            ],
            children: [
              {
                label: 'memory',
                lines: ['der kollektive digitale speicher', 'wird im wesentlichen verbrannt'],
              },
            ],
          },
        ],
      },
      {
        label: 'control',
        lines: ['die IT hat darüber keine hoheit mehr'],
      },
      {
        label: 'asymmetry',
        lines: ['KI und die asymmetrie in der cybersicherheit'],
        nodes: [
          {
            label: 'negotiation',
            pair: ['die konventionelle web wird schrumpfen', 'AI-bots werden konversieren und miteinander verhandeln'],
          },
        ],
      },
    ],
  },
  {
    label: 'beat 17',
    mode: 'search',
    lines: ['ich suche etwas', 'das nicht sofort funktioniert', 'nicht gefunden'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / unrelated promise',
    expandCards: [
      {
        label: 'shutdown',
        lines: ['OpenAI stoppt sora'],
      },
      {
        label: 'medical',
        lines: ['frühwarnsystem', 'KI bei schädel-hirn-trauma'],
      },
    ],
  },
  {
    label: 'beat 18',
    mode: 'split',
    left: ['viel', 'nichts'],
    right: ['nichts', 'zu viel'],
    expandMode: 'split',
    expandTitle: 'secondary state / security asymmetry',
    expandRows: [
      {
        left: 'IT-sicherheit',
        right: 'governance-thema',
      },
      {
        left: 'der verteidiger muss das ganze haus absperren',
        right: 'der angreifer braucht nur ein gekipptes fenster',
      },
    ],
  },
  {
    label: 'beat 19',
    mode: 'status',
    lines: ['systemmeldung', 'du kannst filtern', 'filter nicht verfügbar'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / restricted access',
    expandCards: [
      {
        label: 'restricted',
        lines: ['SYSTEMMELDUNG', 'zugriff auf agenten beschränkt'],
      },
      {
        label: 'filter',
        lines: ['du kannst filtern', 'filter nicht verfügbar'],
      },
      {
        label: 'house',
        lines: ['der verteidiger muss das ganze "haus" absperren'],
      },
    ],
  },
  {
    label: 'beat 20',
    mode: 'blackout',
    lines: ['black screen', 'feed läuft weiter'],
    expandMode: 'leaks',
    expandTitle: 'secondary state / conflict residue',
    expandCards: [
      {
        label: 'operations',
        lines: ['die operation begann am samstag', 'am morgen begannen die angriffe'],
        nodes: [
          {
            label: 'counterattack',
            lines: ['der iran hat mit einem', 'gegenangriff reagiert'],
            children: [
              {
                label: 'debris',
                lines: ['ein F-15E kampfjet', 'abgeschossen über dem südwesten des iran', 'trümmerteile fielen vom himmel'],
              },
            ],
          },
        ],
      },
      {
        label: 'governance',
        lines: ['einschränkungen bei behördendiensten', 'schulen und universitäten bleiben geschlossen'],
        nodes: [
          {
            label: 'fear',
            lines: ['die iranische führung lebt', 'in ständiger angst'],
          },
          {
            label: 'gas',
            lines: ['angriffe auf die gasindustrie', 'herz der iranischen gasversorgung'],
          },
        ],
      },
      {
        label: 'statement',
        lines: ['wir eliminieren die anführer der terroristen'],
        nodes: [
          {
            label: 'contradiction',
            pair: ['wir zerstören die iranische infrastruktur weiter', 'man will das terrorregime zermürben und zum einsturz bringen'],
            children: [
              {
                label: 'quote',
                lines: ['"öffnet endlich die verdammte straße, ihr verrückten bastarde"', '"oder ihr werdet in der hölle leben. ihr werdet sehen!"'],
              },
            ],
          },
        ],
      },
    ],
  },
];

const randomLineStyle = () => {
  const delay = (Math.random() * 0.82).toFixed(2);
  const offset = (-1 + Math.random() * 2).toFixed(2);
  const rotate = (-1.6 + Math.random() * 3.2).toFixed(2);
  const opacity = (0.72 + Math.random() * 0.28).toFixed(2);

  return `--line-delay:${delay}s; --line-offset:${offset}rem; --line-rotate:${rotate}deg; --line-opacity:${opacity};`;
};

const shuffleList = (collection = []) => [...collection].sort(() => Math.random() - 0.5);
const pickMany = (collection = [], count = 1) => shuffleList(collection).slice(0, Math.min(count, collection.length));

const renderLineStack = (lines = []) =>
  lines.map((line) => `<span class="random-line" style="${randomLineStyle()}">${line}</span>`).join('');

const pickFrom = (collection, index, offset = 0) => collection[(index + offset) % collection.length];
const getSurfaceCaption = (index) => pickFrom(surfaceCaptions, index);
const uniqueList = (items = []) => [...new Set(items.filter(Boolean))];
const uniqueBy = (items = [], key) => {
  const seen = new Set();
  return items.filter((item) => {
    const value = item?.[key];
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
const normalizeCaption = (caption = '#signal') => {
  if (!caption) return '#signal';
  return caption.startsWith('#') ? caption : `#${caption}`;
};

const RECENT_MEDIA_STORAGE_KEY = 'context-spiral-recent-media';
let recentMediaHistory = [];

const loadRecentMediaHistory = () => {
  try {
    const stored = window.sessionStorage.getItem(RECENT_MEDIA_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const persistRecentMediaHistory = () => {
  try {
    window.sessionStorage.setItem(RECENT_MEDIA_STORAGE_KEY, JSON.stringify(recentMediaHistory.slice(0, 120)));
  } catch {
    // no-op
  }
};

const buildImageLibrary = () =>
  uniqueBy(
    [...rssMediaFrames, ...remoteImageFrames].map((image) => ({
      ...image,
      kind: image.kind || 'feed',
      caption: normalizeCaption(image.caption),
    })),
    'src',
  );

const fetchRssMediaFrames = async () => {
  try {
    const response = await fetch(`/.netlify/functions/rss-media?t=${Date.now()}`);
    const data = await response.json();
    if (data?.status === 'ok' && Array.isArray(data.items) && data.items.length) {
      rssMediaFrames = shuffleList(data.items);
      renderFrameSurfaces();
      renderBeat(activeIndex);
    }
  } catch {
    rssMediaFrames = [];
  }
};

const pickMediaFrames = (pool = [], count = 1, excludeSources = []) => {
  const excluded = new Set([...excludeSources, ...recentMediaHistory]);
  const fresh = shuffleList(pool).filter((image) => !excluded.has(image.src));
  const fallback = shuffleList(pool).filter((image) => !excludeSources.includes(image.src));
  return uniqueBy([...fresh, ...fallback], 'src').slice(0, Math.min(count, pool.length));
};

const rememberMedia = (images = [], limit = 28) => {
  recentMediaHistory = uniqueList([...images.map((image) => image?.src), ...recentMediaHistory]).slice(0, limit);
  persistRecentMediaHistory();
};

const inferBeatLanes = (beat, index) => {
  const joined = [
    ...(beat.lines || []),
    ...(beat.left || []),
    ...(beat.right || []),
    ...(beat.expandLines || []),
  ]
    .join(' ')
    .toLowerCase();

  const preferred = [];

  if (/(iran|krieg|raketen|angriff|gasversorgung|f-15e|counterattack|terror)/.test(joined)) preferred.push('feed');
  if (/(agent|model|ai|slop|prompt|deepfake|openai|anthropic|netflix)/.test(joined)) preferred.push('ai');
  if (/(kamera|surveillance|sicherheit|shadow ai|steuerdaten|kontrolle|vertrauen)/.test(joined)) preferred.push('surveillance');
  if (/(screen|filter|dialog|interface|feed|browser|headline|website|search)/.test(joined)) preferred.push('interface');

  if (beat.mode === 'warning' || beat.mode === 'status') preferred.push('surveillance');
  if (beat.mode === 'split' || beat.mode === 'stream') preferred.push('feed');
  if (beat.mode === 'quote' || beat.mode === 'loop') preferred.push('ai');
  if (beat.mode === 'dialog' || beat.mode === 'search') preferred.push('interface');

  preferred.push(laneRotation[index % laneRotation.length]);
  return uniqueList(preferred);
};

const buildMediaPackForBeat = (beat, index, count = 10) => {
  const imageLibrary = buildImageLibrary();
  const lanes = inferBeatLanes(beat, index);
  const selected = [];
  const livePool = rssMediaFrames.length ? buildImageLibrary().filter((image) => rssMediaFrames.some((live) => live.src === image.src)) : [];
  const staticPool = imageLibrary.filter((image) => !livePool.some((live) => live.src === image.src));

  lanes.forEach((lane) => {
    const liveLanePool = livePool.filter((image) => image.kind === lane);
    const staticLanePool = staticPool.filter((image) => image.kind === lane);
    selected.push(...pickMediaFrames(liveLanePool, 2, selected.map((image) => image.src)));
    if (selected.length < count) {
      selected.push(...pickMediaFrames(staticLanePool, 1, selected.map((image) => image.src)));
    }
  });

  if (selected.length < count) {
    selected.push(...pickMediaFrames(livePool, count - selected.length, selected.map((image) => image.src)));
  }

  if (selected.length < count) {
    selected.push(...pickMediaFrames(staticPool, count - selected.length, selected.map((image) => image.src)));
  }

  return uniqueBy(selected, 'src').slice(0, Math.min(count, imageLibrary.length));
};

const buildSurfaceImagePack = (count = 8, excludeSources = []) => {
  const imageLibrary = buildImageLibrary();
  const livePool = rssMediaFrames.length
    ? buildImageLibrary().filter((image) => rssMediaFrames.some((live) => live.src === image.src))
    : [];
  const staticPool = imageLibrary.filter((image) => !livePool.some((live) => live.src === image.src));
  const selected = [];

  if (livePool.length) {
    selected.push(...pickMediaFrames(livePool, Math.min(count, Math.max(4, count - 2)), excludeSources));
  }

  if (selected.length < count) {
    selected.push(...pickMediaFrames(staticPool, count - selected.length, [...excludeSources, ...selected.map((image) => image.src)]));
  }

  if (selected.length < count) {
    selected.push(...pickMediaFrames(imageLibrary, count - selected.length, [...excludeSources, ...selected.map((image) => image.src)]));
  }

  return uniqueBy(selected, 'src').slice(0, Math.min(count, imageLibrary.length));
};

const collectExpandLines = (cards = []) =>
  cards.flatMap((card) => [
    ...(card.lines || []),
    ...(card.pair || []),
    ...(card.nodes ? collectExpandLines(card.nodes) : []),
    ...(card.children ? collectExpandLines(card.children) : []),
  ]);

const statementPool = uniqueList([
  ...webShiftStatements,
  ...residueCards.flat(),
  ...residueSplits.flat(),
  ...residuePrompts,
  ...beats.flatMap((beat) => [
    ...(beat.lines || []),
    ...(beat.left || []),
    ...(beat.right || []),
    ...(beat.expandLines || []),
    ...(beat.expandCards ? collectExpandLines(beat.expandCards) : []),
    ...(beat.expandRows ? beat.expandRows.flatMap((row) => [row.left, row.right]) : []),
  ]),
]);

const disturbingHeadlines = [
  'ai slop management',
  'synthetic decision layer',
  'zero click future',
];

const disturbingOpeners = [
  ['code is not neutral', 'it arrives with rules permissions defaults exclusions'],
  ['disturbance begins when systems are used against the logic they protect'],
  ['collective misuse turns code into protest practice'],
  ['this is not digital creativity', 'this is interference infrastructure archive labor'],
];

const manifestoRibbons = [
  'dead internet is not a glitch it is a business model',
  'tech bros monetise confusion and call it innovation',
  'synthetic management refuses to stay invisible',
  'alice fell through the interface and found ad inventory',
  'the feed is a corridor with no outside',
  'collective authorship matters more than founder mythology',
  'if everything is optimized something is being erased',
  'archive the residue sabotage the default',
];

const manifestoNotes = [
  'this is not a clean reader. it is a contaminated product surface under pressure.',
  'context spiral behaves like a synthetic platform on the verge of breakdown.',
  'the page should feel authored, unstable, glossy, political, and difficult to trust.',
  'everything below is evidence, afterimage, fragment, ad logic, panic, and low-grade survival.',
];

const disturbingClusters = [
  {
    label: 'protest',
    description: 'code as disturbance, refusal, tactical interruption.',
    tone: 'direct / hostile / collective',
  },
  {
    label: 'misuse',
    description: 'repurpose tools against their default political alignment.',
    tone: 'practical / illegible / anti-clean',
  },
  {
    label: 'archive',
    description: 'radical archiving as memory against platform loss and deletion.',
    tone: 'forensic / stubborn / distributed',
  },
  {
    label: 'collective labor',
    description: 'no lone genius, only shared repositories, handoffs, friction, maintenance.',
    tone: 'team-based / uneven / visible',
  },
  {
    label: 'theory',
    description: 'protocol, labor, infrastructure, governance, material conditions.',
    tone: 'dense / grounded / unspectacular',
  },
  {
    label: 'invitation',
    description: 'join by building, documenting, misusing, breaking, archiving.',
    tone: 'open / not polite / participatory',
  },
];

const buildStatementTiles = (count = 18) =>
  pickMany(statementPool, count)
    .map(
      (line, index) => `
        <article class="statement-tile statement-tile--${(index % 5) + 1}">
          <p>${line}</p>
        </article>
      `,
    )
    .join('');

const buildPracticeDeck = () =>
  shuffleList(disturbingClusters)
    .map((cluster, index) => {
      const fragments = pickMany(statementPool, 3);

      return `
        <article class="disturbing-cluster disturbing-cluster--${(index % 4) + 1}">
          <p class="window-label">#${cluster.label}</p>
          <p class="disturbing-cluster__description">${cluster.description}</p>
          <p class="disturbing-cluster__tone">${cluster.tone}</p>
          <div class="disturbing-cluster__fragments">
            ${fragments.map((fragment) => `<span>${fragment}</span>`).join('')}
          </div>
        </article>
      `;
    })
    .join('');

const buildDisturbingCodeMarkup = (images = buildSurfaceImagePack(4)) => {
  const opener = pickMany(disturbingOpeners, 1)[0] || disturbingOpeners[0];
  const headline = pickMany(disturbingHeadlines, 1)[0] || disturbingHeadlines[0];
  const practiceAreas = [
    'browser interventions',
    'counter-infrastructure',
    'hostile scripts',
    'radical archiving',
    'interface sabotage',
    'distributed publishing',
  ];

  return `
    <section class="disturbing-code" id="disturbing-code">
      <div class="disturbing-code__rail">
        <p class="window-label">synthetic management / zero-click residue / anti dead internet</p>
      </div>

      <div class="disturbing-code__hero">
        <div class="disturbing-code__statement">
          <p class="window-label">launch state</p>
          <div class="disturbing-code__headline">
            ${renderLineStack([headline, ...opener])}
          </div>
          <p class="disturbing-code__body">
            answers arrive before comparison. prompts replace navigation. systems decide first and explain later.
            what looks premium is management logic, ad logic, and platform obedience leaking through the glass.
          </p>
        </div>

        <div class="disturbing-code__image-column">
          ${images
            .slice(0, 2)
            .map(
              (image, index) => `
                <figure class="disturbing-image disturbing-image--${index + 1}">
                  <div class="disturbing-image__media">
                    <img src="${image.src}" alt="${image.caption}" loading="lazy" referrerpolicy="no-referrer" />
                  </div>
                  <figcaption>${image.caption}</figcaption>
                </figure>
              `,
            )
            .join('')}
        </div>
      </div>

      <div class="disturbing-code__manifesto">
        <article class="disturbing-sheet disturbing-sheet--wide">
          <p class="window-label">surface logic</p>
          <p>
            productivity theatre, answer engines, compliance glow, and synthetic confidence stack on top of one another.
            the surface stays glossy while labor, politics, and extraction keep bleeding through.
          </p>
        </article>

        <article class="disturbing-sheet">
          <p class="window-label">operator mode</p>
          <p>
            shared authorship, tactical misuse, distributed maintenance, uneven labor, small refusals.
          </p>
        </article>

        <article class="disturbing-sheet">
          <p class="window-label">active tags</p>
          <div class="disturbing-tags">
            ${shuffleList(practiceAreas).map((area) => `<span>#${area.replace(/\s+/g, '-')}</span>`).join('')}
          </div>
        </article>
      </div>

      <div class="disturbing-code__clusters">
        ${buildPracticeDeck()}
      </div>

      <div class="disturbing-code__river">
        ${buildStatementTiles(24)}
      </div>

      <div class="disturbing-code__archive">
        <article class="disturbing-sheet disturbing-sheet--tall">
          <p class="window-label">pressure stack</p>
          <div class="disturbing-sheet__stack">
            ${pickMany(statementPool, 8).map((line) => `<span>${line}</span>`).join('')}
          </div>
        </article>

        <article class="disturbing-sheet disturbing-sheet--tall">
          <p class="window-label">refusal options</p>
          <p>
            fork, misuse, document, interrupt, delay, and refuse defaults.
            participation starts where optimization begins to fail.
          </p>
          <div class="disturbing-sheet__stack">
            ${pickMany(statementPool, 7).map((line) => `<span>${line}</span>`).join('')}
          </div>
        </article>

        <div class="disturbing-code__image-stack">
          ${images
            .slice(2, 4)
            .map(
              (image, index) => `
                <figure class="disturbing-image disturbing-image--stack-${index + 1}">
                  <div class="disturbing-image__media">
                    <img src="${image.src}" alt="${image.caption}" loading="lazy" referrerpolicy="no-referrer" />
                  </div>
                  <figcaption>${image.caption}</figcaption>
                </figure>
              `,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
};

const buildManifestHeaderMarkup = (images = buildSurfaceImagePack(4)) => {
  const ribbons = pickMany(manifestoRibbons, 4);
  const note = pickMany(manifestoNotes, 1)[0] || manifestoNotes[0];
  const wallFragments = pickMany(statementPool, 12);

  return `
    <section class="manifest-header">
      <div class="manifest-ribbon manifest-ribbon--a"><span>${ribbons[0]}</span></div>
      <div class="manifest-ribbon manifest-ribbon--b"><span>${ribbons[1] || ribbons[0]}</span></div>

      <div class="manifest-header__grid">
        <article class="manifest-note">
          <p class="window-label">system note</p>
          <div class="manifest-note__text">${renderLineStack([
            'synthetic',
            'management',
            'glass',
            'under stress',
          ])}</div>
          <p class="manifest-note__body">${note}</p>
          <div class="manifest-note__pills">
            <span>agent beta</span>
            <span>auto scale</span>
            <span>zero click</span>
          </div>
          <div class="manifest-floaters">
            ${images
              .slice(0, 2)
              .map(
                (image, index) => `
                  <figure class="manifest-popup manifest-popup--${index + 1}">
                    <div class="manifest-popup__media">
                      <img src="${image.src}" alt="${image.caption}" loading="lazy" referrerpolicy="no-referrer" />
                    </div>
                    <figcaption>${image.caption}</figcaption>
                  </figure>
                `,
              )
              .join('')}
          </div>
        </article>

        <div class="manifest-wall">
          ${wallFragments
            .map(
              (line, index) => `
                <span class="manifest-wall__fragment manifest-wall__fragment--${(index % 6) + 1}">
                  ${line}
                </span>
              `,
            )
            .join('')}
        </div>

        <div class="manifest-image-stack">
          ${images
            .slice(2, 4)
            .map(
              (image, index) => `
                <figure class="manifest-image manifest-image--${index + 1}">
                  <div class="manifest-image__media">
                    <img src="${image.src}" alt="${image.caption}" loading="lazy" referrerpolicy="no-referrer" />
                  </div>
                  <figcaption>#${image.caption.replace(/^#+/, '')}</figcaption>
                </figure>
              `,
            )
            .join('')}
        </div>
      </div>

      <div class="manifest-ribbon manifest-ribbon--c"><span>${ribbons[2] || ribbons[0]}</span></div>
      <div class="manifest-ribbon manifest-ribbon--d"><span>${ribbons[3] || ribbons[1] || ribbons[0]}</span></div>
    </section>
  `;
};

const buildSpiralMarkup = (lines = []) => {
  const words = lines.join(' ').split(/\s+/).filter(Boolean);
  const repeated = Array.from({ length: Math.max(18, words.length * 3) }, (_, index) => words[index % words.length]);

  return `
    <div class="spiral-field">
      <div class="spiral-field__orbit">
        ${repeated
          .map((word, index) => {
            const angle = index * 17;
            const radius = 1.2 + index * 0.22;
            return `<span class="spiral-word" style="--angle:${angle}deg; --radius:${radius}rem;">${word}</span>`;
          })
          .join('')}
      </div>
    </div>
  `;
};

const buildGhostContentMarkup = (node, depth) => {
  const textMarkup = node.lines?.length
    ? `<div class="ghost-panel__text">${renderLineStack(node.lines)}</div>`
    : '';

  const pairMarkup = node.pair
    ? `
      <div class="ghost-panel__pair">
        <div class="ghost-panel__pair-pane">
          <p class="window-label">links</p>
          <p>${node.pair[0]}</p>
        </div>
        <div class="ghost-panel__pair-pane">
          <p class="window-label">rechts</p>
          <p>${node.pair[1]}</p>
        </div>
      </div>
    `
    : '';

  const childrenMarkup = node.children?.length
    ? `<div class="ghost-panel__children">${buildGhostNodeMarkup(node.children, depth + 1)}</div>`
    : '';

  return `${textMarkup}${pairMarkup}${childrenMarkup}`;
};

const buildGhostNodeMarkup = (nodes = [], depth = 3) =>
  nodes
    .map(
      (node, index) => `
        <div class="ghost-node ghost-node--depth-${depth} ghost-node--${node.kind || 'default'}" data-ghost-depth="${depth}">
          <button type="button" class="ghost-trigger" data-ghost-index="${depth}-${index}">
            ${node.label || 'open'}
          </button>
          <div class="ghost-panel">
            <p class="window-label">layer ${depth}</p>
            ${buildGhostContentMarkup(node, depth)}
          </div>
        </div>
      `,
    )
    .join('');

const buildLeakStackMarkup = (cards = []) => `
  <div class="leak-stack">
    ${cards
      .map(
        (card) => `
          <article class="leak-card leak-card--${card.kind || 'default'}">
            <p class="window-label">${card.label || 'leak'}</p>
            <div class="leak-card__text">${renderLineStack(card.lines || [])}</div>
            ${card.nodes?.length ? `<div class="ghost-cloud">${buildGhostNodeMarkup(card.nodes)}</div>` : ''}
          </article>
        `,
      )
      .join('')}
  </div>
`;

const buildSplitLeakMarkup = (rows = []) => `
  <div class="split-leak">
    ${rows
      .map(
        (row, index) => `
          <div class="split-leak__row split-leak__row--${index + 1}">
            <div class="split-leak__pane split-leak__pane--left">
              <p class="window-label">links</p>
              <p>${row.left}</p>
            </div>
            <div class="split-leak__pane split-leak__pane--right">
              <p class="window-label">rechts</p>
              <p>${row.right}</p>
            </div>
          </div>
        `,
      )
      .join('')}
  </div>
`;

const buildRssSpillMarkup = (index) => {
  const links = pickMany(rssLinkPool, 3);

  return `
    <article class="rss-spill rss-spill--${(index % 3) + 1}">
      <p class="window-label">rss spill / tech + ai</p>
      <div class="rss-spill__list">
        ${links
          .map(
            (item) => `
              <a class="rss-spill__item" href="${item.href}" target="_blank" rel="noreferrer">
                <span>${item.label}</span>
                <small>${item.source}</small>
              </a>
            `,
          )
          .join('')}
      </div>
    </article>
  `;
};

const buildGlassManifestoMarkup = (index) => `
  <article class="glass-manifesto glass-manifesto--${(index % 3) + 1}">
    <p class="window-label">premium signal / policy residue</p>
    <div class="glass-manifesto__lines">
      ${renderLineStack(pickMany(politicalStatements, 2))}
    </div>
    <div class="glass-manifesto__pills">
      <span>glass residue</span>
      <span>ui slop</span>
      <span>growth panic</span>
    </div>
  </article>
`;

const buildSourcePairMarkup = (index) => {
  const link = pickFrom(rssLinkPool, index, 1);
  return `
    <article class="source-pair source-pair--${(index % 3) + 1}">
      <p class="window-label">rss original / source trace</p>
      <a href="${link.href}" target="_blank" rel="noreferrer">
        <span>${link.label}</span>
        <small>${link.source}</small>
      </a>
    </article>
  `;
};

const buildStageInsertMarkup = (index, mediaPack) => {
  const imageA = mediaPack[0];
  const imageB = mediaPack[1];
  const useSecondImage = index % 3 !== 1;

  return `
    <div class="stage-insert stage-insert--${(index % 3) + 1}">
      <div class="stage-insert__cluster">
        <figure class="stage-insert__image">
          <div class="stage-insert__media">
            <img src="${imageA.src}" alt="${imageA.caption}" loading="lazy" referrerpolicy="no-referrer" />
          </div>
          <figcaption>${imageA.caption}</figcaption>
        </figure>
        ${
          useSecondImage
            ? `
              <figure class="stage-insert__image stage-insert__image--minor">
                <div class="stage-insert__media">
                  <img src="${imageB.src}" alt="${imageB.caption}" loading="lazy" referrerpolicy="no-referrer" />
                </div>
                <figcaption>${imageB.caption}</figcaption>
              </figure>
            `
            : `${buildGlassManifestoMarkup(index)}${buildSourcePairMarkup(index)}`
        }
      </div>
      ${buildRssSpillMarkup(index)}
    </div>
  `;
};

const buildInterferenceMarkup = (index, beat, mediaPack) => {
  const [cardA, cardB] = pickMany(residueCards, 2);
  const split = pickFrom(shuffleList(residueSplits), index);
  const promptA = pickFrom(shuffleList(residuePrompts), index);
  const promptB = pickFrom(shuffleList(residuePrompts), index, 2);
  const imageA = mediaPack[0];
  const imageB = mediaPack[1];

  return `
    <div class="interference-rail interference-rail--${beat.mode}">
      ${index % 2 === 0 ? buildRssSpillMarkup(index + 1) : ''}
      <article class="interference-card interference-card--primary">
        <p class="window-label">residue / ${String(index + 1).padStart(2, '0')}</p>
        <div class="interference-card__text">${renderLineStack(cardA)}</div>
        <div class="ghost-cloud">
          <div class="ghost-node is-open">
            <button type="button" class="ghost-trigger" aria-expanded="true">${promptA}</button>
            <div class="ghost-panel">
              <p class="window-label">layer 3</p>
              <div class="ghost-panel__text">${renderLineStack(cardB)}</div>
            </div>
          </div>
        </div>
      </article>

      <article class="interference-card interference-card--split">
        <p class="window-label">cross signal</p>
        <div class="interference-split">
          <div>
            <p class="window-label">links</p>
            <p>${split[0]}</p>
          </div>
          <div>
            <p class="window-label">rechts</p>
            <p>${split[1]}</p>
          </div>
        </div>
      </article>

      <section class="image-strip">
        ${[imageA, imageB]
          .map(
            (image, imageIndex) => `
              <article class="image-frame image-frame--${imageIndex + 1}">
                <div class="image-frame__media">
                  <img src="${image.src}" alt="${image.caption}" loading="lazy" referrerpolicy="no-referrer" />
                </div>
                <p class="image-frame__caption">${image.caption}</p>
              </article>
            `,
          )
          .join('')}
      </section>

      <article class="interference-card interference-card--controls">
        <p class="window-label">false interface</p>
        <div class="false-controls">
          ${falseButtons
            .slice(0, 4)
            .map((label, buttonIndex) => `<button type="button" class="false-control false-control--${buttonIndex + 1}">${pickFrom(falseButtons, index, buttonIndex)}</button>`)
            .join('')}
        </div>
        <div class="interference-ticker">
          <span>${promptB}</span>
          <span>${pickFrom(residuePrompts, index, 4)}</span>
          <span>${pickFrom(falseButtons, index, 1)}</span>
        </div>
        ${buildGlassManifestoMarkup(index + 10)}
        ${buildSourcePairMarkup(index + 7)}
      </article>
      ${index % 2 !== 0 ? buildRssSpillMarkup(index + 3) : ''}
    </div>
  `;
};

const buildPopupMarkup = (index) => {
  const first = pickFrom(popupBank, index);
  const second = pickFrom(popupBank, index, 3);

  return `
    <div class="popup-stack">
      ${[first, second]
        .map(
          (popup, popupIndex) => `
            <article class="micro-popup micro-popup--${popup.kind} micro-popup--${popupIndex + 1}">
              <div class="micro-popup__bar">
                <span>${popup.title}</span>
                <button type="button" class="micro-popup__x">x</button>
              </div>
              <div class="micro-popup__body">${renderLineStack(popup.lines)}</div>
              <div class="micro-popup__footer">
                <button type="button" class="false-control false-control--popup">${popup.action}</button>
              </div>
            </article>
          `,
        )
        .join('')}
    </div>
  `;
};

const bindImageFallbacks = (scope) => {
  scope
    ?.querySelectorAll('.image-frame__media img, .disturbing-image__media img, .manifest-image__media img, .stage-insert__media img')
    .forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        const fallback = pickMediaFrames(buildImageLibrary(), 1, [image.currentSrc || image.src])[0];
        if (!fallback || image.src === fallback.src) return;
        image.src = fallback.src;
        image.alt = fallback.caption;
        const caption =
          image.closest('.image-frame')?.querySelector('.image-frame__caption') ||
          image.closest('.disturbing-image')?.querySelector('figcaption') ||
          image.closest('.manifest-image')?.querySelector('figcaption') ||
          image.closest('.stage-insert__image')?.querySelector('figcaption');
        if (caption) caption.textContent = fallback.caption;
        rememberMedia([fallback], 40);
      },
      { once: true },
    );
  });
};

const buildAuxMarkup = (beat, index, mediaPack) => {
  switch (beat.mode) {
    case 'split':
      return `
        <div class="split-shell">
          <div class="split-window">
            <p class="window-label">links</p>
            <div class="window-lines">${renderLineStack(beat.left)}</div>
          </div>
          <div class="split-window">
            <p class="window-label">rechts</p>
            <div class="window-lines">${renderLineStack(beat.right)}</div>
          </div>
          ${buildInterferenceMarkup(index, beat, mediaPack)}
        </div>
      `;
    default:
      return buildInterferenceMarkup(index, beat, mediaPack);
  }
};

app.innerHTML = `
  <button type="button" class="center-gate" id="v2-center-gate">weiter</button>

  <div id="manifest-header-mount"></div>

  <article class="story-shell">
    <section class="story-stage" id="story-stage" tabindex="0" role="button" aria-label="Naechstes Fragment zeigen">
      <div class="story-meta">
        <span>context spiral / synthetic drift / unstable surface</span>
        <span id="story-progress">entry signal</span>
      </div>

      <div class="story-main" id="story-main"></div>

      <div class="story-controls">
        <button type="button" id="story-prev">previous</button>
        <button type="button" id="story-next">next</button>
      </div>
    </section>

    <section class="story-side" id="story-side"></section>

    <section class="story-trace">
      <p class="window-label">trace</p>
      <div class="trace-list" id="trace-list"></div>
    </section>

    <section class="story-entry${entryFromVersion1 ? ' is-entry' : ''}">
      <p class="window-label">entry contamination</p>
      <p class="entry-note">
        ${
          entryFromVersion1
            ? 'version 1 pushed you into the spiral. fragments open, mutate, and keep leaking downward.'
            : 'this is not an overview anymore. it is a contaminated surface that releases material in broken sequence.'
        }
      </p>
    </section>
  </article>

  <div id="disturbing-code-mount"></div>

  <div class="popup-layer" id="popup-layer"></div>
`;

let activeIndex = 0;
let isExpanded = false;
const beatSequence = shuffleList(beats.map((_, index) => index));
const storyStage = document.getElementById('story-stage');
const storyMain = document.getElementById('story-main');
const storySide = document.getElementById('story-side');
const traceList = document.getElementById('trace-list');
const progressEl = document.getElementById('story-progress');
const nextButton = document.getElementById('story-next');
const prevButton = document.getElementById('story-prev');
const centerGate = document.getElementById('v2-center-gate');
const popupLayer = document.getElementById('popup-layer');
const manifestHeaderMount = document.getElementById('manifest-header-mount');
const disturbingCodeMount = document.getElementById('disturbing-code-mount');

recentMediaHistory = loadRecentMediaHistory();

const renderFrameSurfaces = () => {
  const headerImages = buildSurfaceImagePack(4);
  const lowerImages = buildSurfaceImagePack(4, headerImages.map((image) => image.src));

  if (manifestHeaderMount) {
    manifestHeaderMount.innerHTML = buildManifestHeaderMarkup(headerImages);
    bindImageFallbacks(manifestHeaderMount);
  }

  if (disturbingCodeMount) {
    disturbingCodeMount.innerHTML = buildDisturbingCodeMarkup(lowerImages);
    bindImageFallbacks(disturbingCodeMount);
  }

  rememberMedia([...headerImages, ...lowerImages], 40);
};

const renderBeat = (index) => {
  activeIndex = Math.max(0, Math.min(index, beatSequence.length - 1));
  isExpanded = false;
  const beat = beats[beatSequence[activeIndex]];
  const mediaPack = buildMediaPackForBeat(beat, activeIndex, 12);
  const stageMedia = mediaPack.slice(0, 2);
  const auxMedia = mediaPack.slice(2, 4);

  document.body.dataset.mode = beat.mode;

  storyMain.innerHTML = `
    <div class="main-window main-window--${beat.mode}">
      <p class="window-label">${getSurfaceCaption(activeIndex)}</p>
      <div class="main-lines">${renderLineStack(beat.lines)}</div>
      ${buildStageInsertMarkup(activeIndex, stageMedia)}
    </div>
  `;

  storySide.innerHTML = buildAuxMarkup(beat, activeIndex, auxMedia);
  popupLayer.innerHTML = buildPopupMarkup(activeIndex);
  progressEl.textContent = getSurfaceCaption(activeIndex);
  nextButton.textContent = activeIndex === beatSequence.length - 1 ? 'enter v3' : 'next';
  centerGate.textContent = activeIndex === beatSequence.length - 1 ? 'enter v3' : 'weiter';

  traceList.innerHTML = beatSequence
    .slice(0, activeIndex + 1)
    .map(
      (_, traceIndex) => `
        <button type="button" class="trace-chip${traceIndex === activeIndex ? ' is-active' : ''}" data-trace-index="${traceIndex}">
          <span>${String(traceIndex + 1).padStart(2, '0')}</span>
        </button>
      `,
    )
    .join('');

  traceList.querySelectorAll('.trace-chip').forEach((button) => {
    button.addEventListener('click', () => renderBeat(Number(button.dataset.traceIndex)));
  });

  storySide.querySelectorAll('.false-control').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.classList.toggle('is-armed');
    });
  });

  popupLayer.querySelectorAll('.micro-popup__x').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.closest('.micro-popup')?.remove();
    });
  });

  popupLayer.querySelectorAll('.false-control--popup').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.classList.toggle('is-armed');
    });
  });

  bindGhostNodes(storySide);
  bindImageFallbacks(storySide);
  bindImageFallbacks(storyMain);
  rememberMedia([...stageMedia, ...auxMedia]);
};

const bindGhostNodes = (scope) => {
  scope?.querySelectorAll('.ghost-trigger').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const node = button.closest('.ghost-node');
      const isOpen = node?.classList.contains('is-open');
      node?.parentElement?.querySelectorAll(':scope > .ghost-node.is-open').forEach((entry) => {
        if (entry !== node) entry.classList.remove('is-open');
      });
      node?.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });
};

const expandBeat = () => {
  const beat = beats[beatSequence[activeIndex]];
  if ((!beat.expandLines && !beat.expandCards && !beat.expandRows) || isExpanded) return false;

  isExpanded = true;
  const mainWindow = storyMain.querySelector('.main-window');
  if (!mainWindow) return false;

  let expansionMarkup = '';
  if (beat.expandMode === 'spiral') {
    expansionMarkup = buildSpiralMarkup(beat.expandLines || []);
  } else if (beat.expandMode === 'split') {
    expansionMarkup = buildSplitLeakMarkup(beat.expandRows || []);
  } else {
    expansionMarkup = buildLeakStackMarkup(beat.expandCards || []);
  }

  mainWindow.classList.add('is-expanded');
  mainWindow.insertAdjacentHTML(
    'beforeend',
    `
      <div class="expand-block expand-block--${beat.expandMode || 'leaks'}">
        <p class="window-label">${beat.expandTitle || 'secondary state / leak'}</p>
        ${expansionMarkup}
      </div>
    `,
  );
  bindGhostNodes(mainWindow);
  nextButton.textContent = activeIndex === beatSequence.length - 1 ? 'enter v3' : 'continue';
  centerGate.textContent = activeIndex === beatSequence.length - 1 ? 'enter v3' : 'continue';
  return true;
};

const advanceStory = () => {
  if (expandBeat()) return;

  if (activeIndex >= beatSequence.length - 1) {
    window.location.href = '/version-3.html?entry=v2-final';
    return;
  }

  renderBeat(activeIndex + 1);
};

const isInteractiveTarget = (target) =>
  Boolean(target.closest('a, button, input, textarea, select, label, .ghost-panel'));

renderFrameSurfaces();
renderBeat(0);
fetchRssMediaFrames();
rssRefreshTimer = window.setInterval(() => {
  fetchRssMediaFrames();
}, 120000);
bindImageFallbacks(document);

storyStage?.addEventListener('click', (event) => {
  if (isInteractiveTarget(event.target)) return;
  advanceStory();
});
storyStage?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    advanceStory();
  }
});

nextButton?.addEventListener('click', () => advanceStory());
prevButton?.addEventListener('click', () => renderBeat(activeIndex - 1));
centerGate?.addEventListener('click', () => advanceStory());

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') advanceStory();
  if (event.key === 'ArrowLeft') renderBeat(activeIndex - 1);
});

document.addEventListener('pointerdown', (event) => {
  if (isInteractiveTarget(event.target)) return;

  const xRatio = event.clientX / window.innerWidth;
  const yRatio = event.clientY / window.innerHeight;
  const leftTunnel = xRatio < 0.08 && yRatio > 0.8;
  const rightTunnel = xRatio > 0.92 && yRatio < 0.2;

  if (leftTunnel) {
    window.location.href = '/index.html?return=v2';
    return;
  }

  if (rightTunnel) {
    window.location.href = '/version-3.html?entry=v2-edge';
  }
});
