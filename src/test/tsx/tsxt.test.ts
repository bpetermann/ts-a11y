import * as assert from 'assert';
import * as vscode from 'vscode';
import { messages } from '../../diagnostics/tsx/messages';
import { TSXDiagnosticGenerator } from '../../diagnostics/tsx/generator';

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
  test('<button> with no "aria-label"', async () => {
    const tsx = `<button></button>`;

    const document = await getDocument(tsx);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.button['aria-label']);
  });

  test('should not crash if no validator found', async () => {
    const tsx = `<div></div>`;

    const document = await getDocument(tsx);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });
});
