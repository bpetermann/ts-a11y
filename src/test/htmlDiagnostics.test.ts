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
  test('html tag with missing lang attribute', async () => {
    const html = `<html></html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.html.lang);
  });

  test('html tag with empty lang attribute', async () => {
    const html = `<html lang=""></html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.html.lang);
  });

  test('missing title element', async () => {
    const html = `
    <html lang="en">
    <head></head>
    <body></body>
    </html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.title.shouldExist);
  });

  test('valid html', async () => {
    const html = `
    <html lang="en">
    <head>
    <title>Document</title>
    </head>
    <body></body>
    </html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0], undefined);
  });
});
