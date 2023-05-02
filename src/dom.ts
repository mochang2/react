import { UPDATE_STRATEGY } from './constants';
import { isPrimitive } from './utils';
import type { Primitive, Prop, VirtualDOMElement } from 'types';

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

export function diffingUpdate(
  parent: Node,
  nextNode: VirtualDOMElement | string,
  previousNode: VirtualDOMElement | string,
  parentIndex = 0
) {
  const updateStrategy = selectUpdateStrategy(nextNode, previousNode);
  const targetNode = parent.childNodes[parentIndex];

  switch (updateStrategy) {
    case UPDATE_STRATEGY.IS_NON_EXISTENT_NEXT_NODE:
      return parent.removeChild(targetNode);

    case UPDATE_STRATEGY.IS_NON_EXISTENT_PREVIOUS_NODE:
      return parent.appendChild(renderRealDOM(nextNode));

    case UPDATE_STRATEGY.ARE_BOTH_STRING:
      if ((nextNode as string) === (previousNode as string)) {
        return;
      }

      return parent.replaceChild(renderRealDOM(nextNode), targetNode);

    case UPDATE_STRATEGY.IS_DIFFERENT_TAG_NAME:
      return parent.replaceChild(renderRealDOM(nextNode), targetNode);

    default:
  }

  updateAttribute(
    targetNode,
    (nextNode as VirtualDOMElement).props || {},
    (previousNode as VirtualDOMElement).props || {}
  );

  const deeperNode =
    (nextNode as VirtualDOMElement).children.length >
    (previousNode as VirtualDOMElement).children.length
      ? nextNode
      : previousNode;
  for (const [index] of (deeperNode as VirtualDOMElement).children.entries()) {
    diffingUpdate(
      targetNode,
      (nextNode as VirtualDOMElement).children[index],
      (previousNode as VirtualDOMElement).children[index],
      index
    );
  }
}

function selectUpdateStrategy(
  nextNode: VirtualDOMElement | string,
  previousNode: VirtualDOMElement | string
): (typeof UPDATE_STRATEGY)[keyof typeof UPDATE_STRATEGY] | null {
  if (!nextNode && previousNode) {
    return UPDATE_STRATEGY.IS_NON_EXISTENT_NEXT_NODE;
  }

  if (nextNode && !previousNode) {
    return UPDATE_STRATEGY.IS_NON_EXISTENT_PREVIOUS_NODE;
  }

  if (typeof nextNode === 'string' && typeof previousNode === 'string') {
    return UPDATE_STRATEGY.ARE_BOTH_STRING;
  }

  if (
    (nextNode as VirtualDOMElement).tagName !==
    (previousNode as VirtualDOMElement).tagName
  ) {
    return UPDATE_STRATEGY.IS_DIFFERENT_TAG_NAME;
  }

  return null;
}

function updateAttribute(
  targetNode: ChildNode,
  nextProps: Prop,
  previousProps: Prop
) {
  if (targetNode.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  for (const [attr, value] of Object.entries(nextProps)) {
    if (previousProps[attr] === nextProps[attr]) {
      continue;
    }

    (targetNode as Element).setAttribute(attr, value);
  }

  for (const attr of Object.keys(previousProps)) {
    if (nextProps[attr] !== undefined) {
      continue;
    }

    (targetNode as Element).removeAttribute(attr);
  }
}
