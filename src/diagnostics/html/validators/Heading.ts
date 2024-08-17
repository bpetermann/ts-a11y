import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './Validator';

export class HeadingValidator implements Validator {
  readonly #nodeTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const cache = new Set<string>();

    const { findNodeByTag } = NodeList;

    this.nodeTags.slice(1).forEach((tag, i) => {
      const heading = findNodeByTag(domNodes, tag);

      if (heading) {
        const prevTag = this.nodeTags[i];
        cache.add(tag);

        const prevHeadingExists =
          cache.has(prevTag) || findNodeByTag(domNodes, prevTag);

        if (!prevHeadingExists) {
          errors.push(
            new ValidatorError(messages.heading.shouldExist, heading)
          );
        }
      }
    });

    return errors;
  }
}
