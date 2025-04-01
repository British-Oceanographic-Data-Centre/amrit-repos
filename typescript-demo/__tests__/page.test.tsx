import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />);
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders the ordered list with instructions', () => {
    render(<Home />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Get started by editing src/app/page.tsx.');
    expect(listItems[1]).toHaveTextContent('Save and see your changes instantly.');
  });

  it('renders the "Deploy now" link', () => {
    render(<Home />);
    const deployLink = screen.getByRole('link', { name: /Deploy now/i });
    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute(
      'href',
      'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
    );
  });

  it('renders the footer with navigation links', () => {
    render(<Home />);
    const footerLinks = screen.getAllByRole('link', { name: /Learn|Examples|Go to nextjs.org →/i });
    expect(footerLinks).toHaveLength(3);

    expect(footerLinks[0]).toHaveTextContent('Learn');
    expect(footerLinks[0]).toHaveAttribute(
      'href',
      'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
    );

    expect(footerLinks[1]).toHaveTextContent('Examples');
    expect(footerLinks[1]).toHaveAttribute(
      'href',
      'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
    );

    expect(footerLinks[2]).toHaveTextContent('Go to nextjs.org →');
    expect(footerLinks[2]).toHaveAttribute(
      'href',
      'https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
    );
  });
});
