import assert from 'assert';
import * as vscode from 'vscode';
import { HTMLDiagnosticGenerator } from '../../diagnostics/html/DiagnosticGenerator';

/** Creates an html document based on a string. */
export const getDocument = (html: string) =>
  vscode.workspace.openTextDocument({
    content: html,
    language: 'html',
  });
/**
 * Generates diagnostics for an html document.
 */
const generateDiagnostics = (document: vscode.TextDocument) =>
  new HTMLDiagnosticGenerator(
    document.getText(),
    document
  ).generateDiagnostics();

suite('HTML Test Suite', () => {
  test('A valid "html" document should return no errors', async () => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
         <head>
             <meta charset="UTF-8" />
             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
             <title>Document</title>
         </head>
     <body></body>
    </html>`;

    const document = await getDocument(html);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });
});
