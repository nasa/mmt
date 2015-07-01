# MMT-22

require 'rails_helper'

describe 'Search results' do

  before :each do
    login
    visit "/search"
  end

  context 'when performing a collection search by entry id' do
    before do
      fill_in 'entry_id', with: 'doi:10.3334/ORNLDAAC/8_1'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content('1 Result for: Entry Id: "doi:10.3334/ORNLDAAC/8_1"')
    end
    it 'displays expected Entry ID, Entry Title and Last Modified values' do
      expect(page).to have_content('doi:10.3334/ORNLDAAC/8_1')
      expect(page).to have_content('Aircraft Flux-Filtered: Univ. Col. (FIFE)')
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end
    # We could add a test to actually examine the results table contents more specifically

  end

  context 'when performing a search that has no results' do
    before do
      fill_in 'entry_id', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
    # We could add a test to actually examine the results table contents more specifically
  end

end
