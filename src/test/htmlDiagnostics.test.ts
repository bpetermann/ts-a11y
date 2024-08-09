import * as assert from 'assert';
import * as vscode from 'vscode';
import { getHtmlDiagnostics } from '../diagnostics/htmlDiagnostics';
import { defaultWarnings, warnings } from '../diagnostics/warnings';
import { meta, html, head, body, title } from './helper';

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

    assert.strictEqual(
      diagnostics[0].message,
      warnings.html.hasMissingAttribute
    );
  });

  test('empty html should return three diagnostics', async () => {
    const html = '';

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics.length, 3);
  });

  test('html element with empty lang attribute', async () => {
    const html = `<html lang=""></html>`;

    const document = await getDocument(html);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(
      diagnostics[0].message,
      warnings.html.hasMissingAttribute
    );
  });

  test('missing title tag', async () => {
    const content = html(head(meta) + body());

    const document = await getDocument(content);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.title.shouldExist);
  });

  test('missing viewport attribute on meta element', async () => {
    const content = html(head(title) + body());

    const document = await getDocument(content);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.meta.shouldExist);
  });

  test('two occurrences of <title>', async () => {
    const content = html(head(meta + title + title) + body());

    const document = await getDocument(content);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(
      diagnostics[0].message,
      defaultWarnings.shouldBeUnique + 'title'
    );
  });

  test('two occurrences of <main>', async () => {
    const content = html(
      head(meta + title) + body('<main></main><main></main>')
    );

    const document = await getDocument(content);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0].message, warnings.main.shouldBeUnique);
  });

  test('valid html', async () => {
    const content = html(head(meta + title) + body());

    const document = await getDocument(content);

    const diagnostics = getHtmlDiagnostics(document.getText(), document);

    assert.strictEqual(diagnostics[0], undefined);
  });
});
