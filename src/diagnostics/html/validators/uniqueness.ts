import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';
import ElementList from '../elements';

export class UniquenessValidator implements Validator {
  readonly #nodeTags = ['html', 'h1', 'main', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    this.nodeTags.forEach((tag) => {
      const { elements } = new ElementList(domNodes, tag);
      if (elements.length > 1) {
        errors.push(
          new ValidatorError(messages[tag].shouldBeUnique, elements[0])
        );
      }
    });
    return errors;
  }
}
