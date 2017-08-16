require 'rails_helper'

describe 'Searching published variables', js: true do
# describe 'Searching published variables', js: true, reset_provider: true do
  variable_name = 'Absorption Band Test Search Var 001'
  long_name = 'Long Detailed Description of Absorption Band Test Search Var 001'
  science_keywords =
    [
      {
      #   'Category': 'EARTH SCIENCE',
      #   'Topic': 'ATMOSPHERE',
      #   'Term': 'ATMOSPHERIC CHEMISTRY',
      #   'VariableLevel1': 'NITROGEN COMPOUNDS',
      #   'VariableLevel2': 'Peroxyacyl Nitrate'
      # }, {
      #   'Category': 'EARTH SCIENCE',
      #   'Topic': 'ATMOSPHERE',
      #   'Term': 'ATMOSPHERIC TEMPERATURE',
      #   'VariableLevel1': 'SURFACE TEMPERATURE',
      #   'VariableLevel2': 'MAXIMUM/MINIMUM TEMPERATURE'
      # }, {
        'Category': 'EARTH SCIENCE',
        'Topic': 'ATMOSPHERE',
        'Term': 'AEROSOLS',
        'VariableLevel1': 'AEROSOL OPTICAL DEPTH/THICKNESS',
        'VariableLevel2': 'ANGSTROM EXPONENT'
      }
    ]

  before :all do
    @ingest_response = publish_variable_draft(name: variable_name, long_name: long_name, science_keywords: science_keywords)
    puts @ingest_response
  end

  before do
    login

    visit manage_variables_path
  end

  # context 'when searching variables by concept_id' do
  #   before do
  #     fill_in 'keyword', with: @ingest_response['concept-id']
  #     click_on 'Search Variables'
  #   end
  #
  #   it 'displays the query and variable results' do
  #     expect(page).to have_variable_search_query(1, "Keyword: #{@ingest_response['concept-id']}")
  #   end
  #
  #   it 'displays expected Name, Long Name, Provider, and Last Modified values' do
  #     expect(page).to have_content(variable_name)
  #     expect(page).to have_content(long_name)
  #     expect(page).to have_content('MMT_2')
  #     # expect(page).to have_content(today_string)
  #   end
  # end

  context 'when searching variables by name' do
    before do
      fill_in 'keyword', with: variable_name
      click_on 'Search Variables'
    end

    it 'displays the query and variable results' do
      expect(page).to have_variable_search_query(1, "Keyword: #{variable_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_content(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      # expect(page).to have_content(today_string)
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
      expect(page).to have_content(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      # expect(page).to have_content(today_string)
    end
  end

  context 'when searching variables by science keyword' do
    before do
      fill_in 'keyword', with: 'aerosol'
      click_on 'Search Variables'
    end

    it 'displays the query and variable results' do
      expect(page).to have_variable_search_query(1, 'Keyword: aerosol')
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_content(variable_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      # expect(page).to have_content(today_string)
    end
  end

  # context 'when searching variables by provider' do
  #   before :all do
  #     8.times { publish_variable_draft(provider_id: 'LARC') }
  #   end
  #
  #   before do
  #     click_on 'search-drop'
  #     select 'LARC', from: 'provider_id'
  #     click_on 'Search Variables'
  #   end
  #
  #   it 'displays the query and variable results' do
  #     expect(page).to have_variable_search_query(8, 'Provider Id: LARC')
  #   end
  # end
end
