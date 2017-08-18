require 'rails_helper'

describe 'Collections breadcrumbs and header' do
  before do
    login
    ingest_response, @concept_response = publish_collection_draft
    visit collection_path(ingest_response['concept-id'])
    puts @concept_response.inspect
  end

  context 'when viewing the breadcrumbs' do
    it 'displays Blank Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collections')
        expect(page).to have_content(@concept_response.body['ShortName'])
      end
    end
  end

  context 'when viewing the header' do
    it 'has "Manage Collections" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Collections')
      end
    end
  end
end
