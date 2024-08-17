import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './Validator';

export class UniquenessValidator implements Validator {
  readonly #nodeTags = ['html', 'h1', 'main', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    this.nodeTags.forEach((tag) => {
      const { nodes } = new NodeList(domNodes, tag);
      if (nodes.length > 1) {
        errors.push(new ValidatorError(messages[tag].shouldBeUnique, nodes[0]));
      }
    });
    return errors;
  }
}
