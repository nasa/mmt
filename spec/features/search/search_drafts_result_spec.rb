# MMT-11

require 'rails_helper'

describe 'Search drafts results', js: true do
  let(:short_name)  { 'id_123' }
  let(:entry_title) { 'Aircraft Flux-Filtered: Univ. Col. (FIFE)' }

  before do
    login
    create(:draft, entry_title: entry_title, short_name: short_name)
  end

  context 'when searching drafts by short name' do
    before do
      full_search(keyword: short_name, record_type: 'Drafts')
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Draft Records')
    end

    it 'displays expected data' do
      within '#search-results' do
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
      end
    end
  end

  context 'when searching drafts by entry title' do
    before do
      full_search(keyword: entry_title, record_type: 'Drafts')
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{entry_title}", 'Record State: Draft Records')
    end

    it 'displays expected data' do
      within '#search-results' do
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
      end
    end
  end
end
