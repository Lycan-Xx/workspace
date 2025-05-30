
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    // Create or get the portal root element
    let root = document.getElementById('portal-root');
    
    if (!root) {
      root = document.createElement('div');
      root.id = 'portal-root';
      document.body.appendChild(root);
    }
    
    setPortalRoot(root);
    setMounted(true);

    return () => {
      // Clean up: remove portal root if it's empty when component unmounts
      if (root && root.children.length === 0 && root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, []);

  if (!mounted || !portalRoot) {
    return null;
  }

  return createPortal(children, portalRoot);
};

export default Portal;
