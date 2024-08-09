import * as assert from 'assert';
import * as vscode from 'vscode';
import { meta, html, head, body, title } from './helper';
import { HTMLDiagnostic } from '../diagnostics/HTMLDiagnostic';
import { defaultMessages, warnings } from '../diagnostics/Warnings';

/**
 * Creates an html document based on a string.
 */
const getDocument = (html: string) =>
  vscode.workspace.openTextDocument({
    content: html,
    language: 'html',
  });

/**
 * Generates diagnostics for an html document.
 */
const generateDiagnostics = (document: vscode.TextDocument) =>
  new HTMLDiagnostic(document.getText(), document).generateDiagnostics();

suite('HTML Test Suite', () => {
  test('Missing lang attribute in <html> tag', async () => {
    const html = `<html></html>`;

    const document = await getDocument(html);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(
      diagnostics[0].message,
      warnings.html.hasMissingAttribute
    );
  });

  test('Empty HTML should return three diagnostics', async () => {
    const html = '';

    const document = await getDocument(html);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 3);
  });

  test('Empty lang attribute in <html> tag', async () => {
    const html = `<html lang=""></html>`;

    const document = await getDocument(html);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(
      diagnostics[0].message,
      warnings.html.hasMissingAttribute
    );
  });

  test('Missing <title> tag', async () => {
    const content = html(head(meta) + body());

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, warnings.title.shouldExist);
  });

  test('Missing viewport attribute on <meta> element', async () => {
    const content = html(head(title) + body());

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, warnings.meta.shouldExist);
  });

  test('Two occurrences of <title> tag', async () => {
    const content = html(head(meta + title + title) + body());

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(
      diagnostics[0].message,
      defaultMessages.shouldBeUnique + 'title'
    );
  });

  test('Two occurrences of <main> tag', async () => {
    const content = html(
      head(meta + title) + body('<main></main><main></main>')
    );

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, warnings.main.shouldBeUnique);
  });

  test('Two occurrences of <nav> without attributes', async () => {
    const content = html(head(meta + title) + body('<nav></nav><nav></nav>'));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(
      diagnostics[0].message,
      warnings.nav.hasMissingAttribute
    );
  });

  test('Two occurrences of <nav> with attributes', async () => {
    const content = html(
      head(meta + title) +
        body('<nav aria-label="main"></nav><nav aria-label="content"></nav>')
    );

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('Valid HTML should return no diagnostics', async () => {
    const content = html(head(meta + title) + body());

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });
});
