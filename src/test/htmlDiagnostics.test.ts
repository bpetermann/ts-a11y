import * as assert from 'assert';
import * as vscode from 'vscode';
import { getHtmlDiagnostics } from '../diagnostics/htmlDiagnostics';
import { warnings } from '../diagnostics/warnings';

suite('HTML Test Suite', () => {
  test('Html tag without a lang attribute', async () => {
    const htmlSample = `<html></html>`;

    const document = await vscode.workspace.openTextDocument({
      content: htmlSample,
      language: 'html',
    });

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.html.lang);
  });

  test('Missing title element', async () => {
    const htmlSample = `
    <!DOCTYPE html>
    <html lang="en">
    <head></head>
    <body></body>
    </html>
    </html>`;

    const document = await vscode.workspace.openTextDocument({
      content: htmlSample,
      language: 'html',
    });

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.title.shouldExist);
  });
});
