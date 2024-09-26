import { Element } from 'domhandler';
import { ARIA_LABEL, ARIA_LABELLEDBY, SECTION } from '../../utils/constants';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class SectionValidator implements Validator {
  readonly #nodeTags = [SECTION];

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const el = new ElementList(domNodes);
    const { elements: sections } = el;

    if (sections.length > 1) {
      sections.forEach((nav) => {
        const navAttributes = nav.attribs;
        const hasAriaAttribute =
          navAttributes &&
          (ARIA_LABELLEDBY in navAttributes || ARIA_LABEL in navAttributes);

        if (!hasAriaAttribute) {
          errors.push(new ValidatorError(messages.section.label, nav));
        }
      });
    }

    return errors;
  }
}
