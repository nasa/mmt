import CustomAsyncMultiSelectWidget from '@/js/components/CustomAsyncMultiSelectWidget/CustomAsyncMultiSelectWidget'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const { apiHost } = getApplicationConfig()

const adminGroupSearchUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 6,
                    children: ['name']
                  }
                },
                {
                  'ui:col': {
                    md: 6,
                    children: ['members']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  members: {
    'ui:widget': CustomAsyncMultiSelectWidget,
    'ui:search': {
      host: apiHost,
      endpoint: '/users',
      parameter: 'query'
    }
  }
}

export default adminGroupSearchUiSchema
