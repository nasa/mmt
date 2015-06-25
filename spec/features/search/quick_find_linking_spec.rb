# MMT-9, MMT-22

require 'rails_helper'

results_per_page = 25

describe 'Quick Find linking to search page' do

  context 'When ' do
    ['/dashboard', '/search'].each do |page_name|
      before :each do
        visit "#{page_name}"
      end
      context " performing a quick find search from #{page_name} that should return 2 hits" do
        before do
          fill_in 'entry_id', with: 'DEM_100M_1'
          click_on 'Find'
        end
        it 'redirects the user to the search page' do
          expect(page).to have_content('Search Result')
        end
        it 'displays collection results' do
          expect(page).to have_content('2 Results for: Entry Id: "DEM_100M_1"')
        end
      end

      context "and performing a quick find search from #{page_name} that should return at least 10 pages of hits" do
        before do
          fill_in 'entry_id', with: ''
          click_on 'Find'
        end
        it 'redirects the user to the search page' do
          expect(page).to have_content('Search Result')
        end
        it 'has sufficient rows to display pagination' do
          expect(page).to have_content("Showing records 1 - #{results_per_page} of")
        end
      end

      context "and performing a quick find search from #{page_name} that should have no hits" do
        before do
          fill_in 'entry_id', with: 'NO HITS'
          click_on 'Find'
        end
        it 'redirects the user to the search page' do
          expect(page).to have_content('Search Result')
        end
        it 'has insufficient rows to display pagination' do
          expect(page).not_to have_content("Showing records 1 - #{results_per_page} of")
        end
      end

    end
  end
end
