import { isPrimitive } from './utils';
import { Primitive, VirtualDOMElement } from 'types';

export function renderRealDOM(VirtualDOM: VirtualDOMElement | Primitive) {
  if (isPrimitive(VirtualDOM)) {
    return document.createTextNode(String(VirtualDOM));
  }

  const element = document.createElement(
    (VirtualDOM as VirtualDOMElement).tagName
  );

  Object.entries((VirtualDOM as VirtualDOMElement).props || {}).forEach(
    ([property, attribute]) => {
      element.setAttribute(property, attribute);
    }
  );

  (VirtualDOM as VirtualDOMElement).children
    .map(renderRealDOM)
    .forEach((node) => {
      element.appendChild(node);
    });

  return element;
}

// text만 변경된 경우로 한정.
export function diffingUpdate<
  Next extends VirtualDOMElement | string,
  Previous extends Next extends string ? string : VirtualDOMElement
>(parent: Node, nextNode: Next, previousNode: Previous, parentIndex = 0) {
  if (typeof nextNode === 'string' && typeof previousNode === 'string') {
    if ((nextNode as string) === (previousNode as string)) {
      // update 없음
      return;
    }

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
