import * as assert from 'assert';
import * as vscode from 'vscode';
import { Diagnostic as HTMLDiagnostic } from '../diagnostics/html/diagnostic';
import { messages } from '../diagnostics/html/messages';
import {
  body,
  div,
  getDocument,
  head,
  html,
  link,
  meta,
  title,
} from './helper';

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
      messages.html.hasMissingAttribute
    );
  });

  test('Missing viewport attribute on <meta> element', async () => {
    const content = html(head(title) + body());

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.meta.shouldExist);
  });

  test('Missing <title> tag', async () => {
    const content = html(head(meta) + body());

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.title.shouldExist);
  });

  test('Empty <html> should return two diagnostics', async () => {
    const html = '';

    const document = await getDocument(html);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 2);
  });

  test('Empty lang attribute in <html> tag', async () => {
    const html = `<html lang=""></html>`;

    const document = await getDocument(html);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(
      diagnostics[0].message,
      messages.html.hasMissingAttribute
    );
  });

  test('Two occurrences of <title> tag', async () => {
    const content = html(head(meta + title + title) + body());

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.title.shouldBeUnique);
  });

  test('Two occurrences of <main> tag', async () => {
    const content = html(
      head(meta + title) + body('<main></main><main></main>')
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.main.shouldBeUnique);
  });

  test('Two occurrences of <nav> without attributes', async () => {
    const content = html(head(meta + title) + body('<nav></nav><nav></nav>'));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.nav);
  });

  test('Two occurrences of <nav> with attributes', async () => {
    const content = html(head(meta + title) + body());

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('Two occurrences of <h1> tag', async () => {
    const content = html(head(meta + title) + body('<h1></h1><h1></h1>'));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.h1.shouldBeUnique);
  });

  test('Heading <h4> tag with missing <h3>', async () => {
    const content = html(head(meta + title) + body('<h4></h4>'));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('Heading <h4> and <h3> tag with missing <h2>', async () => {
    const content = html(head(meta + title) + body('<h3>h3</h3><h4></h4>'));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('Heading <h4>, <h3>, and <h2> tags with missing <h2>', async () => {
    const headings = '<h3></h3><h4></h4><h2></h2>';
    const content = html(head(meta + title) + body(headings));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('Heading <h2> tag with exisiting <h1> tag', async () => {
    const content = html(head(meta + title) + body('<h1></h1><h2></h2>'));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('Anchor with a generic description', async () => {
    const linktext = 'Click';
    const content = html(head(meta + title) + body(link(linktext)));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, `${messages.link.avoid}"${linktext}"`);
  });

  test('Anchor with a good description', async () => {
    const linktext = 'Learn how to create meaningful content';
    const content = html(head(meta + title) + body(link(linktext)));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('Anchor with a an "onclick" event', async () => {
    const content = html(
      head(meta + title) + body(`<a onclick="click()"></a>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.onclick);
  });

  test('Anchor with a tabindex of "-1"', async () => {
    const content = html(head(meta + title) + body(`<a tabindex="-1"></a>`));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.tabindex);
  });

  test('Anchor with "mailto" in "href"', async () => {
    const linktext = 'If you want to learn more about our products, contact us';
    const content = html(
      head(meta + title) +
        body(`<a href="mailto:support@office.com">${linktext}</a>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.mail);
  });

  test('Div with "onclick" event', async () => {
    const content = html(
      head(meta + title) + body(`<div onclick="click()"></div>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.button);
  });

  test('Div with "role" set to "button"', async () => {
    const content = html(
      head(meta + title) + body(`<div role="button"></div>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.button);
  });

  test('Two divs used as buttons', async () => {
    const divs = `<div role="button"></div><div onclick="click()"div>`;
    const content = html(head(meta + title) + body(divs));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 2);
  });

  test('A valid div container', async () => {
    const content = html(
      head(meta + title) + body(div(`<button onclick="click()"></button>`))
    );

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('A switch <button> without "aria-checked"', async () => {
    const content = html(
      head(meta + title) + body(div(`<button role="switch"></button>`))
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.button.switchRole);
  });

  test('Valid HTML should return no diagnostics', async () => {
    const content = html(head(meta + title) + body());

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });
});
