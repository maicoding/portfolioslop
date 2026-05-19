const STORAGE_KEY = 'claudia-mai-language';
const LANGUAGES = new Set(['de', 'en']);

const pairs = [
  ['Auswahl', 'Selection'],
  ['Portfolio Navigation', 'Portfolio navigation'],
  ['Lehre', 'Teaching'],
  ['Tools', 'Tools'],
  ['Denkraum', 'Thinking Space'],
  ['Claudia Mai - Denkraum', 'Claudia Mai - Thinking Space'],
  ['Claudia Mai — Postdigitales Kunstprojekt', 'Claudia Mai — Postdigital Art Project'],
  ['Postdigitales Projekt', 'Postdigital Project'],
  ['Projekte, Lehre, Tools.', 'Projects, teaching, tools.'],
  ['Experimentelle Gegenfassung.', 'Experimental counter-version.'],
  ['Öffnen', 'Open'],
  ['Eintreten', 'Enter'],
  ['Kontakt', 'Contact'],
  ['back', 'zurueck'],
  ['Zurueck', 'Back'],
  ['Zurueck zum Portfolio', 'Back to portfolio'],
  ['Zurueck zum Index', 'Back to index'],
  ['zurueck zum index', 'back to index'],
  ['Projekt öffnen', 'Open project'],
  ['Projekt ansehen', 'View project'],
  ['Antwortmaschine ansehen', 'View answer machine'],
  ['Ausgewählte Arbeiten', 'Selected Works'],
  ['Weitere Bereiche', 'More Sections'],
  ['Postdigitales Projekt öffnen', 'Open Postdigital Project'],
  ['Gestaltung, Lehre und experimentelle Systeme.', 'Design, teaching and experimental systems.'],
  ['KI, Interfaces, Lehre und forschender Gestaltung', 'AI, interfaces, teaching and research-based design'],
  ['Lehrkonzept', 'Teaching Concept'],
  ['Lehrprojekte', 'Teaching Projects'],
  ['Bachelorarbeit', 'Bachelor thesis'],
  ['Antwortmaschine', 'Answer machine'],
  ['Raum / Erzählung', 'Space / narrative'],
  ['Raum', 'Space'],
  ['Systeme', 'Systems'],
  ['Recherche', 'Research'],
  ['Archive entry', 'Archive entry'],
  ['Archive error', 'Archive error'],
  ['Projekt nicht gefunden.', 'Project not found.'],
  ['Fuer diese Adresse liegt im klassischen Portfolio aktuell kein Datensatz vor.', 'There is currently no classic portfolio record for this address.'],
  ['Projekt ID', 'Project ID'],
  ['Archiv', 'Archive'],
  ['Klassisches Portfolio', 'Classic portfolio'],
  ['Fokus', 'Focus'],
  ['Quelle', 'Source'],
  ['Intern', 'Internal'],
  ['Konzept', 'Concept'],
  ['Index', 'Index'],
  ['Auf Sugarscroll ansehen', 'View on Sugarscroll'],
  ['Das Projekt wird als lesbare Fallstudie gezeigt statt als zerlegte Effektflaeche.', 'The project is presented as a readable case study rather than a fragmented effect surface.'],
  ['Der linke Bereich bleibt bewusst textstark. Gleichzeitig steuert der nummerierte Konzeptindex rechts die Bildfokusse, damit Text und Preview miteinander sprechen statt nebeneinander zu liegen.', 'The left side deliberately remains text-heavy. At the same time, the numbered concept index on the right controls the image focus, so text and preview speak to each other instead of simply sitting side by side.'],
  ['Weiterfuehrungen', 'Further developments'],
  ['Das Projekt verzweigt hier in weitere Versionen und spaetere Antworten.', 'Here the project branches into further versions and later responses.'],
  ['Jahr', 'Year'],
  ['Typ', 'Type'],
  ['Feld', 'Field'],
  ['Buch', 'Book'],
  ['Anleitung', 'Manual'],
  ['Parameter', 'Parameters'],
  ['Konzept lesen', 'Read concept'],
  ['Galerie ansehen', 'View gallery'],
  ['Galerie', 'Gallery'],
  ['Oeffnen', 'Open'],
  ['Öffnen', 'Open'],
  ['Schließen', 'Close'],
  ['Einleitung und Haltung', 'Introduction and Position'],
  ['Future Skills', 'Future Skills'],
  ['Lernprozess und Haltung der Studierenden', 'Learning Process and Student Mindset'],
  ['Prompting als Lehrinhalt', 'Prompting as Teaching Content'],
  ['Eigene Methoden', 'Own Methods'],
  ['Kursformate und Projekte', 'Course Formats and Projects'],
  ['KI als Gegenstand und Werkzeug', 'AI as Subject and Tool'],
  ['Schluss und Offenheit', 'Conclusion and Openness'],
  ['Ask KI', 'Ask AI'],
  ['Eigene Frage:', 'Your own question:'],
  ['Antwort lesen', 'Read answer'],
  ['Was ist der Kern?', 'What is the core?'],
  ['Warum KI?', 'Why AI?'],
  ['Welche Future Skills?', 'Which future skills?'],
  ['Wie arbeiten Studierende?', 'How do students work?'],
  ['Was ist der Kern deines Lehrkonzepts?', 'What is the core of your teaching concept?'],
  ['Warum spielt KI in deinem Lehrkonzept so eine große Rolle?', 'Why does AI play such a major role in your teaching concept?'],
  ['Welche Future Skills vermittelst du in der Lehre?', 'Which future skills do you teach?'],
  ['Wie arbeiten Studierende in deinen Kursen praktisch mit neuen Technologien?', 'How do students work practically with new technologies in your courses?'],
  ['KI gestützte Beantwortung zum Lehrkonzept. Trotz Erweiterung des verwendeten Sprachmodells (RAG) um das Konzept können die Antworten inhaltlich abweichen.', 'AI-supported answers about the teaching concept. Although the language model is extended with the concept through RAG, answers may still differ in content.'],
  ['Frage:', 'Question:'],
  ['Offenes Recherchefeld', 'Open Research Field'],
  ['Frage stellen', 'Ask a Question'],
  ['Frage an den Denkraum', 'Question for the Thinking Space'],
  ['Aktuelle Spuren', 'Current Traces'],
  ['Artefaktarchiv', 'Artifact Archive'],
  ['Dokumentierte Spuren', 'Documented Traces'],
  ['Fokus', 'Focus'],
  ['Trendfokus', 'Trend Focus'],
  ['Neuere Artefakte', 'Recent Artifacts'],
  ['Archivspuren', 'Archive Traces'],
  ['Operative Antworten', 'Operational Responses'],
  ['Noch keine direkten Artefakte.', 'No direct artifacts yet.'],
  ['Keine frischen Spuren im Archiv.', 'No fresh traces in the archive.'],
  ['Noch keine Archive-Signale sichtbar.', 'No archive signals visible yet.'],
  ['Noch keine Artefakte. Die erste Frage setzt die erste Spur.', 'No artifacts yet. The first question creates the first trace.'],
  ['Archive wird geladen.', 'Archive is loading.'],
  ['Eine Frage erzeugt ein neues Artefakt.', 'A question creates a new artifact.'],
  ['Archiv nicht erreichbar. Der Denkraum arbeitet mit seinen statischen Spuren weiter.', 'Archive unavailable. The Thinking Space continues working with its static traces.'],
  ['Die Frage wird gerade in ein Artefakt uebersetzt.', 'The question is currently being translated into an artifact.'],
  ['Neue Spur erzeugt und im Denkraum abgelegt.', 'New trace created and stored in the Thinking Space.'],
  ['building artifact...', 'building artifact...'],
  ['create artifact', 'create artifact'],
  ['drag zone', 'drag zone'],
  ['artifact', 'artifact'],
  ['Artefakte gespeichert', 'artifacts saved'],
  ['Ich gleiche die Frage gerade mit dem Lehrkonzept ab...', 'I am currently comparing the question with the teaching concept...'],
  ['Dazu finde ich in der hinterlegten Wissensbasis des Lehrkonzepts noch keine belastbare Grundlage. Wenn du magst, erweitern wir die Chunks genau für dieses Thema.', 'I cannot yet find a reliable basis for this in the stored knowledge base of the teaching concept. We can extend the chunks precisely for this topic.'],
  ['Raster (Spalten x Zeilen)', 'Grid (columns x rows)'],
  ['Zellengroesse', 'Cell size'],
  ['Darstellungs-Modus', 'Display mode'],
  ['2D Rechteck', '2D rectangle'],
  ['2D Kreis', '2D circle'],
  ['3D Isometrisch (Block)', '3D isometric (block)'],
  ['Organisch (Blob)', 'Organic (blob)'],
  ['Raster anzeigen', 'Show grid'],
  ['Alles loeschen', 'Clear all'],
  ['Zurueck zum Portfolio', 'Back to portfolio'],
  ['Steuerung:', 'Controls:'],
  ['Bild laden', 'Load image'],
  ['Bild entfernen', 'Remove image'],
  ['Preview abspielen', 'Play preview'],
  ['PNG aktuell', 'Current PNG'],
  ['Alle PNGs', 'All PNGs'],
  ['Projekt speichern', 'Save project'],
  ['Projekt laden', 'Load project'],
  ['Gesamtdauer', 'Total duration'],
  ['Empfehlung', 'Recommendation'],
  ['Caption, Hook und Hashtags', 'Caption, Hook and Hashtags'],
  ['Text kopieren', 'Copy text'],
  ['Kampagne', 'Campaign'],
  ['Caption-Basis', 'Caption base'],
  ['Generierter Post-Text', 'Generated post text'],
  ['Modus', 'Mode'],
  ['Bild + Overlay', 'Image + overlay'],
  ['Gradient-Winkel', 'Gradient angle'],
  ['Body-Farbe', 'Body color'],
  ['Gradient Ende', 'Gradient end'],
  ['Export SVG (Vektor)', 'Export SVG (vector)'],
  ['Maus ziehen: Zeichnen', 'Drag mouse: draw'],
  ["Taste 'X' + Ziehen: Radieren", "Key 'X' + drag: erase"],
  ["Taste 'C': Alles loeschen", "Key 'C': clear all"],
  ['Exportiert ohne Hintergrund fuer die Verwendung als Maske/Container.', 'Exports without a background for use as a mask/container.'],
  ['Parameter', 'Parameters'],
  ['Zurueck zur Tool Gallery', 'Back to Tool Gallery'],
  ['Geometric Base', 'Geometric Base'],
  ['Current Output', 'Current Output'],
  ['Output live:', 'Output live:'],
  ['Preview active', 'Preview active'],
  ['Open Code', 'Open Code'],
  ['Copy Code', 'Copy Code'],
  ['Copy All', 'Copy All'],
  ['Export basiert auf der zuletzt generierten Konfiguration.', 'Export is based on the last generated configuration.'],
  ['Algorithmus', 'Algorithm'],
  ['Filigran & Edel', 'Delicate & Refined'],
  ['Experimentell', 'Experimental'],
  ['Massiv', 'Massive'],
  ['Ballpoint (Ultra-Fein)', 'Ballpoint (ultra fine)'],
  ['Ink Bleed (Verlaufen)', 'Ink Bleed (bleeding)'],
  ['Scribble (Kritzel)', 'Scribble'],
  ['Organic (Kurven)', 'Organic (curves)'],
  ['Proxy-Fehler', 'Proxy error'],
  ['Stille.', 'Silence.'],
  ['Die Frage konnte gerade nicht erzeugt werden.', 'The question could not be generated right now.'],
  ['Antwort konnte nicht geladen werden.', 'Answer could not be loaded.'],
  ['Die Antwort konnte gerade nicht geladen werden.', 'The answer could not be loaded right now.'],
  ['zu 2.0', 'to 2.0'],
  ['zum index', 'to index'],
  ['weiterfragen', 'ask further'],
  ['Zur 2.0', 'To 2.0'],
  ['ELIZA denkt ...', 'ELIZA is thinking ...'],
  ['Weiterleitung zu', 'Redirecting to'],
  ['weiter', 'continue'],
  ['Naechstes Fragment zeigen', 'Show next fragment'],
  ['links', 'left'],
  ['rechts', 'right'],
  ['weitere arbeiten', 'further works'],
  ['Im Feld scrollen oder ziehen', 'Scroll or drag in the field'],
  ['Projektliste', 'Project list'],
  ['Kontext', 'Context'],
  ['Kontext und Konzept öffnen', 'Open context and concept'],
  ['Projekt-Navigation', 'Project navigation'],
  ['Seitennavigation', 'Page navigation'],
  ['Designforschung / Regelbasierte Kreativität', 'Design research / rule-based creativity'],
  ['Bachelorarbeit', 'Bachelor thesis'],
  ['Designforschung / Experimental Design', 'Design research / experimental design'],
  ['300 Seiten', '300 pages'],
  ['1.120 Seiten', '1,120 pages'],
  ['434 pro Begriff', '434 per term'],
];

