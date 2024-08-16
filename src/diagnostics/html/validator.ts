import { AnyNode } from 'domhandler';
import { warnings } from './warnings';
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
  validate(nodes: AnyNode[]): ValidatorError[];
}

export class HeadingValidator implements Validator {
  cache = new Set<string>();

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const { findNodeByTag } = NodeList;

    for (let i = 2; i <= 6; i++) {
      const tag = `h${i}`;
      const heading = findNodeByTag(domNodes, tag);

      if (heading) {
        const prevTag = `h${i - 1}`;
        this.cache.add(tag);

        const prevHeadingExists =
          this.cache.has(prevTag) || findNodeByTag(domNodes, prevTag);

        if (!prevHeadingExists) {
          errors.push(
            new ValidatorError(warnings.heading.shouldExist, heading)
          );
        }
      }
    }

    return errors;
  }
}

export class RequiredValidator implements Validator {
  readonly warnings: {
    [tag: string]: string;
  } = {
    meta: warnings.meta.shouldExist,
    title: warnings.title.shouldExist,
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];
    const { findNodeByTag } = NodeList;

    Object.keys(this.warnings).forEach((tag) => {
      if (!findNodeByTag(domNodes, tag)) {
        errors.push(
          new ValidatorError(
            this.warnings[tag],
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
  readonly warnings: {
    [tag: string]: string;
  } = {
    html: warnings.heading.shouldBeUnique,
    h1: warnings.h1,
    main: warnings.main,
    title: warnings.title.shouldBeUnique,
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const warnings: ValidatorError[] = [];

    Object.keys(this.warnings).forEach((tag) => {
      const { nodes } = new NodeList(domNodes, tag);
      if (nodes.length > 1) {
        warnings.push(new ValidatorError(this.warnings[tag], nodes[0]));
      }
    });
    return warnings;
  }
}

export class NavigationValidator implements Validator {
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
          errors.push(new ValidatorError(warnings.nav, nav));
        }
      });
    }

    return errors;
  }
}

export class AttributesValidator implements Validator {
  readonly warnings: {
    [tag: string]: string;
  } = {
    html: warnings.html.hasMissingAttribute,
    meta: warnings.meta.hasMissingAttribute,
  };
  readonly attributes = {
    html: ['lang'],
    meta: ['name'],
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    Object.keys(this.warnings).forEach((tag) => {
      const nodeList = new NodeList(domNodes, tag);
      const { nodes: elements } = nodeList;

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[
          tag as keyof typeof this.attributes
        ].every((attr) => nodeList.anyNodeHasAttribute(attr));

        if (!anyNodeHasAttribs) {
          errors.push(new ValidatorError(this.warnings[tag], elements[0]));
        }
      }
    });

    return errors;
  }
}

export class LinkValidator implements Validator {
  private nodeList: NodeList | null = null;

  readonly warnings: {
    [tag: string]: string;
  } = {
    onclick: warnings.link.wrongAttribute,
    tabindex: warnings.link.tabindex,
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
  };

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
          new ValidatorError(`${warnings.link.avoid}"${linkText}"`, link)
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
            errors.push(new ValidatorError(this.warnings[attrib], link));
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
          errors.push(new ValidatorError(warnings.link.mail, link));
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
