// frontend/src/__mocks__/react-router-dom.js

// A minimal stub for BrowserRouter (and anything else you need):
export const BrowserRouter = ({ children }) => children;

// If you use other exports from react-router-dom, stub them too:
export const Link = ({ to, children, ...rest }) => (
    <a href={to} {...rest}>{children}</a>
);
// etc.