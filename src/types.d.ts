declare module 'types' {
  interface VirtualDOMElement {
    tagName: string;
    props?: Props;
    children: Array<VirtualDOMElement | string>;
  }

  type Props = null | { [property: string]: string };

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
