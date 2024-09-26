import { Element } from 'domhandler';
import { ARIA_LABEL, ARIA_LABELLEDBY, NAV } from '../../utils/constants';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class NavigationValidator implements Validator {
  readonly #nodeTags = [NAV];

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const el = new ElementList(domNodes);
    const { elements: navElements } = el;

    if (navElements.length > 1) {
      navElements.forEach((nav) => {
        const navAttributes = nav.attribs;
        const hasAriaAttribute =
          navAttributes &&
          (ARIA_LABELLEDBY in navAttributes || ARIA_LABEL in navAttributes);

        if (!hasAriaAttribute) {
          errors.push(new ValidatorError(messages.nav.label, nav));
        }
      });
    }

    return errors;
  }
}