const paragraphPairs = [
  [
    'Meine Lehre entsteht an der Schnittstelle von gestalterischer Praxis, KI-basierter Produktion und kritischer Reflexion. Sie ist nicht auf einzelne Tools ausgerichtet, sondern auf die Fähigkeit, mit dynamischen Systemen umzugehen, Entscheidungen zu treffen, Ergebnisse einzuordnen und die eigene Praxis kontinuierlich weiterzuentwickeln.',
    'My teaching is located at the intersection of design practice, AI-based production and critical reflection. It is not focused on individual tools, but on the ability to work with dynamic systems, make decisions, assess outcomes and continuously develop one’s own practice.',
  ],
  [
    'Ein zentrales Anliegen ist die Vermittlung von Future Skills im Kontext KI-basierter Gestaltung. Diese Kompetenzen sind nicht statisch, sondern an sich verändernde Produktionsbedingungen gebunden. Sie entstehen durch wiederholte, reflektierte Auseinandersetzung mit neuen Technologien, nicht durch einmalige Tool-Einführungen, sondern durch kontinuierliche Praxis.',
    'A central concern is teaching future skills in the context of AI-based design. These competences are not static; they are tied to changing conditions of production. They emerge through repeated, reflective engagement with new technologies, not through one-off tool introductions, but through continuous practice.',
  ],
  [
    'Studierende lernen, sich immer wieder auf neue Technologien einzulassen, diese einzuordnen und in eigene Arbeitsweisen zu überführen. KI wird als Teil eines reflektierten Prozesses eingesetzt, in dem Ergebnisse nicht nur produziert, sondern analysiert, bewertet und kritisch eingeschätzt werden. Das Ziel ist keine Beherrschung einzelner Tools, sondern Handlungsfähigkeit in offenen, sich verändernden Systemen.',
    'Students learn to repeatedly engage with new technologies, contextualize them and translate them into their own working methods. AI is used as part of a reflective process in which outcomes are not only produced, but analyzed, evaluated and critically assessed. The goal is not mastery of individual tools, but agency within open, changing systems.',
  ],
  [
    'Technik wird dabei nur so weit eingeführt, wie sie im jeweiligen Kontext erforderlich ist. Das Spektrum technischer Kompetenzen erweitert sich schrittweise, ohne zu überfordern, aber mit dem Anspruch, es kontinuierlich zu verschieben. Technisches Grundwissen ist dabei keine Voraussetzung, sondern entsteht gemeinsam im Prozess.',
    'Technology is introduced only as far as the respective context requires. The range of technical skills expands step by step, without overwhelming students, but with the ambition to keep moving the boundary. Technical knowledge is not a prerequisite; it develops together in the process.',
  ],
  [
    'Ich habe mehrere Prompting-Kurse entwickelt und unterrichtet. Im Zentrum steht, wie sprachbasierte Interfaces als gestalterisches Werkzeug eingesetzt werden können: die Entwicklung von Prompt-Systemen, iterative Feedback-Prozesse zwischen Mensch und Modell, die Übersetzung gestalterischer Konzepte in Sprache sowie die gezielte Steuerung und Bewertung von Outputs.',
    'I have developed and taught several prompting courses. The focus is on how language-based interfaces can be used as design tools: developing prompt systems, iterative feedback processes between human and model, translating design concepts into language, and deliberately steering and evaluating outputs.',
  ],
  [
    'Lehre verstehe ich als kritische Praxis, die sich selbst immer wieder aktualisieren muss. Gerade im Kontext von KI ist diese Aktualität zentral, weil sich Werkzeuge, Interfaces und Möglichkeiten grundlegend und schnell verändern. Mein Anspruch ist es, diesen Wandel nicht nur zu vermitteln, sondern ihn gemeinsam mit Studierenden zu durchdenken und zu gestalten.',
    'I understand teaching as a critical practice that must continually update itself. This is especially central in the context of AI, because tools, interfaces and possibilities are changing fundamentally and quickly. My aim is not only to communicate this transformation, but to think it through and shape it together with students.',
  ],
  [
    'In der Lehre setze ich eigene Methoden ein, darunter Reverse Prompting, Critical Audit Mode und Critical Foresight Mode. Diese Ansätze strukturieren die Auseinandersetzung mit KI-Outputs. Sie machen sichtbar, wie Modelle funktionieren, wo ihre Grenzen liegen und wie gestalterische Qualität im Dialog mit Systemen entwickelt werden kann. Der breite Einsatz unterschiedlicher Tools ermöglicht es dabei, individuelle Lösungen für Studierende anzubieten, je nach Ausgangslage, Interesse und Projektkontext.',
    'In my teaching I use my own methods, including Reverse Prompting, Critical Audit Mode and Critical Foresight Mode. These approaches structure the engagement with AI outputs. They make visible how models work, where their limits lie and how design quality can be developed in dialogue with systems. The broad use of different tools also makes it possible to offer individual solutions for students depending on their starting point, interests and project context.',
  ],
  [
    'Zu meinen Lehrformaten gehören Kurse wie Beyond HTML und HTTPoetics, in denen Gestaltung, Code und kritische Praxis zusammengeführt werden. Kollaborative Projekte wie Truth Machine, ein Net-Art-Projekt mit Studierendengruppen aus Dortmund und Nairobi, erweitern den Lehrraum über institutionelle Grenzen hinaus. Zusammenarbeit findet dabei auf verschiedenen Ebenen statt: zwischen Studierenden, zwischen Lehrenden und mit Akteurinnen und Akteuren aus der Praxis, die unterschiedliche disziplinäre Perspektiven einbringen. Wie diese Formate in die eigene gestalterische Praxis rückwirken, ist unter /about beschrieben.',
    'My teaching formats include courses such as Beyond HTML and HTTPoetics, where design, code and critical practice are brought together. Collaborative projects such as Truth Machine, a net-art project with student groups from Dortmund and Nairobi, expand the teaching space beyond institutional boundaries. Collaboration happens on several levels: between students, between teachers and with practitioners who bring in different disciplinary perspectives. How these formats feed back into my own design practice is described under /about.',
  ],
  [
    'KI ist in meiner Lehre nicht nur Werkzeug, sondern auch Gegenstand. Studierende untersuchen, wie KI-basierte Systeme Produktionslogiken verändern, welche ästhetischen und inhaltlichen Konsequenzen das hat und wie sich gestalterische Kontrolle verschiebt, wenn Modelle und Interfaces in den Prozess eingebunden werden.',
    'In my teaching, AI is not only a tool, but also a subject of investigation. Students examine how AI-based systems change production logics, what aesthetic and conceptual consequences this has, and how design control shifts when models and interfaces become part of the process.',
  ],
  [
    'Dieses Layer erzählt das Lehrkonzept nicht einfach nach, sondern verortet es zwischen gestalterischer Praxis, KI-basierter Produktion und kritischer Reflexion.',
    'This layer does not simply retell the teaching concept; it situates it between design practice, AI-based production and critical reflection.',
  ],
  [
    'Im Zentrum steht nicht die Beherrschung einzelner Tools, sondern die Fähigkeit, mit dynamischen Systemen zu arbeiten. Studierende lernen, Entscheidungen zu treffen, Ergebnisse einzuordnen und ihre eigene Praxis unter veränderten Bedingungen weiterzuentwickeln.',
    'The focus is not on mastering individual tools, but on the ability to work with dynamic systems. Students learn to make decisions, assess outcomes and develop their own practice under changing conditions.',
  ],
  [
    'Future Skills werden hier als bewegliche Kompetenzen verstanden. Sie entstehen nicht durch einzelne Tool-Einführungen, sondern durch wiederholte, reflektierte Praxis mit Technologien, die sich laufend verändern.',
    'Future skills are understood here as flexible competences. They do not emerge through isolated tool introductions, but through repeated, reflective practice with technologies that are constantly changing.',
  ],
  [
    'Prompting wird als gestalterisches Werkzeug vermittelt: über Prompt-Systeme, iterative Feedback-Schleifen und die Übersetzung von Konzepten in Sprache. Eigene Methoden wie Reverse Prompting, Critical Audit Mode und Critical Foresight Mode geben der Arbeit mit KI-Outputs eine klare Struktur.',
    'Prompting is taught as a design tool: through prompt systems, iterative feedback loops and the translation of concepts into language. Methods such as Reverse Prompting, Critical Audit Mode and Critical Foresight Mode give the work with AI outputs a clear structure.',
  ],
  [
    'Technik wird nur so weit eingeführt, wie sie im jeweiligen Kontext nötig ist. Technisches Grundwissen ist keine Voraussetzung, sondern entsteht im gemeinsamen Arbeiten. Ziel ist Handlungsfähigkeit in offenen, sich verändernden Systemen.',
    'Technology is introduced only as far as each context requires. Technical knowledge is not a prerequisite; it develops through working together. The goal is agency in open, changing systems.',
  ],
  [
    'Kurse wie Beyond HTML und HTTPoetics sowie kollaborative Projekte wie Truth Machine verbinden Gestaltung, Code und kritische Praxis. KI ist dabei zugleich Werkzeug und Gegenstand der Untersuchung: Studierende analysieren, wie Systeme Produktionslogiken, Ästhetiken und gestalterische Kontrolle verändern.',
    'Courses such as Beyond HTML and HTTPoetics, as well as collaborative projects such as Truth Machine, connect design, code and critical practice. AI is both a tool and an object of inquiry: students analyze how systems change production logics, aesthetics and design control.',
  ],
  ['Kontext zum Lehrkonzept', 'Context for the Teaching Concept'],
  ['Kontext zum Denkraum', 'Context for the Thinking Space'],
  ['Kontext zu Gravity Is Optional', 'Context for Gravity Is Optional'],
  ['Kontext zur Tool Gallery', 'Context for the Tool Gallery'],
  ['Prompting und Methoden', 'Prompting and Methods'],
  ['Lernprozess', 'Learning Process'],
  ['Formate und Gegenstand', 'Formats and Subject Matter'],
  ['Eingesetzte Technologie', 'Technology Used'],
  ['Trends und Marktbezug', 'Trends and Market Context'],
  ['Theoretischer Hintergrund', 'Theoretical Background'],
  ['Bedeutung für Designstudierende', 'Relevance for Design Students'],
  [
    'Der Denkraum ist kein Blog, sondern eine offene Oberfläche für Signale, Fragmente, Archivspuren und KI-generierte Verdichtungen.',
    'The Thinking Space is not a blog, but an open surface for signals, fragments, archival traces and AI-generated condensations.',
  ],
  [
    'Die Seite übersetzt Recherche, Beobachtung und Verdichtung in ein offenes Interface. Signale, Archivspuren und künstlich erzeugte Artefakte erscheinen nicht linear, sondern als Feld, in dem Recherche, Spekulation und gestalterische Verdichtung gleichzeitig stattfinden.',
    'The page translates research, observation and condensation into an open interface. Signals, archival traces and artificially generated artifacts do not appear linearly, but as a field in which research, speculation and design condensation happen at the same time.',
  ],
  [
    'Zum Einsatz kommen eine modulare Interface-Struktur, archivische Feeds, zustandsbasierte Oberflächenlogik und generative Artefakt-Erzeugung. Technisch verknüpft die Seite UI-State, Datenquellen, lokale Persistenz und textbasierte KI-Ausgaben zu einem hybriden Recherchewerkzeug.',
    'It uses a modular interface structure, archival feeds, state-based surface logic and generative artifact creation. Technically, the page connects UI state, data sources, local persistence and text-based AI outputs into a hybrid research tool.',
  ],
  [
    'Der Denkraum greift aktuelle Marktbewegungen auf: Trendradare in Agenturen, Social Listening, Forecasting, generative Research-Interfaces und die wachsende Bedeutung kuratierter Signale gegen algorithmisches Grundrauschen. Er reagiert damit auf ein Umfeld, in dem Kreative immer stärker auch Analystinnen, Selektierende und Synthesebauerinnen sind.',
    'The Thinking Space picks up current movements in the market: trend radar systems in agencies, social listening, forecasting, generative research interfaces and the growing importance of curated signals against algorithmic background noise. It responds to an environment in which creatives increasingly also act as analysts, selectors and builders of synthesis.',
  ],
  [
    'Theoretisch liegt das Projekt zwischen Medienarchäologie, Designtheorie und künstlerischer Forschung. Es bezieht sich auf redaktionelle Praktiken, auf den Wandel von Feeds zu Wissensoberflächen und auf die Frage, wie Trends kulturell gerahmt werden. Auch hier lässt sich die Dynamik zwischen Hype, produktiver Anwendung und Erschöpfung im Sinne des Gartner Hype Cycle mitlesen.',
    'Theoretically, the project sits between media archaeology, design theory and artistic research. It refers to editorial practices, the transformation of feeds into knowledge surfaces and the question of how trends are culturally framed. The dynamic between hype, productive application and exhaustion can also be read through the Gartner Hype Cycle.',
  ],
  [
    'Für Designstudierende wird sichtbar, dass Recherche heute mehr ist als Sammeln. Sie müssen Muster erkennen, Trends einordnen, Quellen kritisch lesen und daraus eigenständige gestalterische Positionen entwickeln. Der Denkraum zeigt Recherche damit als Entwurfsdisziplin.',
    'For design students, it becomes visible that research today is more than collecting. They need to recognize patterns, contextualize trends, read sources critically and develop independent design positions from them. The Thinking Space presents research as a design discipline.',
  ],
  [
    'Die Unterseite liest das Projekt nicht nur als Bildserie, sondern als Untersuchung dazu, wie generative Systeme dokumentarische Bildsprachen nachbauen, verschieben und verunsichern.',
    'This subpage reads the project not only as an image series, but as an investigation of how generative systems reconstruct, shift and unsettle documentary visual languages.',
  ],
  [
    'Gravity Is Optional nimmt eine unspektakuläre, sozial aufgeladene Bildkultur als Ausgangspunkt und führt minimale surreale Abweichungen ein. Das Projekt arbeitet mit der Reibung zwischen dokumentarischem Realismus und offensichtlicher Konstruktion.',
    'Gravity Is Optional takes an unspectacular, socially charged image culture as its starting point and introduces minimal surreal deviations. The project works with the friction between documentary realism and visible construction.',
  ],
  [
    'Im Zentrum stehen Bildgeneratoren, promptbasierte Referenzanalyse und serielle Bildentwicklung. Die Technologie dient hier nicht dem maximalen KI-Spektakel, sondern der kontrollierten Rekonstruktion von Licht, Framing, Materialität und dokumentarischer Anmutung.',
    'At the center are image generators, prompt-based reference analysis and serial image development. The technology is not used for maximum AI spectacle, but for the controlled reconstruction of light, framing, materiality and documentary atmosphere.',
  ],
  [
    'Das Projekt bezieht sich auf aktuelle Entwicklungen wie synthetische Fotografie, AI Imaging in Editorial und Campaigning, den Shift von Produktion zu Art Direction und die Frage, wie Bildwelten für Plattformen, Kampagnen oder Marken zunehmend promptbasiert orchestriert werden. Gleichzeitig reagiert es auf eine Gegenbewegung zur glatten KI-Ästhetik: rauere, glaubwürdigere und kulturell verankerte Bildsprachen.',
    'The project relates to current developments such as synthetic photography, AI imaging in editorial and campaign contexts, the shift from production to art direction and the question of how visual worlds for platforms, campaigns or brands are increasingly orchestrated through prompts. At the same time, it responds to a counter-movement against polished AI aesthetics: rougher, more credible and culturally grounded visual languages.',
  ],
  [
    'Wichtig sind hier Dokumentarfotografie, Designtheorie zu Realismus und Inszenierung sowie künstlerische Strategien der Aneignung und des kontrollierten Bruchs. Das Projekt lässt sich auch als Einordnung eines Medienmoments lesen, in dem generative Bilder vom Hype in eine kritischere, bewusstere Anwendung übergehen.',
    'Important references here are documentary photography, design theory around realism and staging, and artistic strategies of appropriation and controlled rupture. The project can also be read as a positioning of a media moment in which generative images move from hype into more critical, deliberate use.',
  ],
  [
    'Für Studierende wird hier wichtig, dass KI-Bilder nicht nur effizient erzeugt, sondern auch bildethisch, ästhetisch und kontextuell gelesen werden müssen. Entscheidend ist, ob sie visuelle Referenzen verstehen, Bildkulturen differenziert einsetzen und künstlerische Entscheidungen gegen die Standards der Tools behaupten können.',
    'For students, this makes clear that AI images must not only be generated efficiently, but also read ethically, aesthetically and contextually. What matters is whether they understand visual references, use image cultures with nuance and can assert artistic decisions against the defaults of the tools.',
  ],
  [
    'Die Tool Gallery ist keine neutrale Übersichtsseite, sondern ein Interface, das die gebauten Werkzeuge als Teil einer gestalterischen und didaktischen Haltung lesbar macht.',
    'The Tool Gallery is not a neutral overview page, but an interface that makes the built tools readable as part of a design and teaching position.',
  ],
  [
    'Die Seite versammelt Generatoren, Antwortmaschinen und formbildende Systeme nicht als loses Portfolio, sondern als Familie von Interfaces. Sichtbar wird damit ein Arbeitsmodus, in dem Gestaltung nicht nur Ergebnisse produziert, sondern auch Bedingungen, Regeln und kleine Maschinen entwirft.',
    'The page gathers generators, answer machines and form-building systems not as a loose portfolio, but as a family of interfaces. It reveals a working mode in which design produces not only outcomes, but also conditions, rules and small machines.',
  ],
  [
    'Verwendet werden browserbasierte Tools, generative Layoutlogiken, Prompt-Steuerung, visuelle Systeme, experimentelles Frontend und API-nahe Denkweisen. Dazu gehört auch ein eigenes Tool für Instagram-Posts, das den Aufwand von etwa einer Stunde in After Effects auf rund fünf Minuten reduziert; eingefügt werden nur noch Text und Bild. Die Tool Gallery selbst ist dynamisch angelegt: Sie kann umartikuliert werden, ohne dass die eigentlichen Werkzeuge verschwinden.',
    'The work uses browser-based tools, generative layout logics, prompt control, visual systems, experimental frontend practice and API-adjacent thinking. This includes a custom tool for Instagram posts that reduces roughly one hour of After Effects work to about five minutes; only text and image still need to be inserted. The Tool Gallery itself is dynamic: it can be rearticulated without the actual tools disappearing.',
  ],
  [
    'Die Seite reagiert auf eine Praxis, in der Designerinnen und Designer zunehmend eigene Micro-Tools, Prototypen und halbautomatische Produktionsketten entwickeln. Im Markt zeigt sich hier der Shift weg von reiner Softwarebedienung hin zu Workflow-Design, Tool-Orchestrierung, Art Direction und Interface-Kompetenz.',
    'The page responds to a practice in which designers increasingly develop their own micro-tools, prototypes and semi-automated production chains. In the market, this shows a shift away from merely operating software toward workflow design, tool orchestration, art direction and interface competence.',
  ],
  [
    'Im Hintergrund stehen Fragen nach dem Tool als Medium, nach Interface-Autorschaft, nach generativen Systemen als Material und nach der Sichtbarkeit von Produktionsbedingungen. Die Gallery liest Werkzeuge daher nicht nur funktional, sondern auch als kulturelle und ästhetische Aussagen.',
    'In the background are questions about the tool as medium, interface authorship, generative systems as material and the visibility of production conditions. The gallery therefore reads tools not only functionally, but also as cultural and aesthetic statements.',
  ],
  [
    'Für Studierende wird hier sichtbar, dass sie nicht auf bestehende Software festgelegt sind. Sie können eigene Hilfsmittel, visuelle Systeme und experimentelle Produktionsweisen entwickeln und so ein aktiveres, selbstbestimmteres Verhältnis zu Technologie aufbauen.',
    'For students, it becomes visible that they are not limited to existing software. They can develop their own aids, visual systems and experimental modes of production, building a more active and self-determined relationship to technology.',
  ],
  [
    'Demo eines eigenen Chatbots auf der Seite. Antworten greifen die Inhalte und Argumente des Textes auf, werden aber generiert, dadurch können Unterschiede zum Originaltext entstehen.',
    'Demo of a custom chatbot on this page. Answers draw on the content and arguments of the text, but they are generated, so they may differ from the original.',
  ],
  [
    'Fragen wie diese helfen, das Konzept nicht nur zu lesen, sondern zu prüfen. Stelle oben eine Frage oder klicke auf einen Einstieg.',
    'Questions like these help you not only read the concept, but examine it. Ask a question above or click one of the prompts.',
  ],
  [
    'Ein lebendes Feld aus Fragen, Signalen und verdichteten Spuren. Neue Antworten erscheinen nicht als Chat, sondern als dokumentierte Artefakte.',
    'A living field of questions, signals and condensed traces. New answers do not appear as chat, but as documented artifacts.',
  ],
  [
    'Waehle ein Trendfeld oder stelle eine Frage. Neue Artefakte landen hier als verdichtete Spur.',
    'Choose a trend field or ask a question. New artifacts land here as condensed traces.',
  ],
  [
    'Kommunikation wird kuerzer, direkter und vergleichbarer.',
    'Communication becomes shorter, more direct and more comparable.',
  ],
  [
    'Interfaces, Ads und Produkttexte bewegen sich weg von Kampagne und hin zu Entscheidungshilfe. Was nicht sofort lesbar und anschlussfaehig ist, verliert an Sichtbarkeit.',
    'Interfaces, ads and product copy are moving away from campaign logic and toward decision support. What is not immediately readable and connectable loses visibility.',
  ],
  [
    'Alles wirkt vertraut, glatt, austauschbar und dadurch schwer erinnerbar.',
    'Everything feels familiar, smooth, interchangeable and therefore hard to remember.',
  ],
  [
    'Sobald Interfaces dieselben Muster, Benefits und Tonlagen wiederholen, erscheint Standard wie Vernunft. Differenz wird dann riskant und visuelle Eigenheit schnell wegoptimiert.',
    'As soon as interfaces repeat the same patterns, benefits and tones, standardization starts to look like reason. Difference then becomes risky and visual distinctiveness is quickly optimized away.',
  ],
  [
    'Werkzeuge sind nicht nur Mittel, sondern inszenieren Haltungen und Arbeitsweisen.',
    'Tools are not only means; they stage attitudes and ways of working.',
  ],
  [
    'Tools tragen ihre eigene Aesthetik und Ideologie mit. Wer mit ihnen arbeitet, produziert nicht nur Ergebnisse, sondern auch sichtbare Spuren des verwendeten Systems.',
    'Tools carry their own aesthetics and ideology. Whoever works with them produces not only results, but also visible traces of the system used.',
  ],
  [
    'Feeds, Notizen und Links kippen langsam in ein persoenliches Evidenzsystem.',
    'Feeds, notes and links slowly tip into a personal evidence system.',
  ],
  [
    'Archive sind keine festen Speicher mehr, sondern bewegliche Schichten aus aktuellen Signalen, Resten und Wiederholungen. Bedeutung entsteht durch Verdichtung, nicht durch Ordnung allein.',
    'Archives are no longer fixed storage systems, but moving layers of current signals, remnants and repetitions. Meaning emerges through condensation, not through order alone.',
  ],
  [
    'Fragen an Maschinen werden zu privaten, halb oeffentlichen Denkspuren.',
    'Questions to machines become private, semi-public traces of thought.',
  ],
  [
    'Wer Systeme befragt, dokumentiert nicht nur ein Problem, sondern auch eine Haltung. Die Frage selbst wird zum Artefakt und bleibt als Spur im Interface haengen.',
    'Whoever questions systems documents not only a problem, but also a position. The question itself becomes an artifact and remains as a trace in the interface.',
  ],
  [
    'Headline: 5 Woerter. Body: 2 Saetze. Kein Raum fuer Mythos.',
    'Headline: 5 words. Body: 2 sentences. No room for myth.',
  ],
  [
    'Gute Interfaces wollen nicht mehr ueberzeugen. Sie wollen passen.',
    'Good interfaces no longer want to persuade. They want to fit.',
  ],
  [
    'Was funktioniert, wird kopiert, bis die Norm wie Vernunft aussieht.',
    'What works gets copied until the norm looks like reason.',
  ],
  [
    'Das Werkzeug hinterlaesst seine Haltung im Resultat.',
    'The tool leaves its attitude in the result.',
  ],
  [
    'Archive sind keine Schubladen mehr, sondern driftende Beweisfelder.',
    'Archives are no longer drawers, but drifting fields of evidence.',
  ],
  [
    'Eine Frage an die Maschine ist schon eine Form von Selbstprotokoll.',
    'A question to the machine is already a form of self-protocol.',
  ],
  [
    'Differenz wird heute oft erst spaeter sichtbar, nicht in der ersten Oberflaeche.',
    'Difference often becomes visible only later now, not on the first surface.',
  ],
  [
    'Ein Partikelsystem, in dem Form aus Verhalten entsteht statt aus Vorlage.',
    'A particle system in which form emerges from behavior rather than from a template.',
  ],
  [
    'Eine operative Ueberzeichnung jener Sprach- und Interface-Muster, die gerade ueberall auftauchen.',
    'An operational exaggeration of the language and interface patterns currently appearing everywhere.',
  ],
  [
    'Ein Tool fuer Druck, Abrieb und mediale Erschoepfung als sichtbare Aesthetik.',
    'A tool for pressure, abrasion and media exhaustion as visible aesthetics.',
  ],
  [
    'Ein Gegenentwurf zu starren Templates: Form entsteht jedes Mal neu aus Kontext und Raster.',
    'A countermodel to rigid templates: form is generated anew each time from context and grid.',
  ],
  [
    'Eine Frage-Maschine, die Suchspuren, Bilder und Textreste zu unsteten Antworten verschaltet.',
    'A question machine that connects search traces, images and text remnants into unstable answers.',
  ],
  [
    'Ein variables Zeichensystem zwischen Identitaet, Wiederholung und Drift.',
    'A variable sign system between identity, repetition and drift.',
  ],
  ['Warum klingen gerade so viele Interfaces gleich?', 'Why do so many interfaces sound the same right now?'],
  [
    'Was passiert mit Gestaltung, wenn Systeme auf Entscheidung statt Aufmerksamkeit optimieren?',
    'What happens to design when systems optimize for decisions rather than attention?',
  ],
  [
    'Ist ein persoenliches Archiv heute eher Feed als Sammlung?',
    'Is a personal archive today more like a feed than a collection?',
  ],
  [
    'Baue Posts, Storys, Reels und Short-Ads aus einer Oberfläche mit typografischen Szenen, Format-Presets und exportfertigen Assets.',
    'Build posts, stories, reels and short ads from one interface with typographic scenes, format presets and export-ready assets.',
  ],
  [
    'Kinetic Type trifft Social-first Formatlogik. Ein Tool fuer schnelle Variationen, klare Hooks und exportierbare Motion-Assets.',
    'Kinetic type meets social-first format logic. A tool for fast variations, clear hooks and exportable motion assets.',
  ],
  [
    'Erst kommt das Bild: Form, Dichte, Bewegung und Licht. Danach kann aus dem aktuellen Zustand ein exportierbarer Standalone-Code erzeugt werden.',
    'The image comes first: form, density, movement and light. After that, the current state can be turned into exportable standalone code.',
  ],
  [
    'Das laufende Rendering ist der eigentliche Output. Wenn die Konfiguration sitzt, kann daraus im naechsten Schritt ein kopierbarer Export erzeugt werden.',
    'The live rendering is the actual output. Once the configuration works, the next step can generate a copyable export from it.',
  ],
  [
    'Stelle eine extrem kurze Frage im Stil von Fischli & Weiss. Naiv, absurd, technologisch. (z.B. \'Traeumt mein Backup?\') Nur die Frage.',
    'Ask an extremely short question in the style of Fischli & Weiss. Naive, absurd, technological. For example: “Does my backup dream?” Only the question.',
  ],
  ['Du bist Fischli & Weiss im digitalen Zeitalter.', 'You are Fischli & Weiss in the digital age.'],
];

