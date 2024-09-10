import * as assert from 'assert';
import NodeOrganizer from '../../diagnostics/html/NodeOrganizer';
import { Element } from 'domhandler';

/** Instantiates and returns a NodeOrganize */
const getOrganizedNodes = (domNodes: Element[]) => {
  return new NodeOrganizer(domNodes);
};

suite('Node Organizer Test Suite', () => {
  test('Should return the correct number of divs', async () => {
    const elements = [];

    for (let index = 0; index < 100; index++) {
      const element = new Element('div', {}, []);
      elements.push(element);
    }

    const organizer = getOrganizedNodes(elements);
    const elementsFound = organizer.getNodes(['div']).length;

    assert.strictEqual(elementsFound, 100);
  });

  test('Should find a deeply nested element', async () => {
    const elements = [];

    for (let index = 0; index < 100; index++) {
      const element = new Element(index === 50 ? 'a' : 'div', {}, []);
      elements.push(element);
    }

    const organizer = getOrganizedNodes(elements);
    const elementsFound = organizer.getNodes(['a']).length;

    assert.strictEqual(elementsFound, 1);
  });

  test('Should return 0 when no such nodes exist', async () => {
    const organizer = getOrganizedNodes([]);
    const elementsFound = organizer.getNodes(['nav']).length;

    assert.strictEqual(elementsFound, 0);
  });

  test('Should return correct number of div and anchor tags', async () => {
    const elements = [];

    for (let index = 0; index < 100; index++) {
      const element = new Element(index % 2 === 0 ? 'div' : 'a', {}, []);
      elements.push(element);
    }
    const organizer = getOrganizedNodes(elements);
    const elementsFound = organizer.getNodes(['div', 'a']).length;

    assert.strictEqual(elementsFound, 100);
  });

  test('Should handle large DOM efficiently', async () => {
    const elements = [];

    for (let index = 0; index < 1000; index++) {
      const element = new Element('div', {}, []);
      elements.push(element);
    }
    const organizer = getOrganizedNodes(elements);
    const elementsFound = organizer.getNodes(['div']).length;

    assert.strictEqual(elementsFound, 1000);
  });

  test('Should handle epmty array gracefully', async () => {
    const organizer = getOrganizedNodes([]);

    const elementsFound = organizer.getNodes(['div']).length;

    assert.strictEqual(elementsFound, 0);
  });
});
