import * as assert from 'assert';
import * as vscode from 'vscode';
import { messages } from '../../diagnostics/tsx/messages';
import { TSXDiagnosticGenerator } from '../../diagnostics/tsx/generator';
import { Div, div, fraction } from '../helper';

/**
 * Generates diagnostics for an tsx document.
 */
const generateDiagnostics = (document: vscode.TextDocument) =>
  new TSXDiagnosticGenerator(document.getText()).generateDiagnostics();

export const getDocument = (tsx: string) =>
  vscode.workspace.openTextDocument({
    content: tsx,
    language: 'typescriptreact',
  });

suite('TSX Test Suite', () => {
  test('should handle it gracefully if no validator is found', async () => {
    const tsx = `<div></div>`;

    const document = await getDocument(tsx);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<img> with missing alt attribute', async () => {
    const tsx = `<img src="/me.jpg"></img>`;

    const document = await getDocument(tsx);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.img.alt);
  });

  test('<img> tag with an empty alt attribute', async () => {
    const tsx = `<img src="/me.jpg" alt=""></img>`;

    const document = await getDocument(tsx);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<img> tag with an generic alt text', async () => {
    const alt = 'A .jpg';
    const tsx = `<img src="/me.jpg" alt="A .jpg"></img>`;

    const document = await getDocument(tsx);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.img.generic + alt);
  });

  test('<button> with role="switch" but missing aria-checked', async () => {
    const content = `<button role="switch"></button>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.button.switch);
  });

  test('<button> with no text content', async () => {
    const content = `<button></button>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.button.text);
  });

  test('<button> with no text but <img> as child', async () => {
    const img = '<img src="/me.jpg" alt="Sunrise"></img>';
    const content = `<button>${img}</button>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<button> with no text but "aria-label"', async () => {
    const content = `<button aria-label="product count"></button>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<button> with no text but "aria-labelledby"', async () => {
    const content = `<button aria-labelledby="submit-heading"></button>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<button> with no text but "title"', async () => {
    const content = `<button title="Submit Form"></button>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('Long sequence of nested <div> elements', async () => {
    const content = div(div(div(div(div(div())))));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.div.soup);
  });

  test('A single <div> element', async () => {
    const content = Div('');

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<div> tag with "onclick" event', async () => {
    const content = Div(null, 'onclick="click()"');

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.button);
  });

  test('<div> tag with role="button"', async () => {
    const content = Div(null, 'role="button"');

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.button);
  });

  test('<div> used as a button', async () => {
    const content = fraction(
      Div(null, 'role="button"'),
      Div(null, 'onclick="click()"')
    );

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 2);
  });

  test('<div> tag with aria-expanded attribute', async () => {
    const content = Div(null, 'aria-expanded="true"');

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.expanded);
  });

  test('<div> with aria hidden and focusable children', async () => {
    const content = Div('<a href="/blog"></a>', 'aria-hidden="true"');

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div['aria-hidden']);
  });

  test('<div> with aria hidden and <button> child', async () => {
    const content = Div(
      Div(Div(Div('<button>click me</button>'))),
      'aria-hidden="true"'
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div['aria-hidden']);
  });

  test('<div> with aria hidden and <a> child', async () => {
    const content = Div(
      Div(Div(fraction(Div(null), '<a href="/contact">contact</a>'))),
      'aria-hidden="true"'
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div['aria-hidden']);
  });

  test('<a> tag with a generic description', async () => {
    const text = 'click';
    const content = `<a>${text}</a>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.link.generic + text);
  });

  test('<a> tag with a no description', async () => {
    const content = `<a></a>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<a> tag with a an "onclick" event', async () => {
    const content = `<a onclick="click()"></a>`;

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.onclick);
  });

  test('<a> tag with "mailto" in the "href"', async () => {
    const linktext = 'If you want to learn more about our products, contact us';
    const content = `<a href="mailto:support@office.com">${linktext}</a>`;

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.mail);
  });
});