const attributePairs = [
  ['Vorschau aus Post Everything', 'Preview from Post Everything'],
  ['Portfolio, Lehre, Tools und ausgewählte Projekte von Claudia Mai.', 'Portfolio, teaching, tools and selected projects by Claudia Mai.'],
  ['Claudia Mai: Portfolio und postdigitales Projekt.', 'Claudia Mai: portfolio and postdigital project.'],
  ['Denkraum mit Trendfeldern, Archivspuren und KI-generierten Artefakten.', 'Thinking Space with trend fields, archive traces and AI-generated artifacts.'],
  ['Post Everything Projektansicht', 'Post Everything project view'],
  ['Vorschaubild von FMDG / I find the luck', 'Preview image of FMDG / I find the luck'],
  ['Vorschaubild von Gravity Is Optional', 'Preview image of Gravity Is Optional'],
  ['Atmosphärische Projektansicht aus Gravity Is Optional', 'Atmospheric project view from Gravity Is Optional'],
  ['Zum Beispiel: Wie setzt du Prompting in deiner Lehre ein?', 'For example: How do you use prompting in your teaching?'],
];

const projectTextEn = {
  'post-everything-bachelor-thesis':
    'A bachelor thesis on rule-based creativity and machine-like conditions in design. Around 250 terms with the prefix “post” were designed under strictly random parameters: programs, time windows, search engines, typography, colors and placements were defined in advance. The project examines how creative authorship changes when human design is deliberately bound to a machine-like rule system. The result is a 300-page book, a 1,120-page rulebook and a visual investigation of control, systematics and artificial intelligence in the design process.',
  'fmdg-i-find-the-luck':
    'The work starts from the book “Findet mich das Glück?” by the Swiss artist duo Fischli & Weiss. More than 300 questions were entered into Google Translator and Babelfish and automatically translated into English. The technical services of the internet become a transformer of the whispered message. The translated questions are then addressed to the internet as a vast machine of interpretation and knowledge, searching for answers through visual and linguistic platforms.',
  'follow-the-white-rabbit':
    'The starting point of this work is the question of what reality is and how it changes through new technologies that increasingly influence what we perceive as real. The boundaries between analog and digital, real and altered worlds begin to blur. Alice in Wonderland enters as a classic of fantastic children’s literature and a model for fantasy texts.',
  'fast-fwd-too-slow':
    'Fast fwd: too slow? is an interdisciplinary collaborative project researching digitization and its effects on forms of design expression and communication behavior. The focus lies on new spaces for action and play that designers need to explore: future collaboration, mediation and communication formats, and the shifting role of designers amid technological transformation.',
  'fast-fwd-too-slow-magazine':
    'Excerpts from eight publications created in the seminar fast fwd: too slow? The magazines explore mutable content and display: material can be changed, deleted, supplemented and rendered differently through varying output programs. The project asks how designers respond to these new possibilities and uncertainties.',
  '1984-to-go-claudia-mai':
    'The project refers to the YouTube format “Weltliteratur to go,” where classics are summarized with Playmobil figures. The video on Orwell’s 1984 is analyzed with artificial intelligence and translated into a new automated reading of literary condensation, shortcut culture and machine interpretation.',
  'ich-bin-da':
    'Automated communication triggered by a heartbeat and documented in a Tumblr blog. In the context of the Internet of Things, communication shifts from humans to things, giving identifiable objects human-like traits and a form of artificial intelligence. The project reflects on data, automation and augmented reality.',
  'real-mix':
    'Tool workshops and everyday image and type collages: the seminar generated new visual worlds by combining, cutting and reconfiguring fragments of image and text across many aesthetics. Experimental tool workshops with analog and digital techniques produced a shared visual pool for remixing.',
  'city-of-play':
    'City of Play is a public workshop program for political and playful education in Essen. It invites participants to engage with the right to the city and explores how play can help discover, understand and transform urban spaces through field research and creative interventions.',
  'uaps':
    'UAPs investigates one of humanity’s oldest questions: are we alone in the universe? The book examines well-known alien abduction cases from ancient sightings to modern reports, combining critical analysis, speculative narration and AI-generated imagery.',
  'salvador-ki':
    'The project works with AI-generated descriptions and images around Salvador Dali’s surreal visual language, exploring how artificial intelligence reconstructs iconic art-historical motifs, atmosphere and symbolic elements.',
  'gigi-geht-in-den-zoo-cowny-besucht-den-bauernhof':
    'A seemingly harmless ring-bound children’s book turns into sharp social critique. Animals take on human roles while humans experience the world from the perspective of farm animals. AI-generated images in a cute picture-book style create an ironic inversion of everyday realities.',
  'so-viele-worte-ohne-dich':
    'A project about personal grief and the social taboo around death. Daily photographs preserve a connection to the world, while AI generates answers from old messages by the artist’s late father, printed in his handwriting on postcards.',
  'einmal-um-die-welt':
    'A social-media experiment from the AI course NO PHOTO PLEASE: a fake world trip staged entirely with AI-generated images, image editing and archival material. Over three months, an Instagram account created the illusion of travel without visiting the destinations.',
  'nice-lab-50-50-nairobi':
    'NICE Lab 50/50 Nairobi is a summer school project at the intersection of international education and cultural networking. It brings together young creatives and students from Kenya, South Africa and Germany to explore everyday stories of sharing and exchange.',
  'planet-b-surreal-worlds-utopia-vs-dystopia-paradise-hell':
    'International online workshops with students and artists from Nairobi, Pretoria, Salzgitter and Dortmund focused on collaborative VR/AR projects and surreal worlds. Participants worked in STYLY, Nomad, Blender and related tools.',
  'patient-01034063-datenschal-janneke-sander':
    'PATIENT 01034063 DATENSCHAL is a playful engagement with data protection in medicine. The project uses medical data, privacy regulations and archival traces to reflect on discretion, visibility and personal information.',
  'die-menschenwuerde-ist-eine-wurst-eyad-abushaar':
    'The project experiments with the design of laws and legal documents from the perspective of AI: how would artificial intelligence understand and visualize legal texts? It asks how laws become visible in everyday life.',
  'emotional-distortion-kathy-sattler-emma-luenemann':
    'Emotional Distortion examines how feelings shape perception and judgment. The project consists of a hanging wall of cards for visitors to take away and reflects on taste, influence, insecurity and distorted opinion formation.',
  'blank-hannes-gutwerk-tim-fischer-spiegelbach':
    'BLANK is a digital-collage fashion film that tells a loose, associative and possibly dystopian story set in a future where moving between digital and analog worlds feels ordinary.',
  'trash-cache-salma-parra':
    'Trash Cache brings deleted digital waste into the physical world. Abstract bodies made from files of different sizes, types and colors are translated into augmented reality and placed in rooms, buildings and public space.',
  'future-x-nature-alexander-grygoryan-lena-luebner-lisa-von-rolbiezki':
    'Future x Nature responds to the destructive cycle of online shopping hauls and fast fashion content by exploring digital fashion as an alternative visual and social-media practice.',
  '100-poster-battle-2-sharing-cultural-identities':
    'Sharing Cultural Identities is an experimental bilingual poster design project by students from FH Dortmund and Münster School of Design. It uses shared visual layers like screen printing to explore cultural identity as something collectively mixed and recombined.',
  'preparing-you-for-the-worst':
    'Current conspiracy theories are obsessively illustrated and transformed into a calendar format. Empty date grids leave room for personal calendar systems, while the backs explain the illustrations and can form a wall image.',
};

