import { Element } from 'domhandler';
import { Validator, ValidatorError } from './Validator';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { HTMLElement } from '../Element';

export class InputValidator implements Validator {
  readonly #nodeTags = ['input'] as const;

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
    const isSiblingLabel = sibling?.['name'] === 'label';

    if (
      !this.isParentLabel(input) &&
      !(isSiblingLabel && 'id' in attributes) &&
      !('aria-labelledby' in attributes)
    ) {
      return new ValidatorError(messages.input.label, input);
    }
  }

  private isParentLabel(input: Element) {
    return (
      input.parent && 'name' in input.parent && input.parent['name'] === 'label'
    );
  }
}
