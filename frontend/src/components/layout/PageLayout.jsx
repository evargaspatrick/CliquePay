import PropTypes from 'prop-types';

export function PageLayout({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {children}
    </div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export function Container({ children, className = "" }) {
  return (
    <div className={`container mx-auto px-8 sm:px-10 md:px-16 lg:px-20 ${className}`}>
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export function Section({ id, children, className = "", ...props }) {
  return (
    <section id={id} className={`py-20 ${className}`} {...props}>
      <Container>
        {children}
      </Container>
    </section>
  );
}

Section.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export function Header({ children, className = "" }) {
  return (
    <header className="py-6">
      <Container className={`flex justify-between items-center ${className}`}>
        {children}
      </Container>
    </header>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export function Footer({ children, className = "" }) {
  return (
    <footer className={`py-12 ${className}`}>
      <Container>
        {children}
      </Container>
    </footer>
  );
}

Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};