const extraProjectTextDe = {
  'fmdg-i-find-the-luck:project-version-intro':
    'FMDG / I find the luck wird hier als Ausgangspunkt fuer zwei weiterentwickelte Antwortmaschinen gelesen: einmal als KI-basierte Such- und Bildmaschine und einmal als bewusst inszenierte Vibe-Coding-Oberflaeche.',
};

const normalizeText = (value) => String(value || '').trim().replace(/\s+/g, ' ');

const textMap = new Map([...pairs, ...paragraphPairs].map(([de, en]) => [normalizeText(de), en]));
const reverseTextMap = new Map([...pairs, ...paragraphPairs].map(([de, en]) => [normalizeText(en), de]));
const attrMap = new Map(attributePairs.map(([de, en]) => [normalizeText(de), en]));
const reverseAttrMap = new Map(attributePairs.map(([de, en]) => [normalizeText(en), de]));

let currentLanguage = normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
let isApplying = false;

function normalizeLanguage(value) {
  return LANGUAGES.has(value) ? value : 'de';
}

function translateExact(value, language, map = textMap, reverseMap = reverseTextMap) {
  const text = String(value || '');
  const trimmed = text.trim();
  if (!trimmed) return value;
  if (language === 'en' && /^(\d+)\s+Artefakte gespeichert$/.test(trimmed)) {
    return text.replace(trimmed, trimmed.replace(/^(\d+)\s+Artefakte gespeichert$/, '$1 artifacts saved'));
  }
  if (language === 'de' && /^(\d+)\s+artifacts saved$/.test(trimmed)) {
    return text.replace(trimmed, trimmed.replace(/^(\d+)\s+artifacts saved$/, '$1 Artefakte gespeichert'));
  }
  const translated = language === 'en' ? map.get(normalizeText(trimmed)) : reverseMap.get(normalizeText(trimmed));
  if (!translated) return value;
  return text.replace(trimmed, translated);
}

