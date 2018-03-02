require 'rails_helper'

describe 'Create new draft from service', reset_provider: true do
  context 'when editing a published service' do
    before do
      login

      ingest_response, _concept_response = publish_service_draft(name: 'Test Service')

      visit service_path(ingest_response['concept-id'])

      click_on 'Edit Service Record'
    end

    it 'displays a confirmation message on the service draft preview page' do
      expect(page).to have_content('Service Draft Created Successfully!')

      expect(page).to have_link('Publish Service Draft')
      expect(page).to have_content('Test Service')
    end
  end
end
