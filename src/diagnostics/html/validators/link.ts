import { AnyNode, Element } from 'domhandler';
import { messages } from '../messages';
import { Validator, ValidatorError } from './validator';
import { DiagnosticSeverity } from 'vscode';
import ElementList from '../elements';

export class LinkValidator implements Validator {
  #nodeTags: string[] = ['a'];
  private maxSequenceLength = 10;

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
    const {
      elements: links,
      getElementAttributes,
      getElementData,
    } = new ElementList(domNodes, 'a');

    if (!links.length) {
      return [];
    }

    return this.runChecks(links, getElementAttributes, getElementData);
  }

  private runChecks(
    links: Element[],
    getElementAttributes: (element: Element) => { [name: string]: string },
    getElementData: (element: Element) => string | undefined
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    links.forEach((link) => {
      const attributes = getElementAttributes(link);
      const textContent = getElementData(link);

      errors.push(this.checkgenericText(link, textContent));
      errors.push(this.checkMailLink(link, attributes, textContent));
      errors.push(...this.checkWrongAttributes(link, attributes));
    });

    errors.push(this.getAriaCurrentError(links));

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

  private checkMailLink(
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

  private checkSequenceLength(links: Element[]): ValidatorError | undefined {
    let longestSequence: number = 0;

    for (let index = 0; index < links.length; index++) {
      let element = links[index];
      const startIndex = index;

      while (this.nextNodeIsLink(element)) {
        index++;
        element = element.next as Element;
      }

      longestSequence = Math.max(index - startIndex + 1, longestSequence);
    }

    if (longestSequence > this.maxSequenceLength) {
      return new ValidatorError(
        messages.link.list,
        links[0],
        DiagnosticSeverity.Hint
      );
    }
  }

  private nextNodeIsLink({ next }: Element): boolean {
    return !!next && 'name' in next && next.name === 'a';
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