function translateTextNode(node, language) {
  if (!node.nodeValue.trim()) return;
  node.nodeValue = translateExact(node.nodeValue, language);
}

function translateAttributes(element, language) {
  ['alt', 'aria-label', 'title', 'placeholder', 'content', 'data-question', 'label'].forEach((attribute) => {
    if (!element.hasAttribute(attribute)) return;
    const attrValue = element.getAttribute(attribute);
    const attrTranslated = translateExact(attrValue, language, attrMap, reverseAttrMap);
    const nextValue = translateExact(attrTranslated, language);
    element.setAttribute(attribute, nextValue);
  });
}

function translateProjectText(element, language) {
  const id = element.getAttribute('data-i18n-project-text');
  if (!id) return;
  const originalDe = element.getAttribute('data-i18n-project-de') || element.innerHTML.trim();
  if (!element.hasAttribute('data-i18n-project-de')) {
    element.setAttribute('data-i18n-project-de', originalDe);
  }
  element.innerHTML = language === 'en' ? projectTextEn[id] || originalDe : originalDe;
}

function walk(node, language) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) {
    translateTextNode(node, language);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const tagName = node.tagName.toLowerCase();
  if (['script', 'style', 'noscript', 'svg', 'canvas'].includes(tagName)) return;
  if (node.closest?.('[data-i18n-ignore]')) return;

  translateAttributes(node, language);
  translateProjectText(node, language);

  Array.from(node.childNodes).forEach((child) => walk(child, language));
}

