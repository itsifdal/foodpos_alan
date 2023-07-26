import React from 'react';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <Container className="mt-4">
      <header>
        {/* Add your header content here */}
      </header>
      <main>{children}</main>
      <footer className="mt-4">
        {/* Add your footer content here */}
      </footer>
    </Container>
  );
};

export default Layout;
