import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distUrl = new URL('../dist/', import.meta.url);
const distDir = fileURLToPath(distUrl);
const rawBase = process.env.GITHUB_PAGES_BASE || '/portfolioslop/';
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
const basePattern = base.replace(/^\/+/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const textExtensions = new Set(['.html', '.js', '.css']);

function extensionOf(filePath) {
  const index = filePath.lastIndexOf('.');
  return index === -1 ? '' : filePath.slice(index);
}

function shouldPrefix(path) {
  return (
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.startsWith(base) &&
    !path.startsWith('/http:') &&
    !path.startsWith('/https:') &&
    !path.startsWith('/mailto:') &&
    !path.startsWith('/tel:') &&
    !path.startsWith('/#')
  );
}

function rewriteQuotedValue(raw) {
  return shouldPrefix(raw) ? `${base}${raw.replace(/^\/+/, '')}` : raw;
}

function rewriteJsStrings(source) {
  let output = '';
  let index = 0;
  let previousSignificant = '';

  function appendNormal(char) {
    output += char;
    if (!/\s/.test(char)) previousSignificant = char;
  }

  function readString(quote) {
    let raw = '';
    output += quote;
    index += 1;

    while (index < source.length) {
      const char = source[index];
      if (char === '\\') {
        raw += char + (source[index + 1] || '');
        index += 2;
        continue;
      }
      if (char === quote) {
        output += rewriteQuotedValue(raw) + quote;
        index += 1;
        previousSignificant = quote;
        return;
      }
      raw += char;
      index += 1;
    }

    output += raw;
  }

  function readRegex() {
    output += '/';
    index += 1;
    let inCharacterClass = false;

    while (index < source.length) {
      const char = source[index];
      output += char;
      if (char === '\\') {
        index += 1;
        if (index < source.length) output += source[index];
      } else if (char === '[') {
        inCharacterClass = true;
      } else if (char === ']') {
        inCharacterClass = false;
      } else if (char === '/' && !inCharacterClass) {
        index += 1;
        while (/[a-z]/i.test(source[index] || '')) {
          output += source[index];
          index += 1;
        }
        previousSignificant = '/';
        return;
      }
      index += 1;
    }
  }

  function readLineComment() {
    while (index < source.length) {
      const char = source[index];
      output += char;
      index += 1;
      if (char === '\n') return;
    }
  }

  function readBlockComment() {
    while (index < source.length) {
      const char = source[index];
      output += char;
      index += 1;
      if (char === '*' && source[index] === '/') {
        output += '/';
        index += 1;
        return;
      }
    }
  }

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '"' || char === "'" || char === '`') {
      readString(char);
      continue;
    }

    if (char === '/' && next === '/') {
      readLineComment();
      continue;
    }

    if (char === '/' && next === '*') {
      readBlockComment();
      continue;
    }

    if (char === '/' && /[({[=,:;!?&|]|^$/.test(previousSignificant)) {
      readRegex();
      continue;
    }

    appendNormal(char);
    index += 1;
  }

  return output;
}

function prefixHtmlAndCssUrls(source) {
  const attrPattern = new RegExp(`\\b(href|src|action)=("|')/(?!/|${basePattern})`, 'g');
  const cssPattern = new RegExp(`\\b(url\\()("|')?/(?!/|${basePattern})`, 'g');

  return source
    .replace(attrPattern, `$1=$2${base}`)
    .replace(cssPattern, `$1$2${base}`);
}

function rewriteInlineScripts(source) {
  return source.replace(/(<script\b(?![^>]*\bsrc=)[^>]*>)([\s\S]*?)(<\/script>)/gi, (match, open, body, close) => {
    return `${open}${rewriteJsStrings(body)}${close}`;
  });
}

function prefixRootUrls(source, extension) {
  if (extension === '.js') {
    return rewriteJsStrings(prefixHtmlAndCssUrls(source));
  }

  if (extension === '.css') {
    return prefixHtmlAndCssUrls(source);
  }

  return rewriteInlineScripts(prefixHtmlAndCssUrls(source));
}

async function walk(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const filePath = join(dir, entry);
    const info = await stat(filePath);
    if (info.isDirectory()) {
      files.push(...await walk(filePath));
    } else {
      files.push(filePath);
    }
  }

  return files;
}

await mkdir(distDir, { recursive: true });
await writeFile(new URL('.nojekyll', distUrl), '');

const files = await walk(distDir);
for (const filePath of files) {
  const extension = extensionOf(filePath);
  if (!textExtensions.has(extension)) continue;

  const source = await readFile(filePath, 'utf8');
  const rewritten = prefixRootUrls(source, extension);
  if (rewritten !== source) {
    await writeFile(filePath, rewritten);
  }
}
