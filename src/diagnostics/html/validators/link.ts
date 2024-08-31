import { Element } from 'domhandler';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';
import { DiagnosticSeverity } from 'vscode';
import ElementList from '../elements';

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

  private readonly faultyAttributes: Record<
    'onclick' | 'tabindex' | 'aria-hidden',
    string | null | boolean
  > = {
    onclick: null,
    tabindex: '-1',
    'aria-hidden': 'true',
  } as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: Element[]): ValidatorError[] {
    const elementList = new ElementList(domNodes);
    const { elements: links } = elementList;

    if (!links.length) {
      return [];
    }

    return this.runChecks(links, elementList);
  }

  private runChecks(
    links: Element[],
    elementList: ElementList
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    links.forEach((link) => {
      const attributes = elementList.getElementAttributes(link);
      const textContent = elementList.getElementData(link);

      errors.push(this.checkgenericText(link, textContent));
      errors.push(this.checkMailToLinks(link, attributes, textContent));
      errors.push(...this.checkWrongAttributes(link, attributes));
    });

    errors.push(this.getAriaCurrentError(links));
    errors.push(
      this.checkSequenceLength(elementList.getLongestSequence(links, 'sibling'))
    );

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkgenericText(
    link: Element,
    textContent: string | undefined
  ): ValidatorError | undefined {
    if (this.isGeneric(textContent)) {
      return new ValidatorError(`${messages.link.avoid}"${textContent}"`, link);
    }
  }

  private checkWrongAttributes(
    link: Element,
    attributes: { [name: string]: string }
  ): ValidatorError[] {
    return Object.entries(this.faultyAttributes)
      .map(([attrib, value]) => {
        if (this.isFaulty(attributes, attrib, value)) {
          return new ValidatorError(
            messages.link[attrib as 'onclick' | 'tabindex' | 'aria-hidden'],
            link
          );
        }
      })
      .filter((value) => value instanceof ValidatorError);
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

  private isFaulty(
    attributes: { [name: string]: string },
    attrib: string,
    value: string | null | boolean
  ): boolean {
    return attrib in attributes && (!value || attributes[attrib] === value);
  }
}
