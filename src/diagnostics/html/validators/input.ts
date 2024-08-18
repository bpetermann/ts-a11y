import { AnyNode } from 'domhandler';
import { Validator, ValidatorError } from './validator';
import NodeList from '../nodelist';
import { messages } from '../messages';

export class InputValidator implements Validator {
  readonly #nodeTags = ['input'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(nodes: AnyNode[]): ValidatorError[] {
    const { nodes: inputs, getNodeAttributes } = new NodeList(nodes);

    if (!inputs.length) {
      return [];
    }

    return this.getErrors(inputs, getNodeAttributes);
  }

  private getErrors(
    inputs: AnyNode[],
    getNodeAttributes: (node: AnyNode) => { [name: string]: string } | {}
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    inputs.forEach((input) => {
      const attributes = getNodeAttributes(input);
      errors.push(this.getLabelError(input, attributes));
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  getLabelError(
    input: AnyNode,
    attributes: {} | { [name: string]: string }
  ): ValidatorError | undefined {
    if (
      !this.hasLabelParent(input) &&
      !(this.hasLabelSibling(input) && 'id' in attributes) &&
      !('aria-labelledby' in attributes)
    ) {
      return new ValidatorError(messages.input.label, input);
    }
  }

  private hasLabelParent(input: AnyNode) {
    return (
      input.parent && 'name' in input.parent && input.parent['name'] === 'label'
    );
  }

  private hasLabelSibling(input: AnyNode) {
    return (
      (input.prev && 'name' in input.prev && input.prev['name'] === 'label') ||
      (input.next && 'name' in input.next && input.next['name'] === 'label')
    );
  }
}
