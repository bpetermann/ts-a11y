export enum Constraint {
  Uniqueness = 'checkUniqueness',
  Required = 'checkExistence',
  Attributes = 'checkAttributes',
  Navigation = 'checkNavElements',
}

export const enum Tag {
  Html = 'html',
  Title = 'title',
  Meta = 'meta',
  Main = 'main',
  Nav = 'nav',
}

export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};

export enum WarningKey {
  Exist = 'shouldExist',
  Unique = 'shouldBeUnique',
  Attributes = 'hasMissingAttribute',
}
