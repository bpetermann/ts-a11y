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

    const nodeList = new NodeList(domNodes);
    const { nodes: fieldsets } = new NodeList(domNodes);

    fieldsets.forEach((fieldset) => {
      const childNode = nodeList.getFirstChildNode(fieldset);

      if (!(childNode && childNode.name === 'legend')) {
        errors.push(new ValidatorError(messages.fieldset.legend, fieldset));
      }
    });

    return errors;
  }
}
