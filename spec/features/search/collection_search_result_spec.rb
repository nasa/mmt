describe 'Searching published collections', js: true, reset_provider: true do
  short_name = "Search Test Collection Short Name #{Faker::Number.number(digits: 6)}"
  entry_title = '2008 Long Description for Search Test Collection'
  version = '2008'
  provider = 'MMT_2'
  granule_count = '0'

  before :all do
    @ingest_response, @concept_response = publish_collection_draft(short_name: short_name, entry_title: entry_title, version: version)
  end

  before do
    login
    visit manage_collections_path
  end

  context 'when performing a collection search by concept_id' do
    before do
      fill_in 'keyword', with: @ingest_response['concept-id']
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{@ingest_response['concept-id']}")
    end

    it 'displays expected Short Name, Entry Title, Provider, Version, Last Modified and Granule Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
    end
  end

  context 'when performing a collection search by short name' do
    before do
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{short_name}")
    end

    it 'displays expected Short Name, Entry Title Provider, Version, Last Modified and Granule Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
    end
  end

  context 'when performing a collection search by entry title' do
    before do
      fill_in 'keyword', with: entry_title
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{entry_title}")
    end

    it 'displays expected Short Name, Entry Title, Provider, Version, Last Modified and Granule Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
    end
  end

  context 'when performing a collection search by partial entry title' do
    before do
      fill_in 'keyword', with: entry_title[0..17]
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{entry_title[0..17]}")
    end

    it 'displays expected Short Name, Entry Title, Provider, Version, Last Modified and Granule Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'search-drop'
      select 'LARC', from: 'provider_id'
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(30, 'Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('MIRCCMF')
      expect(page).to have_content('1')
      expect(page).to have_content('MISR FIRSTLOOK radiometric camera-by-camera Cloud Mask V001')
      expect(page).to have_content('LARC')
      # expect(page).to have_content(today_string)
    end
  end

  context 'when performing a collection search by short name which has granule count' do
    before do
      fill_in 'keyword', with: 'MIRCCMF'
      click_on 'Search Collections'
    end

    it 'displays list with column granule count' do
      within '#search-results thead' do
        expect(page).to have_content('Granule Count')
      end

      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content('1')
      end
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
