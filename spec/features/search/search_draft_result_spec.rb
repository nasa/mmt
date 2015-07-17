# MMT-11

require 'rails_helper'

describe 'Search results' do
  entry_id = '1'
  entry_title = 'Aircraft Flux-Filtered: Univ. Col. (FIFE)'
  #concept_id = 'C1200000036-SEDAC'

  before :each do
    login
    visit "/search"
  end

  context 'when searching drafts by entry id' do
    before do
      Draft.create({:title=>entry_title})
      click_on 'Full Metadata Record Search'
      select 'Draft Records', from: 'record-state'
      select 'Entry ID', from: 'search-term-type'
      fill_in 'search-term', with: entry_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: draft-records | Entry Id: #{entry_id}")
    end

    it 'displays expected data' do
      expect(page.find('table#search-results')).to have_content(entry_id)
      expect(page.find('table#search-results')).to have_content(entry_title)
    end

  end

  context 'when searching drafts by entry title' do
    before do
      Draft.create({:title=>entry_title})
      click_on 'Full Metadata Record Search'
      select 'Draft Records', from: 'record-state'
      select 'Entry Title', from: 'search-term-type'
      fill_in 'search-term', with: entry_title
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: draft-records | Entry Title: #{entry_title}")
    end

    it 'displays expected data' do
      expect(page.find('table#search-results')).to have_content(entry_id)
      expect(page.find('table#search-results')).to have_content(entry_title)
    end

  end

  context 'when searching published and drafts by entry id' do
    before do
      Draft.create({:title=>entry_title})
      click_on 'Full Metadata Record Search'
      select 'Published & Draft Records', from: 'record-state'
      select 'Entry ID', from: 'search-term-type'
      fill_in 'search-term', with: entry_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: published-and-draft-records | Entry Id: #{entry_id}")
    end

    it 'displays expected data' do
      expect(page.find('table#search-results')).to have_content(entry_id)
      expect(page.find('table#search-results')).to have_content(entry_title)
    end

  end

end
