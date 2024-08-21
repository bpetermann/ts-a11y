import { Element } from 'domhandler';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';
import ElementList from '../elements';

export class FieldsetValidator implements Validator {
  readonly #nodeTags = ['fieldset'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const elementsList = new ElementList(domNodes);
    const { elements: fieldsets } = elementsList;

    fieldsets.forEach((fieldset) => {
      const childNode = elementsList.getFirstChild(fieldset);

      if (!(childNode && childNode.name === 'legend')) {
        errors.push(new ValidatorError(messages.fieldset.legend, fieldset));
      }
    });

    return errors;
  }
}
