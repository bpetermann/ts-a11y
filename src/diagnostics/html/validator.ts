import { AnyNode } from 'domhandler';
import { messages } from './messages';
import NodeList from './nodelist';
import { DiagnosticSeverity } from 'vscode';

export class ValidatorError {
  constructor(
    public message: string,
    public node?: AnyNode,
    public severity: DiagnosticSeverity = DiagnosticSeverity.Warning
  ) {}
}

export interface Validator {
  readonly nodeTags: readonly string[];
  validate(nodes: AnyNode[]): ValidatorError[];
}

export class HeadingValidator implements Validator {
  readonly #nodeTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const cache = new Set<string>();

    const { findNodeByTag } = NodeList;

    this.nodeTags.slice(1).forEach((tag, i) => {
      const heading = findNodeByTag(domNodes, tag);

      if (heading) {
        const prevTag = this.nodeTags[i];
        cache.add(tag);

        const prevHeadingExists =
          cache.has(prevTag) || findNodeByTag(domNodes, prevTag);

        if (!prevHeadingExists) {
          errors.push(
            new ValidatorError(messages.heading.shouldExist, heading)
          );
        }
      }
    });

    return errors;
  }
}

export class RequiredValidator implements Validator {
  readonly #nodeTags = ['meta', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const { findNodeByTag } = NodeList;

    this.nodeTags.forEach((tag) => {
      if (!findNodeByTag(domNodes, tag)) {
        errors.push(
          new ValidatorError(
            messages[tag].shouldExist,
            undefined,
            DiagnosticSeverity.Error
          )
        );
      }
    });

    return errors;
  }
}

export class UniquenessValidator implements Validator {
  readonly #nodeTags = ['html', 'h1', 'main', 'title'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    this.nodeTags.forEach((tag) => {
      const { nodes } = new NodeList(domNodes, tag);
      if (nodes.length > 1) {
        errors.push(new ValidatorError(messages[tag].shouldBeUnique, nodes[0]));
      }
    });
    return errors;
  }
}

export class NavigationValidator implements Validator {
  readonly #nodeTags = ['nav'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const nodeList = new NodeList(domNodes, 'nav');
    const { nodes: navElements } = nodeList;

    if (navElements.length > 1) {
      navElements.forEach((nav) => {
        const navAttributes = nodeList.getNodeAttributes(nav);
        const hasAriaAttribute =
          navAttributes &&
          ('aria-labelledby' in navAttributes || 'aria-label' in navAttributes);

        if (!hasAriaAttribute) {
          errors.push(new ValidatorError(messages.nav, nav));
        }
      });
    }

    return errors;
  }
}

export class AttributesValidator implements Validator {
  readonly #nodeTags = ['html', 'meta'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  readonly attributes = {
    html: ['lang'],
    meta: ['name'],
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    this.nodeTags.forEach((tag) => {
      const nodeList = new NodeList(domNodes, tag);
      const { nodes: elements } = nodeList;

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[tag].every((attr) =>
          nodeList.anyNodeHasAttribute(attr)
        );

        if (!anyNodeHasAttribs) {
          errors.push(
            new ValidatorError(messages[tag].hasMissingAttribute, elements[0])
          );
        }
      }
    });

    return errors;
  }
}

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

export class DivValidator implements Validator {
  readonly #nodeTags = ['div'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }
  validate(nodes: AnyNode[]): ValidatorError[] {
    const {
      nodes: divs,
      getNodeAttributes,
      getNodeAttribute,
    } = new NodeList(nodes, 'div');

    if (!divs.length) {
      return [];
    }

    return divs
      .filter((div) => {
        const hasOnClick = 'onclick' in (getNodeAttributes(div) || {});
        const hasButtonRole = getNodeAttribute(div, 'role') === 'button';

        return hasOnClick || hasButtonRole;
      })
      .map(
        (div) => new ValidatorError(messages.div, div, DiagnosticSeverity.Hint)
      );
  }
}

export class ButtonValidator implements Validator {
  readonly #nodeTags = ['button'] as const;

  get nodeTags() {
    return this.#nodeTags;
  }

  validate(nodes: AnyNode[]): ValidatorError[] {
    const {
      nodes: buttons,
      getNodeAttributes,
      getNodeAttribute,
    } = new NodeList(nodes, 'button');

    if (!buttons.length) {
      return [];
    }

    return buttons
      .filter((button) => {
        const hasSwitchRole = getNodeAttribute(button, 'role') === 'switch';
        const hasAriaChecked =
          'aria-checked' in (getNodeAttributes(button) || {});

        return hasSwitchRole && !hasAriaChecked;
      })
      .map(
        (button) =>
          new ValidatorError(
            messages.button.switchRole,
            button,
            DiagnosticSeverity.Warning
          )
      );
  }
}
