import * as assert from 'assert';
import { messages } from '../../diagnostics/utils/messages';
import {
  HeadingValidator,
  LinkValidator,
  UniquenessValidator,
} from '../../diagnostics/html/validators';
import { Element, Text } from 'domhandler';

suite('Validator Test Suite', () => {
  test('Two occurrences of <h1> tag', async () => {
    const { message } = new UniquenessValidator().validate([
      new Element('h1', {}),
      new Element('h1', {}),
    ])?.[0];

    assert.strictEqual(message, messages.h1.shouldBeUnique);
  });

  test('<h4> tag present without preceding <h3> tag', async () => {
    const h4 = new Element('h4', {});

    const { message } = new HeadingValidator().validate([h4])?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('<h4> and <h3> tags present without preceding <h2> tag', async () => {
    const h4 = new Element('h4', {});
    const h3 = new Element('h3', {});

    const { message } = new HeadingValidator().validate([h4, h3])?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('<h4>, <h3>, and <h2> tags present with missing <h2> tag', async () => {
    const h4 = new Element('h4', {});
    const h3 = new Element('h3', {});
    const h2 = new Element('h2', {});

    const { message } = new HeadingValidator().validate([h4, h3, h2])?.[0];

    assert.strictEqual(message, messages.heading.shouldExist);
  });

  test('<h2> tag present with existing <h1> tag', async () => {
    const h2 = new Element('h2', {});
    const h1 = new Element('h1', {});

    const errors = new HeadingValidator().validate([h2, h1]);

    assert.strictEqual(errors.length, 0);
  });

  test('<a> tag with a generic description', async () => {
    const linktext = 'Click';
    const a = new Element('a', { href: '/blog' }, [new Text(linktext)]);

    const { message } = new LinkValidator().validate([a])?.[0];

    assert.strictEqual(message, `${messages.link.generic}"${linktext}"`);
  });

  test('<a> tag with a good description', async () => {
    const linktext = 'Learn how to create meaningful content';
    const a = new Element('a', { href: '/blog' }, [new Text(linktext)]);

    const errors = new LinkValidator().validate([a]);

    assert.strictEqual(errors.length, 0);
  });

  test('<a> tag with an "onclick" event', async () => {
    const a = new Element('a', { onclick: 'click()' });

    const { message } = new LinkValidator().validate([a])?.[0];

    assert.strictEqual(message, messages.link.onclick);
  });

  test('<a> tag with aria-hidden="true"', async () => {
    const a = new Element('a', { href: '/blog', 'aria-hidden': 'true' });

    const { message } = new LinkValidator().validate([a])?.[0];

    assert.strictEqual(message, messages.link['aria-hidden']);
  });

  test('<a> tag with "mailto" in the "href"', async () => {
    const linktext = 'If you want to learn more about our products, contact us';
    const a = new Element('a', { href: 'mailto:support@office.com' }, [
      new Text(linktext),
    ]);

    const { message } = new LinkValidator().validate([a])?.[0];

    assert.strictEqual(message, messages.link.mail);
  });

  test('<a> tag with all checks failing', async () => {
    const linktext = 'click';
    const a = new Element(
      'a',
      {
        onclick: 'click()',
        'aria-hidden': 'true',
        href: 'mailto:support@office.com',
      },
      [new Text(linktext)]
    );

    const errors = new LinkValidator().validate([a]);

    assert.strictEqual(errors.length, 4);
  });

  test('<a> tag missing the aria-current attribute', async () => {
    const anchors = ['home', 'products', 'contact'].map(
      (a) =>
        new Element('a', {
          href: a,
        })
    );

    const { message } = new LinkValidator().validate(anchors)?.[0];

    assert.strictEqual(message, messages.link.current);
  });

  test('<a> tag in a long consecutive list', async () => {
    const anchors = new Array(6)
      .fill(null)
      .map(
        (_, i) =>
          new Element('a', i === 0 ? { 'aria-current': 'page' } : {}, [
            new Text(`link number ${i}`),
          ])
      )
      .map((element, i, self) => {
        if (i < self.length - 1) {
          element.nextSibling = self[i + 1];
        }
        return element;
      });

    const { message } = new LinkValidator().validate(anchors)?.[0];

    assert.strictEqual(message, messages.link.list);
  });
});
