require 'rails_helper'

describe 'Variables breadcrumbs' do
  before do
    login
    ingest_response = publish_variable_draft(name: 'Variable Name')
    visit variable_path(ingest_response['concept-id'])
  end

  context 'when viewing the breadcrumbs' do
    it 'displays Blank Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variables')
        expect(page).to have_content('Variable Name')
      end
    end
  end
end