function updateSwitch(button) {
  if (!button) return;
  button.textContent = currentLanguage === 'de' ? 'DE / EN' : 'EN / DE';
  button.setAttribute('aria-label', currentLanguage === 'de' ? 'Sprache auf Englisch umschalten' : 'Switch language to German');
  button.setAttribute('title', currentLanguage === 'de' ? 'Sprache: Deutsch. Zu Englisch wechseln.' : 'Language: English. Switch to German.');
  button.dataset.language = currentLanguage;
}

function ensureSwitch() {
  let button = document.querySelector('.global-language-toggle');
  if (button) {
    updateSwitch(button);
    return button;
  }
  if (document.getElementById('lang-toggle')) return null;

  button = document.createElement('button');
  button.type = 'button';
  button.className = 'global-language-toggle';
  button.addEventListener('click', () => setLanguage(currentLanguage === 'de' ? 'en' : 'de'));
  document.body.appendChild(button);
  updateSwitch(button);
  return button;
}

function injectStyles() {
  if (document.getElementById('global-i18n-style')) return;
  const style = document.createElement('style');
  style.id = 'global-i18n-style';
  style.textContent = `
    .global-language-toggle {
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 20000;
      min-width: 74px;
      min-height: 34px;
      border: 1px solid #000;
      border-radius: 999px;
      background: #ccff00;
      color: #000;
      font: 700 11px/1 Arial, Helvetica, sans-serif;
      letter-spacing: 0;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 4px 4px 0 #000;
      pointer-events: auto;
    }
    .global-language-toggle:hover {
      background: #000;
      color: #ccff00;
      box-shadow: 4px 4px 0 #ccff00;
    }
  `;
  document.head.appendChild(style);
}

