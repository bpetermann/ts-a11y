import { AnyNode } from 'domhandler';
import { warnings } from './warnings';
import { Elements } from '../../types/html';
import {
  findNode,
  findNodes,
  allNodesHaveAttribute,
  hasAttribute,
} from './nodeUtils';

export interface Validator {
  elements: Elements;
  validate(nodes: AnyNode[]): string[];
}

export class HeadingValidator implements Validator {
  readonly elements: Elements = {
    h6: warnings.heading.shouldExist,
    h5: warnings.heading.shouldExist,
    h4: warnings.heading.shouldExist,
    h3: warnings.heading.shouldExist,
    h2: warnings.heading.shouldExist,
  };

  validate(domNodes: AnyNode[]): string[] {
    const errors: string[] = [];

    Object.keys(this.elements).forEach((tag, i, self) => {
      const headingExists = findNode(domNodes, tag);

      if (headingExists) {
        const lastHeading = tag === 'h2' ? 'h1' : self[i + 1];
        const lastHeadingExists = findNode(domNodes, lastHeading);

        if (!lastHeadingExists) {
          errors.push(this.elements[tag]);
        }
      }
    });

    return errors;
  }
}

export class RequiredValidator implements Validator {
  readonly elements: Elements = {
    meta: warnings.meta.shouldExist,
    title: warnings.title,
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
    html: '[Refa11y] The element should be unique: html',
    h1: warnings.h1,
    main: warnings.main,
    title: '[Refa11y] The element should be unique: title',
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
