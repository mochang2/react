declare module 'types' {
  interface VirtualDOMElement {
    tagName: string;
    props?: any;
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
}
