import { renderRealDOM, diffingUpdate } from './dom';
import { VirtualDOMElement, Dependency } from 'types';

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

function calculateDiffing() {
  // app 아래 컴포넌트 간 트리 구조를 가진 뒤, state가 변경된 컴포넌트 하위에서만 re-rendering이 발생해야 더 효율적인 diffing update가 가능
  const nextNode = app();
  diffingUpdate(root, nextNode, previousNode);
  previousNode = nextNode;
}

export function useState<T>(initialState: T): [T, (state: T) => void] {
  // 컴포넌트가 unmount될 때 states를 지우지 않아 메모리 관리가 비효율적임
  const index = stateCount;

  if (states.length === index) {
    states.unshift(initialState);
  }

  const setState = (nextState: T) => {
    if (states[index] === nextState) {
      // 얕은 비교
      return;
    }

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
