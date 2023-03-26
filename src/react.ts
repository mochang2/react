/* @jsx createElement */

import { isPrimitive } from './utils';
import { Primitive, VirtualDOMElement, Dependency } from 'types';

let stateCount = 0;
const states: any[] = [];

let root: Element;
let app: () => VirtualDOMElement;
let previousNode: VirtualDOMElement;

let dependency: Dependency = null;

export function createElement(
  tagName: string,
  props: any,
  ...children: Array<VirtualDOMElement>
): VirtualDOMElement {
  return { tagName, props, children: children.flat() };
}

export function createReactRoot(rootElement: Element | null) {
  if (!rootElement) {
    throw new Error('cannot find root element');
  }

  return {
    render: (appElement: () => VirtualDOMElement) => {
      root = rootElement as Element;
      app = appElement;
      previousNode = appElement();

      rootElement.appendChild(renderRealDOM(previousNode));
    },
  };
}

export function renderRealDOM(VirtualDOM: VirtualDOMElement | Primitive) {
  if (isPrimitive(VirtualDOM)) {
    return document.createTextNode(String(VirtualDOM));
  }

  const $Element = document.createElement(
    (VirtualDOM as VirtualDOMElement).tagName
  );

  (VirtualDOM as VirtualDOMElement).children
    .map(renderRealDOM)
    .forEach((node) => $Element.appendChild(node));
  return $Element;
}

// text만 변경된 경우로 한정.
export function diffingUpdate<
  Next extends VirtualDOMElement | string,
  Previous extends Next extends string ? string : VirtualDOMElement
>(parent: Node, nextNode: Next, previousNode: Previous, parentIndex = 0) {
  if (typeof nextNode === 'string' && typeof previousNode === 'string') {
    if ((nextNode as string) === (previousNode as string)) return; // update 없음

    return parent.replaceChild(
      renderRealDOM(nextNode),
      parent.childNodes[parentIndex]
    );
  }

  for (const [index] of (nextNode as VirtualDOMElement).children.entries()) {
    diffingUpdate(
      parent.childNodes[parentIndex],
      (nextNode as VirtualDOMElement).children[index],
      (previousNode as VirtualDOMElement).children[index],
      index
    );
  }
}

function calculateDiffing() {
  const nextNode = app();
  diffingUpdate(root, nextNode, previousNode);
  previousNode = nextNode;
}

export function useState<T>(initialState: T): [T, (state: T) => void] {
  // 새로운 state를 만들 때마다, re-rendering될 때마다 states가 늘어만 가지만 여기서는 메모리 관리에 대해서는 고민하지 않음
  const index = stateCount;

  if (states.length === index) {
    states.unshift(initialState);
  }

  const setState = (nextState: T) => {
    states[index] = nextState;
    calculateDiffing();
  };

  stateCount++;

  return [states[index], setState];
}

export function useEffect(callback: () => void, dependencies: [Dependency]) {
  if (dependency === null || dependency !== dependencies[0]) {
    dependency = dependencies[0];

    callback();
  }
}
