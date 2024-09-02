import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import assert from 'assert';
import { TSXElement } from '../../diagnostics/tsx/element';
import { Div, fraction } from '../helper';

const parseText = (text: string) => {
  return parser.parse(text, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
};

suite('Aria-hidden Attribute Test Suite', () => {
  test("Should allow 'aria-hidden' on a plain <div> element", async () => {
    const content = Div(null);

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), true),
    });
  });

  test("Should not allow 'aria-hidden' on a <button> element", async () => {
    const content = '<button></button>';

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false),
    });
  });

  test("Should allow 'aria-hidden' on a <button> element with 'disabled' attribute", async () => {
    const content = `<button disabled="true"></button>`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), true),
    });
  });

  test("Should not allow 'aria-hidden' on a plain <input> element", async () => {
    const content = `<input />`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false),
    });
  });

  test("Should allow 'aria-hidden' on an <input> element with tabindex='-1'", async () => {
    const content = `<input tabindex="-1" />`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), true),
    });
  });

  test("Should not allow 'aria-hidden' on an <a> element with href attribute", async () => {
    const content = `<a href="/blog"></a>`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false),
    });
  });

  test("Should not allow 'aria-hidden' on an element with contenteditable='true'", async () => {
    const content = `<blockquote contenteditable="true"></blockquote>`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false),
    });
  });

  test("Should not allow 'aria-hidden' on an element with a positive tabindex", async () => {
    const content = Div(null, 'tabindex="2"');

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false),
    });
  });

  test("Should not allow 'aria-hidden' on an element with role='button'", async () => {
    const content = Div(null, 'role="button"');

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false),
    });
  });

  test("Should allow 'aria-hidden' on a <select> element with tabindex='-1'", async () => {
    const content = `<select tabindex="-1"></select>`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), true),
    });
  });

  test("Should allow 'aria-hidden' on a <textarea> element with 'disabled' attribute", async () => {
    const content = `<textarea disabled="true"></textarea>`;

    traverse(parseText(content), {
      JSXElement: (path) =>
        assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), true),
    });
  });

  test("Should not allow 'aria-hidden' if a nested element is focusable", async () => {
    const content = Div(
      Div(Div(Div(fraction(Div(null), Div(null, 'role="button"')))))
    );

    let firstElement = false;

    traverse(parseText(content), {
      JSXElement: (path) => {
        if (firstElement) {
          return;
        } else {
          firstElement = true;
          assert.strictEqual(TSXElement.canHaveAriaHidden(path.node), false);
        }
      },
    });
  });
});
