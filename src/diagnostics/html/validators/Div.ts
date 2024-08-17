import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { DiagnosticSeverity } from 'vscode';
import { Validator, ValidatorError } from './Validator';

export class DivValidator implements Validator {
  readonly #nodeTags = ['div'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }
  validate(nodes: AnyNode[]): ValidatorError[] {
    const { nodes: divs, getNodeAttributes } = new NodeList(nodes, 'div');

    if (!divs.length) {
      return [];
    }

    return this.getErrors(divs, getNodeAttributes);
  }

  private getErrors(
    divs: AnyNode[],
    getNodeAttributes: (node: AnyNode) => { [name: string]: string } | {}
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    divs.forEach((div) => {
      const attributes = getNodeAttributes(div);

      if (Object.keys(attributes).length) {
        errors.push(this.getButtonError(div, attributes));
        errors.push(this.getWrongAttributesError(div, attributes));
      }
    });

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private getButtonError(
    div: AnyNode,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if (
      'onclick' in attributes ||
      ('role' in attributes && attributes['role'] === 'button')
    ) {
      return new ValidatorError(
        messages.div.button,
        div,
        DiagnosticSeverity.Hint
      );
    }
  }

  private getWrongAttributesError(
    div: AnyNode,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if ('aria-expanded' in attributes) {
      return new ValidatorError(
        messages.div.expanded,
        div,
        DiagnosticSeverity.Hint
      );
    }
  }
}
