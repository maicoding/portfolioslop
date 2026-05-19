import { retrieveLehrkonzeptChunks } from './lehrkonzept-rag-data.js';

const conceptQuestionInput = document.getElementById('concept-question');
const conceptQaForm = document.getElementById('concept-qa-form');
const conceptAnswer = document.getElementById('concept-answer');
const conceptPresetButtons = Array.from(document.querySelectorAll('.c-qa-chip'));
const conceptAnswerLabel =
  'KI gestützte Beantwortung zum Lehrkonzept. Trotz Erweiterung des verwendeten Sprachmodells (RAG) um das Konzept können die Antworten inhaltlich abweichen.';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAnswerState(html) {
  conceptAnswer.innerHTML = `
    <span class="c-qa-output-label">${escapeHtml(conceptAnswerLabel)}</span>
    ${html}
  `;
}

function renderUnsupported(question) {
  renderAnswerState(`
    <p><strong>Frage:</strong> ${escapeHtml(question)}</p>
    <p style="margin-top:12px;">Dazu finde ich in der hinterlegten Wissensbasis des Lehrkonzepts noch keine belastbare Grundlage. Wenn du magst, erweitern wir die Chunks genau für dieses Thema.</p>
  `);
}

async function fetchRagAnswer(question) {
  const response = await fetch('/.netlify/functions/lehrkonzept-rag', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'RAG request failed');
  }

  return data;
}

async function handleQuestion(question) {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return;

  const matches = retrieveLehrkonzeptChunks(trimmedQuestion, 4);
  if (!matches.length) {
    renderUnsupported(trimmedQuestion);
    return;
  }

  renderAnswerState(`
    <p><strong>Frage:</strong> ${escapeHtml(trimmedQuestion)}</p>
    <p style="margin-top:12px;">Ich gleiche die Frage gerade mit dem Lehrkonzept ab...</p>
  `);

  try {
    const data = await fetchRagAnswer(trimmedQuestion);
    const sources = Array.isArray(data.sources) ? data.sources : [];

    renderAnswerState(`
      <p><strong>Frage:</strong> ${escapeHtml(trimmedQuestion)}</p>
      <p style="margin-top:12px;">${escapeHtml(data.answer || '')}</p>
      ${
        sources.length
          ? `<p style="margin-top:12px; font-size:0.92rem;"><strong>Basis:</strong> ${sources
              .map((source) => escapeHtml(source.title))
              .join(' / ')}</p>`
          : ''
      }
    `);
  } catch (error) {
    const fallback = matches[0];
    renderAnswerState(`
      <p><strong>Frage:</strong> ${escapeHtml(trimmedQuestion)}</p>
      <p style="margin-top:12px;">${escapeHtml(fallback.explanation)}</p>
      <p style="margin-top:12px; font-size:0.92rem;"><strong>Basis:</strong> ${escapeHtml(fallback.title)}</p>
    `);
  }
}

conceptQaForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  handleQuestion(conceptQuestionInput?.value || '');
});

conceptPresetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.dataset.question || '';
    if (conceptQuestionInput) conceptQuestionInput.value = question;
    handleQuestion(question);
  });
});
