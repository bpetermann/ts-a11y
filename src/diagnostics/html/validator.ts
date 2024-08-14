import { AnyNode } from 'domhandler';
import { warnings } from './warnings';
import {
  findNode,
  findNodes,
  allNodesHaveAttribute,
  hasAttribute,
  getNodeData,
  getNodeAttributes,
} from './utils';

export class ValidatorError {
  constructor(public message: string, public node?: AnyNode) {}
}

export interface Validator {
  warnings: {
    [tag: string]: string;
  };
  validate(nodes: AnyNode[]): ValidatorError[];
}

export class HeadingValidator implements Validator {
  readonly warnings: {
    [tag: string]: string;
  } = {
    heading: warnings.heading.shouldExist,
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    Array(5)
      .fill(null)
      .forEach((_, i) => {
        const heading = findNode(domNodes, 'h' + (i + 2));
        if (heading) {
          const ancestor = findNode(domNodes, 'h' + (i + 1));
          if (!ancestor) {
            errors.push(new ValidatorError(this.warnings.heading, heading));
          }
        }
      });

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
    const warnings: ValidatorError[] = [];

    Object.keys(this.warnings).forEach((tag) => {
      if (!findNode(domNodes, tag)) {
        warnings.push(new ValidatorError(this.warnings[tag]));
      }
    });

    return warnings;
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
  readonly warnings: {
    [tag: string]: string;
  } = {
    nav: warnings.nav,
  };

  validate(domNodes: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    const navElements = findNodes(domNodes, 'nav');
    if (navElements.length < 2) {
      return [];
    }

    navElements.forEach((nav) => {
      const navAttributes = getNodeAttributes(nav) || {};
      const hasAriaAttribute = ['aria-labelledby', 'aria-label'].some(
        (attribute) => Object.keys(navAttributes).includes(attribute)
      );

      if (!hasAriaAttribute) {
        errors.push(new ValidatorError(this.warnings.nav, nav));
      }
    });

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
    generic: warnings.link.avoid,
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
    ];
  }

  private checkGenericTexts(links: AnyNode[]): ValidatorError[] {
    const errors: ValidatorError[] = [];

    links.forEach((link) => {
      const linkText = getNodeData(link);
      const hasGenericText = this.isGeneric(linkText);
      if (hasGenericText) {
        errors.push(new ValidatorError(this.warnings.generic + linkText, link));
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
          if (this.isFaulty(attributes, attrib, value)) {
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
