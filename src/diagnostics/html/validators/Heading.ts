import { Element } from 'domhandler';
import { H1, H2, H3, H4, H5, H6 } from '../../utils/constants';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class HeadingValidator implements Validator {
  readonly #nodeTags = [H1, H2, H3, H4, H5, H6];

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const cache = new Set<string>();

    const { findElementByTag } = ElementList;

    this.nodeTags.slice(1).forEach((tag, i) => {
      const heading = findElementByTag(domNodes, tag);

      if (heading) {
        const prevTag = this.nodeTags[i];
        cache.add(tag);

        const prevHeadingExists =
          cache.has(prevTag) || findElementByTag(domNodes, prevTag);

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
