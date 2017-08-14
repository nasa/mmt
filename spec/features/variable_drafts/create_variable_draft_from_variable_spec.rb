require 'rails_helper'

describe 'Create new draft from variable', reset_provider: true do
  context 'when editing a published variable' do
    before do
      login

      ingest_response = publish_variable_draft(name: 'Test Edit Variable Name')

      visit variable_path(ingest_response['concept-id'])

      click_on 'Edit Variable Record'
    end

    it 'displays a confirmation message on the variable draft preview page' do
      expect(page).to have_content('Variable Draft Created Successfully!')

      expect(page).to have_link('Publish Variable Draft')
      expect(page).to have_content('Test Edit Variable Name')
    end
  end
end
