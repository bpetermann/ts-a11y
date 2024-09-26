import { Element } from 'domhandler';
import { H1, HTML, MAIN, TITLE } from '../../utils/constants';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class UniquenessValidator implements Validator {
  readonly #nodeTags = [HTML, H1, MAIN, TITLE];

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
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
