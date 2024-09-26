import { Element } from 'domhandler';
import { ARIA_LABELLEDBY, ID, INPUT, LABEL, NAME } from '../../utils/constants';
import { messages } from '../../utils/messages';
import { HTMLElement } from '../Element';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class InputValidator implements Validator {
  readonly #nodeTags = [INPUT];

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const el = new ElementList(domNodes);
    const { elements: inputs } = el;

    if (!inputs.length) {
      return [];
    }

    return this.runChecks(inputs, el);
  }

  private runChecks(inputs: Element[], el: ElementList): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    inputs.forEach((input) => {
      const attributes = input.attribs;
      const sibling = HTMLElement.getPrevSibling(input);
      errors.push(this.checkLabel(input, attributes, sibling));
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  checkLabel(
    input: Element,
    attributes: {} | { [name: string]: string },
    sibling?: Element
  ): ValidatorError | undefined {
    const isSiblingLabel = sibling?.[NAME] === LABEL;

    if (
      !this.isParentLabel(input) &&
      !(isSiblingLabel && ID in attributes) &&
      !(ARIA_LABELLEDBY in attributes)
    ) {
      return new ValidatorError(messages.input.label, input);
    }
  }

  private isParentLabel(input: Element) {
    return input.parent && NAME in input.parent && input.parent[NAME] === LABEL;
  }
}
