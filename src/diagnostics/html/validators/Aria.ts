import { Element } from 'domhandler';
import { messages } from '../../utils/messages';
import { HTMLElement } from '../Element';
import { Validator, ValidatorError } from './Validator';

export class AriaValidator implements Validator {
  readonly #nodeTags = [
    'div',
    'ul',
    'li',
    'span',
    'svg',
    'img',
    'i',
    'button',
    'input',
    'section',
    'article',
    'aside',
    'nav',
    'header',
    'footer',
    'a',
    'p',
    'iframe',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'label',
  ] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    domNodes.forEach((node) => {
      if (
        'aria-hidden' in node.attribs &&
        !HTMLElement.canHaveAriaHidden(node)
      ) {
        errors.push(new ValidatorError(messages.aria.hidden, node));
      }
    });
    return errors;
  }
}
