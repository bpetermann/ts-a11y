import {
  JSXOpeningElement,
  JSXIdentifier,
  JSXSpreadAttribute,
  JSXAttribute,
} from '@babel/types';
import { messages } from '../messages';
import { Diagnostic } from '../diagnostic';
import { Validator } from './validator';

export class ButtonValidator implements Validator {
  #tags: string[] = ['button'] as const;

  get tags() {
    return this.#tags;
  }

  validate(node: JSXOpeningElement): Diagnostic[] {
    const { loc, attributes } = node;

    if (!this.hasAttribute('aria-label', attributes)) {
      return [new Diagnostic(messages.button['aria-label'], loc)];
    }

    return [];
  }

  private hasAttribute(
    attribute: string | JSXIdentifier,
    attributes: (JSXAttribute | JSXSpreadAttribute)[]
  ): boolean {
    return attributes.some(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === attribute
    );
  }
}
