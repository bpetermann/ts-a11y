import { Element } from 'domhandler';
import { messages } from '../../utils/messages';
import { Validator, ValidatorError } from './Validator';
import ElementList from '../ElementList';

export class AttributesValidator implements Validator {
  readonly #nodeTags = ['html', 'meta'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  readonly attributes = {
    html: ['lang'],
    meta: ['name'],
  };

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    this.nodeTags.forEach((tag) => {
      const elementList = new ElementList(domNodes, tag);
      const { elements } = elementList;

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[tag].every((attr) =>
          elementList.anyElementHasAttribute(attr)
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
