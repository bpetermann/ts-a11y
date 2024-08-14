import { AnyNode } from 'domhandler';
import { warnings } from './warnings';
import {
  findNode,
  findNodes,
  hasAttribute,
  getNodeData,
  getNodeAttributes,
  getNodeAttribute,
} from './utils';

export class ValidatorError {
  constructor(public message: string, public node?: AnyNode) {}
}

export interface Validator {
  validate(nodes: AnyNode[]): ValidatorError[];
}

export class HeadingValidator implements Validator {
  cache = new Set<string>();

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    for (let i = 2; i <= 6; i++) {
      const tag = `h${i}`;
      const heading = findNode(domNodes, tag);

      if (heading) {
        const prevTag = `h${i - 1}`;
        this.cache.add(tag);

        const prevHeadingExists =
          this.cache.has(prevTag) || findNode(domNodes, prevTag);

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

    Object.keys(this.warnings).forEach((tag) => {
      if (!findNode(domNodes, tag)) {
        errors.push(new ValidatorError(this.warnings[tag]));
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
      const nodes = findNodes(domNodes, tag);
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

    const navElements = findNodes(domNodes, 'nav');

    if (navElements.length > 1) {
      navElements.forEach((nav) => {
        const navAttributes = getNodeAttributes(nav);
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
      const elements = findNodes(domNodes, tag);

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[
          tag as keyof typeof this.attributes
        ].every((attr) => hasAttribute(elements, attr));

        if (!anyNodeHasAttribs) {
          errors.push(new ValidatorError(this.warnings[tag], elements[0]));
        }
      }
    });

    return errors;
  }
}

export class LinkValidator implements Validator {
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
    const links = findNodes(domNodes, 'a');

    if (!links.length) {
      return [];
    }

    return [
      ...this.checkGenericTexts(links),
      ...this.checkFaultyAttributes(links),
      ...this.checkEmailLinks(links),
    ];
  }

  private checkEmailLinks(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      if (getNodeAttribute(link, 'href')?.startsWith('mailto:')) {
        const linkText = getNodeData(link);
        if (linkText && !linkText.includes('@')) {
          errors.push(new ValidatorError(warnings.link.mail, link));
        }
      }
    });

    return errors;
  }

  private checkGenericTexts(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      const linkText = getNodeData(link);
      if (this.isGeneric(linkText)) {
        errors.push(
          new ValidatorError(`${warnings.link.avoid}"${linkText}"`, link)
        );
      }
    });

    return errors;
  }

  private isGeneric(text?: string): boolean {
    return !!text && this.genericTexts.has(text.toLowerCase().trim());
  }

  private checkFaultyAttributes(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      const attributes = getNodeAttributes(link);
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

  private isFaulty(
    attributes: { [name: string]: string },
    attrib: string,
    value: string | null
  ): boolean {
    return attrib in attributes && (!value || attributes[attrib] === value);
  }
}
