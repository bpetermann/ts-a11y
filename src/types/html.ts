export enum Constraint {
  Uniqueness = 'checkUniqueness',
  Required = 'checkExistence',
  Attributes = 'checkAttributes',
  Navigation = 'checkNavElements',
  Heading = 'checkHeadingElements',
}

export const enum Tag {
  Html = 'html',
  Title = 'title',
  Meta = 'meta',
  Main = 'main',
  Nav = 'nav',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};

export enum WarningKey {
  Exist = 'shouldExist',
  Unique = 'shouldBeUnique',
  Attributes = 'hasMissingAttribute',
  Dependency = 'hasMissingDependency',
}
