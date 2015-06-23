# MMT-9, MMT-22

require 'rails_helper'

describe 'Quick find search' do
  context 'when not viewing the search page' do
    context 'and performing a quick find search' do
      before do
        visit '/dashboard'
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

  end
  context 'when viewing the search page' do

  end
end
