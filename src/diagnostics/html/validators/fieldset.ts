import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './validator';

export class FieldsetValidator implements Validator {
  readonly #nodeTags = ['fieldset'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const { nodes: fieldsets } = new NodeList(domNodes);

    fieldsets.forEach((fieldset) => {
      if (!this.isChildLegend(fieldset)) {
        errors.push(new ValidatorError(messages.fieldset.legend, fieldset));
      }
    });

    return errors;
  }

  private isChildLegend(node: AnyNode): boolean {
    return (
      'children' in node &&
      node.children[0] &&
      'name' in node.children[0] &&
      node.children[0]['name'] === 'legend'
    );
  }
}
