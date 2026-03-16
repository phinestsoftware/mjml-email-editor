import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export const ShadowDom: React.FC<React.HTMLProps<HTMLElement>> = (props) => {
  const [mountNode, setMountNode] = useState<null | HTMLDivElement>(null);
  const [ref, setRef] = useState<null | HTMLDivElement>(null);

  useEffect(() => {
    if (ref) {
      const root = ref.attachShadow({ mode: 'open' });
      // Create a container div inside the shadow root for React to manage
      const container = document.createElement('div');
      container.style.height = '100%';
      root.appendChild(container);
      setMountNode(container);
    }
  }, [ref]);

  return (
    <>
      <div {...(props as any)} ref={setRef}>
        {mountNode && ReactDOM.createPortal(props.children, mountNode)}
      </div>
    </>
  );
};
