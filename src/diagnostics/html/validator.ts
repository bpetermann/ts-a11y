import { AnyNode } from 'domhandler';
import { warnings } from './warnings';
import { Elements, Validator } from './types';
import {
  findNode,
  findNodes,
  allNodesHaveAttribute,
  hasAttribute,
  getNodeData,
} from './utils';

export class HeadingValidator implements Validator {
  readonly elements: Elements = {
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
      .map((_) => this.elements.heading);
  }
}

export class RequiredValidator implements Validator {
  readonly elements: Elements = {
    meta: warnings.meta.shouldExist,
    title: warnings.title.shouldExist,
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.elements).forEach((tag) => {
      if (!findNode(domNodes, tag)) {
        errors.push(this.elements[tag]);
      }
    });

    return errors;
  }
}

export class UniquenessValidator implements Validator {
  readonly elements: Elements = {
    html: warnings.heading.shouldBeUnique,
    h1: warnings.h1,
    main: warnings.main,
    title: warnings.title.shouldBeUnique,
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.elements).forEach((tag) => {
      if (findNodes(domNodes, tag).length > 1) {
        errors.push(this.elements[tag]);
      }
    });
    return errors;
  }
}

export class NavigationValidator implements Validator {
  readonly elements: Elements = {
    nav: warnings.nav,
  };

  validate(domNodes: AnyNode[]): string[] {
    const navElements = findNodes(domNodes, 'nav');
    const allNodesHaveAttribs = allNodesHaveAttribute(navElements, [
      'aria-labelledby',
      'aria-label',
    ]);

    return navElements.length > 1 && !allNodesHaveAttribs
      ? [this.elements['nav']]
      : [];
  }
}

export class AttributesValidator implements Validator {
  readonly elements: Elements = {
    html: warnings.html.hasMissingAttribute,
    meta: warnings.meta.hasMissingAttribute,
  };
  readonly attributes = {
    html: ['lang'],
    meta: ['name'],
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.elements).forEach((tag) => {
      const elements = findNodes(domNodes, tag);

      if (elements.length) {
        const anyNodeHasAttribs = this.attributes[
          tag as keyof typeof this.attributes
        ].every((attr) => hasAttribute(elements, attr));

        if (!anyNodeHasAttribs) {
          errors.push(this.elements[tag]);
        }
      }
    });
    return errors;
  }
}

export class LinkValidator implements Validator {
  readonly elements: Elements = {
    a: warnings.link,
  };

  readonly genericText = [
    'click me',
    'download',
    'here',
    'read more',
    'learn more',
    'click',
  ].map((text) => text.toLowerCase().trim());

  isGeneric(text: string | undefined) {
    return text && this.genericText.includes(text.toLowerCase().trim());
  }

  validate(domNodes: AnyNode[]): string[] {
    const links = findNodes(domNodes, 'a');

    return links
      .map(getNodeData)
      .filter((text) => this.isGeneric(text))
      .map((text) => this.elements.a + text);
  }
}
