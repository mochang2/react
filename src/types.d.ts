declare module 'types' {
  interface VirtualDOMElement {
    tagName: string;
    props?: null | { [property: string]: string };
    children: Array<VirtualDOMElement | string>;
  }

  type Primitive =
    | number
    | string
    | null
    | undefined
    | symbol
    | bigint
    | boolean;

  type Dependency = string | number | boolean | bigint | symbol | undefined;
}
