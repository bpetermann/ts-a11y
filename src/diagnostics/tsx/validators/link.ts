import { messages } from '../messages';
import { Diagnostic } from '../diagnostic';
import { Validator } from './validator';
import { TSXElement } from '../element';

const genericTexts = [
  'click me',
  'download',
  'here',
  'read more',
  'learn more',
  'click',
  'more',
];

export class LinkValidator implements Validator {
  #tags: string[] = ['a'] as const;

  get tags() {
    return this.#tags;
  }

  validate(node: TSXElement): Diagnostic[] {
    return [
      this.checkGenericText(node),
      this.checkWrongAttributes(node),
    ].filter((error) => error instanceof Diagnostic);
  }

  checkGenericText(link: TSXElement): Diagnostic | undefined {
    if (genericTexts.includes(link.text.trim().toLowerCase())) {
      return new Diagnostic(messages.link.generic + link.text, link.loc);
    }
  }

  checkWrongAttributes(link: TSXElement): Diagnostic | undefined {
    if (link.getAttributes().includes('onclick')) {
      return new Diagnostic(messages.link.onclick, link.loc);
    }
  }
}
