# MMT-22, MMT-10, MMT-8

require 'rails_helper'

describe 'Search published results', js: true do
  let(:short_name)  { 'CIESIN_SEDAC_EPI_2008' }
  let(:version)     { '2008.00' }
  let(:entry_title) { '2008 Environmental Performance Index (EPI)' }
  let(:provider)    { 'SEDAC' }

  before do
    login
  end

  context 'when performing a collection search by concept_id' do
    before do
      @ingest_response, @concept_response = publish_collection_draft

      fill_in 'keyword', with: @ingest_response['concept-id']
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{@ingest_response['concept-id']}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(@concept_response.body['ShortName'])
      expect(page).to have_content(@concept_response.body['Version'])
      expect(page).to have_content(@concept_response.body['EntryTitle'])
      expect(page).to have_content('MMT_2')
    end
  end

  context 'when performing a collection search by short name' do
    before do
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end
  end

  context 'when performing a collection search by entry title' do
    before do
      fill_in 'keyword', with: entry_title
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{entry_title}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end
  end

  context 'when performing a collection search by partial entry title' do
    # 2012 #=> 1 [0..3]
    # 2012 Environmental #=> 2 [0..17]
    # Environmental #=> 14 [5..17]
    before do
      fill_in 'keyword', with: entry_title[0..17]
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{entry_title[0..17]}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'search-drop'
      select 'LARC', from: 'provider_id'
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(27, 'Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('MIRCCMF')
      expect(page).to have_content('1')
      expect(page).to have_content('MISR FIRSTLOOK radiometric camera-by-camera Cloud Mask V001')
      expect(page).to have_content('LARC')
      # expect(page).to have_content(today_string)
    end
  end

  context 'when performing a search that has no results' do
    before do
      fill_in 'keyword', with: 'NO HITS'
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
  end
end
