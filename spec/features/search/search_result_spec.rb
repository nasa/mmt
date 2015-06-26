# MMT-22

require 'rails_helper'

describe 'Search results' do

  before :each do
    visit "/search"
  end
  context 'when performing a collection search by entry id' do
    before do
      fill_in 'entry_id', with: 'DEM_100M_1'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content('2 Results for: Entry Id: "DEM_100M_1"')
    end
    it 'displays expected Entry ID, Entry Title and Last Modified values' do
      expect(page).to have_content('C1000000719-EDF_OPS')
      expect(page).to have_content('100m Digital Elevation Model Data V001')
      expect(page).to have_content('2000-10-22')
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
