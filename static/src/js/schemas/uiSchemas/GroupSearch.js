import CustomAsyncMultiSelectWidget from '@/js/components/CustomAsyncMultiSelectWidget/CustomAsyncMultiSelectWidget'
import CustomMultiSelectWidget from '@/js/components/CustomMultiSelectWidget/CustomMultiSelectWidget'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const { apiHost } = getApplicationConfig()

const groupSearchUiSchema = {
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
                    md: 4,
                    children: ['name']
                  }
                },
                {
                  'ui:col': {
                    md: 4,
                    children: ['providers']
                  }
                },
                {
                  'ui:col': {
                    md: 4,
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
  providers: {
    'ui:required': true,
    'ui:widget': CustomMultiSelectWidget
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

export default groupSearchUiSchema
