import { Element } from 'domhandler';
import ElementList from '../ElementList';
import { messages } from '../../utils/messages';
import { Validator, ValidatorError } from './Validator';

export class ImageValidator implements Validator {
  readonly #nodeTags = ['img'] as const;
  readonly maxSameAltText = 3;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const { elements: images } = new ElementList(domNodes);

    if (!images.length) {
      return [];
    }

    return this.runChecks(images);
  }

  private runChecks(images: Element[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const altTexts: Record<string, number> = {};

    images.forEach((img) => {
      const altText = img.attribs?.['alt'];
      if (altText === undefined) {
        errors.push(new ValidatorError(messages.img.alt, img));
      } else {
        altTexts[altText] = (altTexts[altText] || 0) + 1;
      }
    });

    errors.push(...this.checkAltUniqueness(images, altTexts));

    return errors;
  }

  private checkAltUniqueness(
    images: Element[],
    altTexts: Record<string, number>
  ): ValidatorError[] {
    return Object.keys(altTexts)
      .filter((alt) => altTexts[alt] > this.maxSameAltText)
      .map((alt) => {
        const image = images.find((img) => img.attribs?.['alt'] === alt);
        return image
          ? new ValidatorError(messages.img.repeated, image)
          : undefined;
      })
      .filter((error) => error instanceof ValidatorError);
  }
}