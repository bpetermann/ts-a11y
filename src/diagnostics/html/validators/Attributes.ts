import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './Validator';

export class AttributesValidator implements Validator {
  readonly #nodeTags = ['html', 'meta'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  readonly attributes = {
    html: ['lang'],
    meta: ['name'],
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    this.nodeTags.forEach((tag) => {
      const nodeList = new NodeList(domNodes, tag);
      const { nodes: elements } = nodeList;

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[tag].every((attr) =>
          nodeList.anyNodeHasAttribute(attr)
        );

        if (!anyNodeHasAttribs) {
          errors.push(
            new ValidatorError(messages[tag].hasMissingAttribute, elements[0])
          );
        }
      }
    });

    return errors;
  }
}
