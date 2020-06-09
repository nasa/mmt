describe 'Searching published tools', reset_provider: true, js: true do
  number = Faker::Number.number(digits: 6)
  tool_name = "Tool #{number}"
  long_name = "Long Detailed Description of Tool #{number}"

  before :all do
    @ingest_response, _concept_response = publish_tool_draft(name: tool_name, long_name: long_name)

    10.times { publish_tool_draft }
  end

  before do
    login

    visit manage_tools_path
  end

  context 'when searching tools by name' do
    before do
      fill_in 'keyword', with: tool_name
      click_on 'Search Tools'
    end

    it 'displays the query and tool results' do
      expect(page).to have_tool_search_query(1, "Keyword: #{tool_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_content(tool_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching tools by long name' do
    before do
      fill_in 'keyword', with: long_name
      click_on 'Search Tools'
    end

    it 'displays the query and tool results' do
      expect(page).to have_tool_search_query(1, "Keyword: #{long_name}")
    end

    it 'displays expected Name, Long Name, Provider, and Last Modified values' do
      expect(page).to have_content(tool_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'search-drop'
      select 'MMT_2', from: 'provider_id'
      click_on 'Search Tools'
    end

    it 'displays the query and collection results' do
      expect(page).to have_tool_search_query(11, 'Provider Id: MMT_2')
    end

    it 'displays expected data' do
      expect(page).to have_content(tool_name)
      expect(page).to have_content(long_name)
      expect(page).to have_content('MMT_2')
      expect(page).to have_content(today_string)
    end
  end
end
