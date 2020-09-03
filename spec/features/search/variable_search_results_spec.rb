describe 'Searching published variables', reset_provider: true, js: true do
  variable_name = "Absorption Band Test Search Var #{Faker::Number.number(digits: 6)}"
  long_name = "Long Detailed Description of Absorption Band Test Search Var #{Faker::Number.number(digits: 6)}"
  science_keywords =
    [
      {
        'Category': 'EARTH SCIENCE',
        'Topic': 'ATMOSPHERE',
        'Term': 'AEROSOLS',
        'VariableLevel1': 'AEROSOL OPTICAL DEPTH/THICKNESS',
        'VariableLevel2': 'ANGSTROM EXPONENT'
      }
    ]

  before :all do
    ingest_collection_response, _collection_concept_response = publish_collection_draft

    @ingest_response, _concept_response = publish_variable_draft(name: variable_name, long_name: long_name, science_keywords: science_keywords, collection_concept_id: ingest_collection_response['concept-id'])

    10.times { publish_variable_draft(collection_concept_id: ingest_collection_response['concept-id']) }
  end

  before do
    login

    visit manage_variables_path
  end

  context 'when searching variables by name' do
    before do
      fill_in 'keyword', with: variable_name
      click_on 'Search Variables'
    end

    it 'displays the query and variable results' do
      expect(page).to have_variable_search_query(1, "Keyword: #{variable_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_link(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching variables by long name' do
    before do
      fill_in 'keyword', with: long_name
      click_on 'Search Variables'
    end

    it 'displays the query and variable results' do
      expect(page).to have_variable_search_query(1, "Keyword: #{long_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_link(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching variables by science keyword' do
    before do
      fill_in 'keyword', with: 'aerosol'
      click_on 'Search Variables'
    end

    it 'displays the query and variable results' do
      expect(page).to have_variable_search_query(nil, 'Keyword: aerosol')
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_link(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'search-drop'
      select 'MMT_2', from: 'provider_id'
      click_on 'Search Variables'
    end

    it 'displays the query and collection results' do
      expect(page).to have_variable_search_query(11, 'Provider Id: MMT_2')
    end

    it 'displays expected data' do
      expect(page).to have_link(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end
end
