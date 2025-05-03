import React from 'react';
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';

/**
 * Sanitizes and transforms HTML so that all <a> elements have
 * target="_blank" and rel="noopener noreferrer".
 *
 * @param {string} html The raw HTML to sanitize and transform.
 * @returns {React.ReactNode} The sanitized and transformed React element tree.
 */
export function sanitizeAndTransform(html) {
  // Sanitize the HTML using DOMPurify
  const cleanHTML = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  // Define transformation options: replace <a> tags with modified ones.
  const options = {
    replace: (domNode) => {
      if (domNode.name === 'a' && domNode.attribs) {
        // Force external links to open in a new tab for security
        domNode.attribs.target = '_blank';
        domNode.attribs.rel = 'noopener noreferrer';
        return <a {...domNode.attribs}>{domToReact(domNode.children, options)}</a>;
      }
    },
  };

  return parse(cleanHTML, options);
}
