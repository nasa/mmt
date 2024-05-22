import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import { FaQuestionCircle } from 'react-icons/fa'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'
import useAppContext from '@/js/hooks/useAppContext'
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
  const { user } = useAppContext()

  const { uid } = user

  const { data } = useSuspenseQuery(GET_AVAILABLE_PROVIDERS, {
    variables: {
      params: {
        limit: 500,
        permittedUser: uid,
        target: 'PROVIDER_CONTEXT'
      }
    }
  })

  const { acls } = data
  const { items } = acls

  const providerList = items?.map((item) => item.providerIdentity.provider_id)

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
        (!providerList || providerList.length === 0) && (
          <p>
            You do not have access to any providers.
          </p>
        )
      }

      {
        providerList && providerList.length > 0 && (
          <>
            <p>
              You have permissions to manage metadata records for the following providers.
            </p>

            <ListGroup>
              <For each={providerList}>
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
