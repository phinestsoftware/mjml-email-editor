/**
 * React 19 compatibility polyfill.
 *
 * 1. ReactDOM.findDOMNode was removed in React 19. This polyfill adds it back
 *    as a safe fallback for libraries (react-transition-group) that still reference it.
 *
 * 2. Patches Node.removeChild/insertBefore to gracefully handle React 19's
 *    stricter DOM ownership model. When third-party code (MJML rendering,
 *    shadow DOM portals) manipulates the DOM outside React's knowledge,
 *    React 19 throws "not a child of this node" during cleanup. This patch
 *    catches those specific errors silently, as they are cosmetic — the nodes
 *    have already been removed by the external code.
 */
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { setCreateRoot } from '@arco-design/web-react/es/_util/react-dom';

// Initialize arco-design for React 19
// See: https://arco.design/react/en-US/docs/start#react-19
setCreateRoot(createRoot);

// Polyfill findDOMNode
if (typeof (ReactDOM as any).findDOMNode !== 'function') {
  (ReactDOM as any).findDOMNode = function findDOMNodePolyfill(componentOrElement: any): Element | null {
    if (componentOrElement == null) {
      return null;
    }
    if (componentOrElement instanceof Element) {
      return componentOrElement;
    }
    if (componentOrElement.current instanceof Element) {
      return componentOrElement.current;
    }
    return null;
  };
}

// Patch removeChild to handle React 19 DOM cleanup conflicts
const originalRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function<T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    // The node was already removed or moved by external DOM manipulation.
    // Return silently to prevent React 19 from crashing.
    return child;
  }
  return originalRemoveChild.call(this, child) as T;
};

// Patch insertBefore for the same reason
const originalInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
  if (referenceNode && referenceNode.parentNode !== this) {
    // Reference node is no longer a child — append instead
    return this.appendChild(newNode) as T;
  }
  return originalInsertBefore.call(this, newNode, referenceNode) as T;
};
