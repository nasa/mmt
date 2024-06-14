import React, { useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router'

import useAuthContext from '@/js/hooks/useAuthContext'

import For from '@/js/components/For/For'
import Page from '@/js/components/Page/Page'
import Panel from '@/js/components/Panel/Panel'

import isTokenExpired from '@/js/utils/isTokenExpired'

import './HomePage.scss'

/**
 * Renders a `HomePage` component
 *
 * @component
 * @example <caption>Renders a `HomePage` component</caption>
 * return (
 *   <HomePage />
 * )
 */
const HomePage = () => {
  const navigate = useNavigate()

  const { tokenExpires } = useAuthContext()

  useEffect(() => {
    const isExpired = isTokenExpired(tokenExpires)

    if (!isExpired) {
      navigate('/collections', { replace: true })
    }
  }, [tokenExpires])

  const panels = [
    {
      title: 'About the Metadata Management Tool (MMT)',
      body: 'The MMT is a web-based user interface to the NASA EOSDIS Common Metadata Repository (CMR). The MMT allows metadata authors to create and update CMR metadata records by using a data entry form based on the metadata fields in the CMR Unified Metadata Model (UMM). Metadata authors may also publish, view, delete, and manage revisions of CMR metadata records using the MMT.'
    },
    {
      title: 'About the Common Metadata Repository (CMR)',
      body: 'The CMR is a high-performance, high-quality metadata repository for earth science metadata records. The CMR manages the evolution of NASA Earth Science metadata in a unified and consistent way by providing a central storage and access capability that streamlines current workflows while increasing overall metadata quality and anticipating future capabilities.'
    }
  ]

  return (
    <Page
      header={
        (
          <Row className="justify-content-md-center">
            <For each={panels}>
              {
                ({ title, body }) => (
                  <Panel key={title} title={title}>
                    {body}
                  </Panel>
                )
              }
            </For>
          </Row>
        )
      }
      title="Home"
      navigation={false}
    />
  )
}

export default HomePage
