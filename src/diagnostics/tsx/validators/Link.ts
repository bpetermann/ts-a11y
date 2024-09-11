import { messages } from '../../utils/messages';
import { Diagnostic } from '../Diagnostic';
import { TSXElement } from '../Element';
import { Validator } from './Validator';

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
      this.checkMailToLinks(node),
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

  private checkMailToLinks(link: TSXElement): Diagnostic | undefined {
    const urlFragment = link.getAttribute('href');
    if (
      urlFragment &&
      urlFragment.startsWith('mailto:') &&
      !link.text?.includes('@')
    ) {
      return new Diagnostic(messages.link.mail, link.loc);
    }
  }
}
