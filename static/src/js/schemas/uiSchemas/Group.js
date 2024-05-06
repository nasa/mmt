import CustomAsyncMultiSelectWidget from '@/js/components/CustomAsyncMultiSelectWidget/CustomAsyncMultiSelectWidget'
import CustomRadioWidget from '../../components/CustomRadioWidget/CustomRadioWidget'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const { apiHost } = getApplicationConfig()

const groupUiSchema = {
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
                    md: 12,
                    children: ['name']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['description']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 3,
                    children: ['systemGroup']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
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
  description: {
    'ui:widget': 'textarea'
  },
  systemGroup: {
    'ui:widget': CustomRadioWidget,
    'ui:options': {
      showClear: false
    }
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

export default groupUiSchema
