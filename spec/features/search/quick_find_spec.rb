# MMT-9, MMT-22

require 'rails_helper'

results_per_page = 25

describe 'Quick Find Searching' do

  before :each do
    visit "/search"
  end
  it 'the user is on the search page' do
    expect(page).to have_content('Search Result')
  end
  context "and performing a quick find search that should return 2 hits" do
    before do
      fill_in 'entry_id', with: 'DEM_100M_1'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content('2 Results for: Entry Id: "DEM_100M_1"')
    end
    it 'finds collections' do
      expect(page).not_to have_content('No collections found')
    end
    it 'has insufficient rows to display pagination' do
      expect(page).not_to have_content("Showing records 1 - #{results_per_page} of")
    end
  end

  context "and performing a quick find search that should return at least 10 pages of hits" do
    before do
      fill_in 'entry_id', with: ''
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
    it 'finds collections' do
      expect(page).not_to have_content('No collections found')
    end
    it 'has sufficient rows to display pagination' do
      expect(page).to have_content("Showing records 1 - #{results_per_page} of")
    end
  end

  context "and performing a quick find search from that should no hits" do
    before do
      fill_in 'entry_id', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
    it 'finds no collections' do
      expect(page).to have_content('No collections found')
    end
    it 'has insufficient rows to display pagination' do
      expect(page).not_to have_content("Showing records 1 - #{results_per_page} of")
    end
  end

end
