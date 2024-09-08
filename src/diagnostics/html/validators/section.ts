import { Element } from 'domhandler';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';
import ElementList from '../elements';

export class SectionValidator implements Validator {
  readonly #nodeTags = ['section'] as const;

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
          ('aria-labelledby' in navAttributes || 'aria-label' in navAttributes);

        if (!hasAriaAttribute) {
          errors.push(new ValidatorError(messages.section.label, nav));
        }
      });
    }

    return errors;
  }
}
