import * as assert from 'assert';
import * as vscode from 'vscode';
import { HTMLDiagnosticGenerator } from '../../diagnostics/html/generator';
import { messages } from '../../diagnostics/html/messages';
import {
  body,
  div,
  getDocument,
  head,
  html,
  link,
  meta,
  title,
} from '../helper';

/**
 * Generates diagnostics for an html document.
 */
const generateDiagnostics = (document: vscode.TextDocument) =>
  new HTMLDiagnosticGenerator(
    document.getText(),
    document
  ).generateDiagnostics();

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

  test('Missing viewport attribute in <meta> element', async () => {
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

  test('Empty <html> tag should return two diagnostics', async () => {
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

    assert.strictEqual(message, messages.nav.label);
  });

  test('Two occurrences of <nav> with attributes', async () => {
    const navs =
      '<nav aria-label="main"></nav><nav aria-label="customer service"></nav>';
    const content = html(head(meta + title) + body(navs));

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

  test('<h4> tag present without preceding <h3> tag', async () => {
    const content = html(head(meta + title) + body('<h4></h4>'));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('<h4> and <h3> tags present without preceding <h2> tag', async () => {
    const content = html(head(meta + title) + body('<h3>h3</h3><h4></h4>'));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('<h4>, <h3>, and <h2> tags present with missing <h2> tag', async () => {
    const headings = '<h3></h3><h4></h4><h2></h2>';
    const content = html(head(meta + title) + body(headings));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('<h2> tag present with existing <h1> tag', async () => {
    const content = html(head(meta + title) + body('<h1></h1><h2></h2>'));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<a> tag with a generic description', async () => {
    const linktext = 'Click';
    const content = html(head(meta + title) + body(link(linktext)));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, `${messages.link.avoid}"${linktext}"`);
  });

  test('<a> tag with a good description', async () => {
    const linktext = 'Learn how to create meaningful content';
    const content = html(head(meta + title) + body(link(linktext)));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<a> tag with a an "onclick" event', async () => {
    const content = html(
      head(meta + title) + body(`<a onclick="click()"></a>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.onclick);
  });

  test('<a> tag with a aria-hidden="true"', async () => {
    const content = html(
      head(meta + title) + body(`<a aria-hidden="true"></a>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link['aria-hidden']);
  });

  test('<a> tag with tabindex="-1"', async () => {
    const content = html(head(meta + title) + body(`<a tabindex="-1"></a>`));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.tabindex);
  });

  test('<a> tag with "mailto" in the "href"', async () => {
    const linktext = 'If you want to learn more about our products, contact us';
    const content = html(
      head(meta + title) +
        body(`<a href="mailto:support@office.com">${linktext}</a>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.mail);
  });

  test('<a> tag with all checks failing', async () => {
    const tabindex = `tabindex="-1" `;
    const href = `href="mailto:support@office.com" `;
    const onclick = `onclick="click()" `;
    const text = 'click';
    const anchor = `<a ${tabindex}${href}${onclick}>${text}</a>`;

    const content = html(head(meta + title) + body(anchor));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 4);
  });

  test('<a> tag missing the aria-current attribute', async () => {
    const anchors = ['home', 'products', 'contact']
      .map((a) => `<a href="/${a}">${a}</a>`)
      .toString();

    const content = html(head(meta + title) + body(anchors));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.current);
  });

  test('<a> tag in a long consecutive list', async () => {
    let links = '<a aria-current="page">Home</a>';

    for (let index = 0; index < 5; index++) {
      links += `<a>link number ${index}</a>`;
    }

    const content = html(head(meta + title) + body(links));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.link.list);
  });

  test('<div> tag with "onclick" event', async () => {
    const content = html(
      head(meta + title) + body(`<div onclick="click()"></div>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.button);
  });

  test('<div> tag with role="button"', async () => {
    const content = html(
      head(meta + title) + body(`<div role="button"></div>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.button);
  });

  test('<div> used as a button', async () => {
    const divs = `<div role="button"></div><div onclick="click()"div>`;
    const content = html(head(meta + title) + body(divs));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 2);
  });

  test('<div> tag with aria-expanded attribute', async () => {
    const content = html(
      head(meta + title) + body(`<div aria-expanded="true"></div>`)
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.expanded);
  });

  test('Long sequence of nested <div> elements', async () => {
    const content = html(
      head(meta + title) + body(div(div(div(div(div(null))))))
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div.soup);
  });

  test('A valid <div> element', async () => {
    const content = html(head(meta + title) + body(div(null)));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<div> with aria hidden and focusable children', async () => {
    const divs = div('<a href="/blog"></a>', 'aria-hidden="true"');
    const content = html(head(meta + title) + body(divs));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div['aria-hidden']);
  });

  test('<div> with aria hidden and <button> child', async () => {
    const divs = div(
      div(div(div(`<button>click me</button>`), 'aria-hidden="true"'))
    );
    const content = html(head(meta + title) + body(divs));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div['aria-hidden']);
  });

  test('<div> with aria hidden and <a> child', async () => {
    const link = `<a href="/contact">contact</a>`;
    const divs = div(div(div(div(link), 'aria-hidden="true"')));
    const content = html(head(meta + title) + body(divs));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.div['aria-hidden']);
  });

  test('<button> with role="switch" but missing aria-checked', async () => {
    const content = html(
      head(meta + title) + body(div(`<button role="switch"></button>`))
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.button.switchRole);
  });

  test('<button> with disabled role', async () => {
    const content = html(
      head(meta + title) + body(div(`<button disabled></button>`))
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.button.disabled);
  });

  test('<button> with "tabindex" greater than zero', async () => {
    const content = html(
      head(meta + title) + body(div(`<button tabindex="2"></button>`))
    );

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.button.tabindex);
  });

  test('<button> with no text content', async () => {
    const button = `<button></button>`;
    const content = html(head(meta + title) + body(button));
    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics[0].message, messages.button.text);
  });

  test('<button> with no text but <img> as child', async () => {
    const img = '<img src="/me.jpg" alt="Sunrise"></img>';
    const button = `<button>${img}</button>`;
    const content = html(head(meta + title) + body(button));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<button> with no text but "aria-label"', async () => {
    const button = `<button aria-label="product count"></button>`;
    const content = html(head(meta + title) + body(button));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<button> with no text but "aria-labelledby"', async () => {
    const button = `<button aria-labelledby="submit-heading"></button>`;
    const content = html(head(meta + title) + body(button));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<button> with no text but "title"', async () => {
    const button = `<button title="Submit Form"></button>`;
    const content = html(head(meta + title) + body(button));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<input> field nested inside a <label> element', async () => {
    const input = '<label>Username<input type="text"></label>';
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<input> field adjacent to a <label> element', async () => {
    const input = `<label>Username</label><input id="username" type="text">`;
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<input> field adjacent to a <label> element with a line break', async () => {
    const input = `
    <label>Username</label>
    <input id="username" type="text">
    `;
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<input> field with "aria-labelledby" attribute', async () => {
    const input = '<input type="text" aria-labelledby="btn_search">';
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<input> field with no visible label or reference', async () => {
    const input = '<input type="text">';
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.input.label);
  });

  test('<fieldset> with <legend> as the first child>', async () => {
    const input =
      '<fieldset><legend>What is your spirit animal?</legend></fieldset>';
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<fieldset> with a line break before the first <legend> child', async () => {
    const input = `
    <fieldset>
    <legend>What is your spirit animal?</legend>
    </fieldset>
    `;

    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('<fieldset> with no <legend> tag', async () => {
    const input = '<fieldset></fieldset>';
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.fieldset.legend);
  });

  test('<fieldset> with nested <legend> tag', async () => {
    const input = `<fieldset>
      <div><legend>What is your spirit animal?</legend></div></fieldset>`;
    const content = html(head(meta + title) + body(input));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.fieldset.legend);
  });

  test('<img> tag missing the alt attribute', async () => {
    const img = `<img src="send.png">`;
    const content = html(head(meta + title) + body(img));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.img.alt);
  });

  test('<img> tag with an empty alt attribute', async () => {
    const img = `<img src="send.png" alt="">`;
    const content = html(head(meta + title) + body(img));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('Many <img> elements with same alt-attribute', async () => {
    const img1 = `<img alt="Beach">`;
    const img4 = `<img alt="Alps">`;
    const images = img1 + img1 + img1 + img1 + img4;

    const content = html(head(meta + title) + body(images));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.img.repeated);
  });

  test('Different <img> elements with same alt-attribute', async () => {
    const img1 = `<img alt="Beach">`;
    const img2 = `<img alt="Alps">`;
    const images = img1 + img2 + img1 + img2 + img1 + img2 + img1 + img2;

    const content = html(head(meta + title) + body(images));

    const document = await getDocument(content);
    const diagnostics = generateDiagnostics(document);

    diagnostics.forEach((diagnostic) => {
      assert.strictEqual(diagnostic.message, messages.img.repeated);
    });

    assert.strictEqual(diagnostics.length, 2);
  });

  test('Two occurrences of <section> without attributes', async () => {
    const sections = '<section></section><section></section>';
    const content = html(head(meta + title) + body(sections));

    const document = await getDocument(content);
    const { message } = generateDiagnostics(document)?.[0];

    assert.strictEqual(message, messages.section.label);
  });

  test('Two occurrences of <section> with attributes', async () => {
    const sections =
      '<section aria-label="about me"></section><section aria-label="contact"></section>';
    const content = html(head(meta + title) + body(sections));

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
