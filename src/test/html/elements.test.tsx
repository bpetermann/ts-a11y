import assert from 'assert';
import { Element } from 'domhandler';
import { DomUtils, parseDocument } from 'htmlparser2';
import ElementList from '../../diagnostics/html/elements';
import { div } from '../helper';

const getNode = (content: string) =>
  DomUtils.filter(
    (node) => node.type === 'tag',
    parseDocument(content, {
      withStartIndices: true,
      withEndIndices: true,
    }).children
  ).filter((node) => node instanceof Element)?.[0];

suite('ElementList Test Suite', () => {
  test("Should allow 'aria-hidden' on a plain <div> element", async () => {
    const content = div(null);

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), true);
  });

  test("Should not allow 'aria-hidden' on a <button> element", async () => {
    const content = '<button></button>';

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });

  test("Should allow 'aria-hidden' on a <button> element with 'disabled' attribute", async () => {
    const content = `<button disabled="true"></button>`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), true);
  });

  test("Should not allow 'aria-hidden' on a plain <input> element", async () => {
    const content = `<input />`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });

  test("Should allow 'aria-hidden' on an <input> element with tabindex='-1'", async () => {
    const content = `<input tabindex="-1" />`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), true);
  });

  test("Should not allow 'aria-hidden' on an <a> element with href attribute", async () => {
    const content = `<a href="/blog"></a>`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });

  test("Should not allow 'aria-hidden' on an element with contenteditable='true'", async () => {
    const content = `<blockquote contenteditable="true"></blockquote>`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });

  test("Should not allow 'aria-hidden' on an element with a positive tabindex", async () => {
    const content = div(null, 'tabindex="2"');

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });

  test("Should not allow 'aria-hidden' on an element with role='button'", async () => {
    const content = div(null, 'role="button"');

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });

  test("Should allow 'aria-hidden' on a <select> element with tabindex='-1'", async () => {
    const content = `<select tabindex="-1"></select>`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), true);
  });

  test("Should allow 'aria-hidden' on a <textarea> element with 'disabled' attribute", async () => {
    const content = `<textarea disabled="true"></textarea>`;

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), true);
  });

  test("Should not allow 'aria-hidden' if a nested element is focusable", async () => {
    const content = div(div(div(div(div(div(null, 'role="button"'))))));

    assert.strictEqual(ElementList.canHaveAriaHidden(getNode(content)), false);
  });
});
