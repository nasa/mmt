describe 'Searching published services', reset_provider: true, js: true do
  number = Faker::Number.number(digits: 6)
  service_name = "Service #{number}"
  long_name = "Long Detailed Description of Service #{number}"

  before :all do
    @ingest_response, _concept_response = publish_service_draft(name: service_name, long_name: long_name)

    10.times { publish_service_draft }
  end

  before do
    login

    visit manage_services_path
  end

  context 'when searching services by name' do
    before do
      fill_in 'keyword', with: service_name
      click_on 'Search Services'
    end

    it 'displays the query and service results' do
      expect(page).to have_service_search_query(1, "Keyword: #{service_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_content(service_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching services by long name' do
    before do
      fill_in 'keyword', with: long_name
      click_on 'Search Services'
    end

    it 'displays the query and service results' do
      expect(page).to have_service_search_query(1, "Keyword: #{long_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_content(service_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'search-drop'
      select 'MMT_2', from: 'provider_id'
      click_on 'Search Services'
    end

    it 'displays the query and collection results' do
      expect(page).to have_service_search_query(11, 'Provider Id: MMT_2')
    end

    it 'displays expected data' do
      expect(page).to have_content(service_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end
end
