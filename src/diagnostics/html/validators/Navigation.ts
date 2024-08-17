import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './Validator';

export class NavigationValidator implements Validator {
  readonly #nodeTags = ['nav'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const nodeList = new NodeList(domNodes, 'nav');
    const { nodes: navElements } = nodeList;

    if (navElements.length > 1) {
      navElements.forEach((nav) => {
        const navAttributes = nodeList.getNodeAttributes(nav);
        const hasAriaAttribute =
          navAttributes &&
          ('aria-labelledby' in navAttributes || 'aria-label' in navAttributes);

        if (!hasAriaAttribute) {
          errors.push(new ValidatorError(messages.nav.label, nav));
        }
      });
    }

    return errors;
  }
}
