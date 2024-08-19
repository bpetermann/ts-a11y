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
    const nodeList = new NodeList(nodes);
    const { nodes: inputs } = new NodeList(nodes);

    if (!inputs.length) {
      return [];
    }

    return this.runChecks(inputs, nodeList);
  }

  private runChecks(inputs: AnyNode[], nodeList: NodeList): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    inputs.forEach((input) => {
      const attributes = nodeList.getNodeAttributes(input);
      const sibling = nodeList.getFirstSibling(input);
      errors.push(this.checkLabel(input, attributes, sibling));
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  checkLabel(
    input: AnyNode,
    attributes: {} | { [name: string]: string },
    sibling?: AnyNode
  ): ValidatorError | undefined {
    const isSiblingLabel =
      sibling && 'name' in sibling && sibling['name'] === 'label';

    if (
      !this.isParentLabel(input) &&
      !(isSiblingLabel && 'id' in attributes) &&
      !('aria-labelledby' in attributes)
    ) {
      return new ValidatorError(messages.input.label, input);
    }
  }

  private isParentLabel(input: AnyNode) {
    return (
      input.parent && 'name' in input.parent && input.parent['name'] === 'label'
    );
  }
}
