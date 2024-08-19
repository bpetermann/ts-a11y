import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './validator';
import { DiagnosticSeverity } from 'vscode';

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
    'onclick' | 'tabindex',
    string | null
  > = {
    onclick: null,
    tabindex: '-1',
  } as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const {
      nodes: links,
      getNodeAttributes,
      getNodeData,
    } = new NodeList(domNodes, 'a');

    if (!links.length) {
      return [];
    }

    return this.runChecks(links, getNodeAttributes, getNodeData);
  }

  private runChecks(
    links: AnyNode[],
    getNodeAttributes: (node: AnyNode) => { [name: string]: string } | {},
    getNodeData: (node: AnyNode) => string | undefined
  ): ValidatorError[] {
    const errors: (ValidatorError | undefined)[] = [];

    links.forEach((link) => {
      const attributes = getNodeAttributes(link);
      const textContent = getNodeData(link);

      errors.push(this.checkgenericText(link, textContent));
      errors.push(this.checkMailLink(link, attributes, textContent));
      errors.push(...this.checkWrongAttributes(link, attributes));
    });

    errors.push(this.getAriaCurrentError(links));

    return errors.filter((error) => error instanceof ValidatorError);
  }

  private checkgenericText(
    link: AnyNode,
    textContent: string | undefined
  ): ValidatorError | undefined {
    if (this.isGeneric(textContent)) {
      return new ValidatorError(`${messages.link.avoid}"${textContent}"`, link);
    }
  }

  private checkWrongAttributes(
    link: AnyNode,
    attributes: { [name: string]: string }
  ): ValidatorError[] {
    return Object.entries(this.faultyAttributes)
      .map(([attrib, value]) => {
        if (this.isFaulty(attributes, attrib, value)) {
          return new ValidatorError(
            messages.link[attrib as 'onclick' | 'tabindex'],
            link
          );
        }
      })
      .filter((value) => value instanceof ValidatorError);
  }

  private checkMailLink(
    link: AnyNode,
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

  private getAriaCurrentError(links: AnyNode[]): ValidatorError | undefined {
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

  private checkSequenceLength(links: AnyNode[]): ValidatorError | undefined {
    let longestSequence: number = 0;

    for (let index = 0; index < links.length; index++) {
      let node = links[index];
      const startIndex = index;

      while (this.nextNodeIsLink(node)) {
        index++;
        node = node.next as AnyNode;
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

  private nextNodeIsLink(node: AnyNode): boolean {
    return node && !!node.next && 'name' in node.next && node.next.name === 'a';
  }

  private isGeneric(text?: string): boolean {
    return !!text && this.genericTexts.has(text.toLowerCase().trim());
  }

  private isFaulty(
    attributes: { [name: string]: string },
    attrib: string,
    value: string | null
  ): boolean {
    return attrib in attributes && (!value || attributes[attrib] === value);
  }
}
