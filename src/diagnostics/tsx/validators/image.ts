import { messages } from '../messages';
import { Diagnostic } from '../diagnostic';
import { Validator } from './validator';
import { TSXElement } from '../element';

export class ImageValidator implements Validator {
  #tags: string[] = ['img'] as const;

  get tags() {
    return this.#tags;
  }

  validate(node: TSXElement): Diagnostic[] {
    if (!node.hasAttribute('alt')) {
      return [new Diagnostic(messages.img.alt, node.loc)];
    }

    return [];
  }
}
