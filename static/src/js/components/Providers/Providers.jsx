import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import { FaQuestionCircle } from 'react-icons/fa'

import { GET_ACLS } from '@/js/operations/queries/getAcls'
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

  const { data } = useSuspenseQuery(GET_ACLS, {
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
      <Alert variant="light" className="mb-4">
        <FaQuestionCircle className="me-2 small" />
        {/* eslint-disable-next-line max-len */}
        To receive assistance with permissions, please reach out to the DAAC Manager responsible for managing the provider.
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
