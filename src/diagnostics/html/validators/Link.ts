import { AnyNode } from 'domhandler';
import { messages } from '../messages';
import NodeList from '../nodelist';
import { Validator, ValidatorError } from './Validator';

export class LinkValidator implements Validator {
  #nodeTags: string[] = ['a'];

  get nodeTags() {
    return this.#nodeTags;
  }

  private nodeList: NodeList | null = null;

  readonly warnings: {
    [tag: string]: string;
  } = {
    onclick: messages.link.onclick,
    tabindex: messages.link.tabindex,
  };

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

  validate(domNodes: AnyNode[]): ValidatorError[] {
    this.nodeList = new NodeList(domNodes, 'a');
    const { nodes: links } = this.nodeList;

    if (!links.length) {
      return [];
    }

    return [
      ...this.checkGenericTexts(links),
      ...this.checkFaultyAttributes(links),
      ...this.checkEmailLinks(links),
    ];
  }

  private checkGenericTexts(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      const linkText = this.nodeList?.getNodeData(link);
      if (this.isGeneric(linkText)) {
        errors.push(
          new ValidatorError(`${messages.link.avoid}"${linkText}"`, link)
        );
      }
    });

    return errors;
  }

  private checkFaultyAttributes(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      const attributes = this.nodeList?.getNodeAttributes(link);
      if (attributes) {
        Object.entries(this.faultyAttributes).forEach(([attrib, value]) => {
          if (
            this.isFaulty(attributes, attrib as 'onclick' | 'tabindex', value)
          ) {
            errors.push(
              new ValidatorError(
                messages.link[attrib as 'onclick' | 'tabindex'],
                link
              )
            );
          }
        });
      }
    });

    return errors;
  }

  private checkEmailLinks(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      if (
        this.nodeList?.getNodeAttribute(link, 'href')?.startsWith('mailto:')
      ) {
        const linkText = this.nodeList?.getNodeData(link);
        if (linkText && !linkText.includes('@')) {
          errors.push(new ValidatorError(messages.link.mail, link));
        }
      }
    });

    return errors;
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
