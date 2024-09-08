import { Element } from 'domhandler';
import { messages } from '../../utils/messages';
import { Validator, ValidatorError } from './Validator';
import ElementList from '../ElementList';

export class NavigationValidator implements Validator {
  readonly #nodeTags = ['nav'] as const;

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
          ('aria-labelledby' in navAttributes || 'aria-label' in navAttributes);

        if (!hasAriaAttribute) {
          errors.push(new ValidatorError(messages.nav.label, nav));
        }
      });
    }

    return errors;
  }
}
