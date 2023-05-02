declare module 'types' {
  type VirtualDOMElement = {
    tagName: string;
    props?: Prop;
    children: Array<VirtualDOMElement | string>;
  };

  type Prop = null | { [property: string]: string };

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
