import saveTypes from '@/js/constants/saveTypes'

const saveTypesToHumanizedStringMap = {
  [saveTypes.save]: 'Save',
  [saveTypes.saveAndContinue]: 'Save & Continue',
  [saveTypes.saveAndCreateDraft]: 'Save & Create Draft',
  [saveTypes.saveAndPreview]: 'Save & Preview',
  [saveTypes.saveAndPublish]: 'Save & Publish',
  [saveTypes.submit]: 'Submit'
}

export default saveTypesToHumanizedStringMap
