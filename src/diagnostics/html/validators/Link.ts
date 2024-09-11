import { Element, Text } from 'domhandler';
import { DiagnosticSeverity } from 'vscode';
import { messages } from '../../utils/messages';
import ElementList from '../ElementList';
import { Validator, ValidatorError } from './Validator';

export class LinkValidator implements Validator {
  #nodeTags: string[] = ['a'];
  private maxSequenceLength = 5;

  private readonly genericTexts = new Set([
    'click me',
    'download',
    'here',
    'read more',
    'learn more',
    'click',
    'more',
  ]);

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const { elements: links } = new ElementList(domNodes);

    if (!links.length) {
      return [];
    }

    return this.runChecks(links);
  }

  private runChecks(links: Element[]): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    links.forEach((link) => {
      const attributes = link.attribs;
      const textContent =
        link.children[0] instanceof Text ? link.children[0].data : undefined;

      errors.push(this.checkgenericText(link, textContent));
      errors.push(this.checkMailToLinks(link, attributes, textContent));
      errors.push(this.checkWrongAttributes(link, attributes));
    });

    errors.push(this.getAriaCurrentError(links));
    errors.push(
      this.checkSequenceLength(ElementList.getLongestSequence(links, 'sibling'))
    );

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkgenericText(
    link: Element,
    textContent: string | undefined
  ): ValidatorError | undefined {
    if (this.isGeneric(textContent)) {
      return new ValidatorError(
        `${messages.link.generic}"${textContent}"`,
        link
      );
    }
  }

  private checkWrongAttributes(
    link: Element,
    attributes: { [name: string]: string }
  ): ValidatorError | undefined {
    if ('onclick' in attributes) {
      return new ValidatorError(messages.link['onclick'], link);
    }
  }

  private checkMailToLinks(
    link: Element,
    attributes: { [name: string]: string },
    textContent: string | undefined
  ): ValidatorError | undefined {
    if (
      'href' in attributes &&
      attributes['href'].startsWith('mailto:') &&
      !textContent?.includes('@')
    ) {
      return new ValidatorError(messages.link.mail, link);
    }
  }

  private getAriaCurrentError(links: Element[]): ValidatorError | undefined {
    if (
      links.length > 1 &&
      !links.find(
        (link) => 'attribs' in link && 'aria-current' in link['attribs']
      )
    ) {
      return new ValidatorError(
        messages.link.current,
        links[0],
        DiagnosticSeverity.Hint
      );
    }
  }

  checkSequenceLength(sequence: Element[]) {
    if (sequence.length > this.maxSequenceLength) {
      return new ValidatorError(
        messages.link.list,
        sequence[0],
        DiagnosticSeverity.Hint
      );
    }
  }

  private isGeneric(text?: string): boolean {
    return !!text && this.genericTexts.has(text.toLowerCase().trim());
  }
}
