import React from 'react'
import {
  Badge,
  Container,
  Navbar
} from 'react-bootstrap'

import For from '../For/For'

import './Footer.scss'

/**
 * Renders a `Footer` component
 *
 * @component
 * @example <caption>Renders a `Footer` component</caption>
 * return (
 *   <Footer />
 * )
 */
const Footer = () => (
  <footer className="footer">
    <Navbar bg="primary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Badge bg="dark">Version 2</Badge>
          <ul className="list-unstyled m-0 p-0 d-flex flex-columns">
            <For
              each={
                [
                  {
                    title: 'NASA Official: Stephen Berrick'
                  },
                  {
                    title: 'FOIA',
                    href: 'https://www.nasa.gov/FOIA/index.html'
                  },
                  {
                    title: 'NASA Privacy Policy',
                    href: 'https://www.nasa.gov/about/highlights/HP_Privacy.html'
                  },
                  {
                    title: 'USA.gov',
                    href: 'https://www.usa.gov/'
                  }
                ]
              }
            >
              {
                ({
                  title,
                  href
                }) => (
                  <li key={title} className="footer__item ms-3 small">
                    {
                      !href
                        ? <span className="text-decoration-none text-white small">{title}</span>
                        : <a className="footer__item-link text-white small" href={href}>{title}</a>
                    }
                  </li>
                )
              }
            </For>
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </footer>
)

export default Footer