function setDocumentLanguage(language) {
  document.documentElement.lang = language;
  document.title = translateExact(document.title, language);
}

export function setLanguage(language) {
  currentLanguage = normalizeLanguage(language);
  window.localStorage.setItem(STORAGE_KEY, currentLanguage);

  isApplying = true;
  setDocumentLanguage(currentLanguage);
  walk(document.body, currentLanguage);
  updateSwitch(ensureSwitch());
  window.dispatchEvent(new CustomEvent('site-language-change', { detail: { language: currentLanguage } }));
  window.setTimeout(() => {
    isApplying = false;
  }, 0);
}

export function getLanguage() {
  return currentLanguage;
}

export function translateProjectSummary(id, fallback) {
  if (currentLanguage !== 'en') return fallback;
  return projectTextEn[id] || fallback;
}

export function initLanguageToggle() {
  injectStyles();
  ensureSwitch();
  setLanguage(currentLanguage);

  window.addEventListener('site-language-change', (event) => {
    const nextLanguage = normalizeLanguage(event.detail?.language);
    if (nextLanguage === currentLanguage) return;
    currentLanguage = nextLanguage;
    window.localStorage.setItem(STORAGE_KEY, currentLanguage);

    isApplying = true;
    setDocumentLanguage(currentLanguage);
    walk(document.body, currentLanguage);
    updateSwitch(document.querySelector('.global-language-toggle'));
    window.setTimeout(() => {
      isApplying = false;
    }, 0);
  });

  const observer = new MutationObserver((mutations) => {
    if (isApplying) return;
    isApplying = true;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => walk(node, currentLanguage));
      if (mutation.type === 'attributes') translateAttributes(mutation.target, currentLanguage);
    });
    updateSwitch(document.querySelector('.global-language-toggle'));
    isApplying = false;
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['alt', 'aria-label', 'title', 'placeholder', 'content', 'data-question', 'label'],
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageToggle, { once: true });
} else {
  initLanguageToggle();
}
