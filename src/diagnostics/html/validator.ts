import { AnyNode } from 'domhandler';
import { warnings } from './warnings';
import { Warnings, Validator } from './types';
import {
  findNode,
  findNodes,
  allNodesHaveAttribute,
  hasAttribute,
  getNodeData,
} from './utils';

export class HeadingValidator implements Validator {
  readonly warnings: Warnings = {
    heading: warnings.heading.shouldExist,
  };

  hasValidLevels(domNodes: AnyNode[], level: number) {
    const heading = findNode(domNodes, 'h' + level);
    return !heading || (heading && findNode(domNodes, `h${level - 1}`));
  }

  validate(domNodes: AnyNode[]): string[] {
    return Array(5)
      .fill(null)
      .filter((_, i) => !this.hasValidLevels(domNodes, i + 2))
      .map((_) => this.warnings.heading);
  }
}

export class RequiredValidator implements Validator {
  readonly warnings: Warnings = {
    meta: warnings.meta.shouldExist,
    title: warnings.title.shouldExist,
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.warnings).forEach((tag) => {
      if (!findNode(domNodes, tag)) {
        errors.push(this.warnings[tag]);
      }
    });

    return errors;
  }
}

export class UniquenessValidator implements Validator {
  readonly warnings: Warnings = {
    html: warnings.heading.shouldBeUnique,
    h1: warnings.h1,
    main: warnings.main,
    title: warnings.title.shouldBeUnique,
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.warnings).forEach((tag) => {
      if (findNodes(domNodes, tag).length > 1) {
        errors.push(this.warnings[tag]);
      }
    });
    return errors;
  }
}

export class NavigationValidator implements Validator {
  readonly warnings: Warnings = {
    nav: warnings.nav,
  };

  validate(domNodes: AnyNode[]): string[] {
    const navElements = findNodes(domNodes, 'nav');
    const allNodesHaveAttribs = allNodesHaveAttribute(navElements, [
      'aria-labelledby',
      'aria-label',
    ]);

    return navElements.length > 1 && !allNodesHaveAttribs
      ? [this.warnings['nav']]
      : [];
  }
}

export class AttributesValidator implements Validator {
  readonly warnings: Warnings = {
    html: warnings.html.hasMissingAttribute,
    meta: warnings.meta.hasMissingAttribute,
  };
  readonly attributes = {
    html: ['lang'],
    meta: ['name'],
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.warnings).forEach((tag) => {
      const elements = findNodes(domNodes, tag);

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[
          tag as keyof typeof this.attributes
        ].every((attr) => hasAttribute(elements, attr));

        if (!anyNodeHasAttribs) {
          errors.push(this.warnings[tag]);
        }
      }
    });
    return errors;
  }
}

export class LinkValidator implements Validator {
  readonly warnings: Warnings = {
    generic: warnings.link.avoid,
    attribute: warnings.link.wrongAttribute,
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

  private readonly prohibitedAttributes = new Set(['onclick']);

  private isGeneric(text?: string): boolean {
    return !!text && this.genericTexts.has(text.toLowerCase().trim());
  }

  private checkGenericTexts(links: AnyNode[]): string[] {
    return links
      .map(getNodeData)
      .filter(this.isGeneric.bind(this))
      .map((text) => this.warnings.generic + text);
  }

  private checkAttributes(links: AnyNode[]): string[] {
    const warnings: string[] = [];

    this.prohibitedAttributes.forEach((attr) => {
      if (hasAttribute(links, attr)) {
        warnings.push(this.warnings.attribute);
      }
    });

    return warnings;
  }

  validate(domNodes: AnyNode[]): string[] {
    const links = findNodes(domNodes, 'a');

    if (!links.length) {
      return [];
    }

    const genericTextWarnings = this.checkGenericTexts(links);
    const attributeWarnings = this.checkAttributes(links);

    return [...genericTextWarnings, ...attributeWarnings];
  }
}
