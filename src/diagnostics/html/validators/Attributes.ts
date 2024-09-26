import { Element } from 'domhandler';
import { HTML, LANG, META, NAME } from '../../utils/constants';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class AttributesValidator implements Validator {
  readonly #nodeTags = [HTML, META];

  get nodeTags() {
    return this.#nodeTags;
  }

  readonly attributes = {
    html: [LANG],
    meta: [NAME],
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
