import { messages } from '../messages';
import { Diagnostic } from '../diagnostic';
import { Validator } from './validator';
import { TSXElement } from '../element';
import { error } from 'console';

export class ImageValidator implements Validator {
  #tags: string[] = ['img'] as const;
  genericTexts: string[] = ['.jpg', '.png', '.webp', 'image', 'picture', 'img'];

  get tags() {
    return this.#tags;
  }

  validate(node: TSXElement): Diagnostic[] {
    return [this.checkAltExists(node), this.checkAltText(node)].filter(
      (error) => error instanceof Diagnostic
    );
  }

  checkAltExists(node: TSXElement) {
    if (!node.hasAttribute('alt')) {
      return new Diagnostic(messages.img.alt, node.loc);
    }
  }

  checkAltText(node: TSXElement) {
    const altText = node.getAttribute('alt');
    const hasGenericAlt = altText
      ?.split(' ')
      .some((text) => this.genericTexts.includes(text));
    if (altText && hasGenericAlt) {
      return new Diagnostic(messages.img.generic + altText, node.loc);
    }
  }
}
