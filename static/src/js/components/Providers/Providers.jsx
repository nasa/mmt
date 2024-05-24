import React from 'react'
import Alert from 'react-bootstrap/Alert'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import { FaQuestionCircle } from 'react-icons/fa'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import For from '../For/For'

/**
 * Renders a Providers component
 *
 * @component
 * @example <caption>Render a Providers</caption>
 * return (
 *   <Providers />
 * )
 */
const Providers = () => {
  const { providerIds } = useAvailableProviders()

  return (
    <>
      <Alert variant="info" className="mb-4">
        <FaQuestionCircle className="me-2 small" />
        {/* eslint-disable-next-line max-len */}
        To receive assistance with permissions, please reach out to the provider administrator or Earthdata Operations (
        <a href="mailto:support@earthdata.nasa.gov">support@earthdata.nasa.gov</a>
        ).
      </Alert>

      {
        (!providerIds || providerIds.length === 0) && (
          <p>
            You do not have access to any providers.
          </p>
        )
      }

      {
        providerIds && providerIds.length > 0 && (
          <>
            <p>
              You have permissions to manage metadata records for the following providers.
            </p>

            <ListGroup>
              <For each={providerIds}>
                {
                  (providerId) => (
                    <ListGroupItem key={providerId}>
                      {providerId}
                    </ListGroupItem>
                  )
                }
              </For>
            </ListGroup>
          </>
        )
      }
    </>
  )
}

export default Providers
