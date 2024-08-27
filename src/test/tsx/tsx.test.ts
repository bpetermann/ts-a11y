import * as assert from 'assert';
import * as vscode from 'vscode';
import { messages } from '../../diagnostics/tsx/messages';
import { TSXDiagnosticGenerator } from '../../diagnostics/tsx/generator';
import { div } from '../helper';

/**
 * Generates diagnostics for an html document.
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

  test('<img> tag with an generic alt tex', async () => {
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

  test('Long sequence of nested <div> elements', async () => {
    const content = div(div(div(div(div(div())))));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.div.soup);
  });

  test('A single <div> element', async () => {
    const content = `<div></div>`;

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });
});
