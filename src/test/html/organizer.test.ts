import * as assert from 'assert';
import {
  body,
  div,
  getDocument,
  getOrganizedNodes,
  head,
  html,
  meta,
  title,
} from '../helper';

suite('Node Organizer Test Suite', () => {
  test('Should return the correct number of divs', async () => {
    const divs = Array(100)
      .fill(null)
      .map((_) => div(null))
      .toString();

    const content = html(head(meta + title) + body(divs));
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const divsFound = organizer.getNodes(['div']).length;

    assert.strictEqual(divsFound, 100);
  });

  test('Should find a deeply nested element', async () => {
    let nestedAnchorTag = '<a></a>';

    for (let index = 0; index <= 100; index++) {
      nestedAnchorTag = div(nestedAnchorTag);
    }

    const content = html(head(meta + title) + body(nestedAnchorTag));
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const anchorFound = organizer.getNodes(['a']).length;

    assert.strictEqual(anchorFound, 1);
  });

  test('Should return 0 when no such nodes exist', async () => {
    const content = html(head(meta + title) + body('<p></p>'));
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const nonExistentNodes = organizer.getNodes(['nav']).length;

    assert.strictEqual(nonExistentNodes, 0);
  });

  test('Should return correct number of div and anchor tags', async () => {
    const content = html(
      head(meta + title) + body('<div></div><a></a><div></div>')
    );
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const divsAndAnchorsFound = organizer.getNodes(['div', 'a']).length;

    assert.strictEqual(divsAndAnchorsFound, 3);
  });

  test('Should correctly handle case insensitivity of HTML tags', async () => {
    const content = html(head(meta + title) + body('<DIV></DIV><a></a>'));
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const divsAndAnchorsFound = organizer.getNodes(['div', 'a']).length;

    assert.strictEqual(divsAndAnchorsFound, 2);
  });

  test('Should handle large DOM efficiently', async () => {
    const largeContent = Array(10000).fill('<div></div>').join('');
    const content = html(head(meta + title) + body(largeContent));
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const divsFound = organizer.getNodes(['div']).length;

    assert.strictEqual(divsFound, 10000);
  });

  test('Should handle an empty document gracefully', async () => {
    const content = html(head(meta + title) + body(''));
    const document = await getDocument(content);
    const organizer = getOrganizedNodes(document);

    const divsFound = organizer.getNodes(['div']).length;

    assert.strictEqual(divsFound, 0);
  });
});
