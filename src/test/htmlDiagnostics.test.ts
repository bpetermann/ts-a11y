import * as assert from 'assert';
import * as vscode from 'vscode';
import { getHtmlDiagnostics } from '../diagnostics/htmlDiagnostics';
import { warnings } from '../diagnostics/warnings';

const getDocument = (html: string) =>
  vscode.workspace.openTextDocument({
    content: html,
    language: 'html',
  });

suite('HTML Test Suite', () => {
  test('html element with missing lang attribute', async () => {
    const html = `<html></html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.html.lang);
  });

  test('html element with empty lang attribute', async () => {
    const html = `<html lang=""></html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.html.lang);
  });

  test('missing title tag', async () => {
    const html = `
    <html lang="en">
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body></body>
    </html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.title.shouldExist);
  });

  test('missing viewport attribute on meta element', async () => {
    const html = `
    <html lang="en">
    <head>
    <title>Document</title>
    </head>
    <body></body>
    </html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.meta.shouldExist);
  });
});
