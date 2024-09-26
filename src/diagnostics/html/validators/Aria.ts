import { Element } from 'domhandler';
import { ARIA_HIDDEN, ARIA_TAGS } from '../../utils/constants';
import { messages } from '../../utils/messages';
import { HTMLElement } from '../Element';
import { Validator, ValidatorError } from './Validator';

export class AriaValidator implements Validator {
  readonly #nodeTags = ARIA_TAGS;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    domNodes.forEach((node) => {
      if (ARIA_HIDDEN in node.attribs && !HTMLElement.canHaveAriaHidden(node)) {
        errors.push(new ValidatorError(messages.aria.hidden, node));
      }
    });
    return errors;
  }
}
