import React from 'react'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'

import For from '../For/For'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

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
const Footer = () => {
  const { version } = getApplicationConfig()

  return (
    <footer className="footer">
      <Navbar bg="primary">
        <Container fluid className="d-flex flex-column flex-md-row align-items-center justify-content-start align-items-middle">
          <Badge bg="dark" className="d-block">
            v
            {version}
          </Badge>

          <ul className="list-unstyled m-0 p-0 pt-2 pt-md-0 d-flex flex-column flex-md-row align-items-center">
            <For
              each={
                [
                  {
                    title: 'NASA Official: Doug Newman'
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
                  <li key={title} className="footer__item d-block ms-0 pb-2 ms-md-3 pb-md-0 small">
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
        </Container>
      </Navbar>
    </footer>
  )
}

export default Footer
