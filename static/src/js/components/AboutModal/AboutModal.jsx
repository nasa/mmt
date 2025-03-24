import React from 'react'
import PropTypes from 'prop-types'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import For from '@/js/components/For/For'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

/**
 * @typedef {Object} AboutModalProps
 * @property {String} show Boolean that displays or hides the modal.
 * @property {Function} toggleModal A callback function called when the modal is closed with a boolean representing its next state.
 */

/*
 * Renders a `AboutModal` component.
 *
 * The component is renders a modal with information about MMT
 *
 * @param {AboutModalProps} props
 *
 * @component
 * @example <caption>Render a modal with information about MMT</caption>
 * return (
 *   <AboutModal
 *      show
 *      toggleModal={setModalShow}
 *   />
 * )
 */
const AboutModal = ({
  show,
  toggleModal
}) => {
  const { version } = getApplicationConfig()

  return (
    <CustomModal
      show={show}
      toggleModal={toggleModal}
      header={
        (
          <>
            About
            <span className="ms-2 fw-normal fs-6 font-monospace small text-secondary">
              v
              {version}
            </span>
          </>
        )
      }
      message={
        (
          <>
            <h3 className="fs-6 fw-bold">Metadata Management Tool</h3>
            <p>
              The MMT is a web-based user interface to the NASA EOSDIS
              {' '}
              <a href="https://cmr.earthdata.nasa.gov/search/">
                Common Metadata Repository (CMR)
              </a>
              . The MMT allows metadata authors to create and update CMR metadata
              records by using a data entry form based on the metadata fields in the
              {' '}
              <a href="https://www.earthdata.nasa.gov/unified-metadata-model-umm">
                CMR Unified Metadata Model (UMM)
              </a>
              . Metadata authors may also publish, view, delete, and manage
              revisions of CMR metadata records using the MMT.
            </p>
            <h3 className="fs-6 fw-bold mt-4">Common Metadata Repository</h3>
            <p>
              The CMR is a high-performance, high-quality metadata repository for earth science
              metadata records. The CMR manages the evolution of NASA Earth Science metadata in
              a unified and consistent way by providing a central storage and access capability
              that streamlines current workflows while increasing overall metadata quality and
              anticipating future capabilities.
            </p>
            <hr />
            <div className="d-flex flex-column align-items-center justify-content-center py-2">
              <p className="small text-secondary mb-2">NASA Official: Doug Newman</p>
              <ul className="list-unstyled d-flex justify-content-center mb-0">
                <For each={
                  [
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
                    ({ href, title }) => (
                      <li key={`footer-nav-item-${href}`}>
                        <a className="small m-2" href={href}>{title}</a>
                      </li>
                    )
                  }
                </For>
              </ul>
            </div>
          </>
        )
      }
    />
  )
}

AboutModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
}

export default AboutModal
