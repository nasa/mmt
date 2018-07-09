require 'rails_helper'

describe 'Collections breadcrumbs and header' do
  before do
    login
    ingest_response, @concept_response = publish_collection_draft
    visit collection_path(ingest_response['concept-id'])
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

    it 'displays the title information' do
      within 'main header' do
        expect(page).to have_content("#{@concept_response.body['ShortName']}_#{@concept_response.body['Version']}")
        expect(page).to have_content(@concept_response.body['EntryTitle'])
      end
    end
  end

  context 'When viewing a collection draft with NEAR_REAL_TIME' do
    before do
      ingest_response, _concept_response = publish_collection_draft(collection_data_type: 'NEAR_REAL_TIME')
      visit collection_path(ingest_response['concept-id'])
    end

    it 'displays the NRT badge' do
      within 'main header' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'NRT')
      end
    end
  end
end
