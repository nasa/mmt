require 'rails_helper'

describe 'Create new draft from variable' do
  context 'when editing a published variable', js: true do
    before do
      login

      ingest_response = publish_variable_draft

      visit variable_path(ingest_response.body['concept-id'])

      click_on 'Edit Record'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Variable Draft Created Successfully!')
    end
  end
end
