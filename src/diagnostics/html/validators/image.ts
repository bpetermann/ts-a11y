import { Element } from 'domhandler';
import ElementList from '../elements';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';

export class ImageValidator implements Validator {
  readonly #nodeTags = ['img'] as const;
  readonly maxSameAltText = 3;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const { elements: images, getElementAttribute } = new ElementList(domNodes);

    if (!images.length) {
      return [];
    }

    return this.runChecks(images, getElementAttribute);
  }

  private runChecks(
    images: Element[],
    getElementAttribute: (element: Element, attr: string) => string | undefined
  ): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const altTexts: Record<string, number> = {};

    images.forEach((img) => {
      const altText = getElementAttribute(img, 'alt');

      if (altText === undefined) {
        errors.push(new ValidatorError(messages.img.alt, img));
      } else {
        altTexts[altText] = (altTexts[altText] || 0) + 1;
      }
    });

    errors.push(
      ...this.checkAltUniqueness(images, altTexts, getElementAttribute)
    );

    return errors;
  }

  private checkAltUniqueness(
    images: Element[],
    altTexts: Record<string, number>,
    getElementAttribute: (element: Element, attr: string) => string | undefined
  ): ValidatorError[] {
    return Object.keys(altTexts)
      .filter((alt) => altTexts[alt] > this.maxSameAltText)
      .map((alt) => {
        const image = images.find(
          (img) => getElementAttribute(img, 'alt') === alt
        );
        return image
          ? new ValidatorError(messages.img.repeated, image)
          : undefined;
      })
      .filter((error) => error instanceof ValidatorError);
  }
}
