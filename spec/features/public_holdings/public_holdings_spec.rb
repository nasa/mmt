# MMT-112

# In the future we need to add tests for 0 public holdings and multiple pages of public holdings.
# When we have more realistic data we also need to add tests for various counts of collections and granules, and the proper formatting of those counts.

require 'rails_helper'

describe 'Public Holdings Display' do

  context 'when on home page and not logged in' do
    before :each do
      visit "/"
    end

    it 'shows public holdings' do
      expect(page).to have_css('table#public-holdings')
      expect(page.find('table#public-holdings')).to have_content('p1')
      expect(page.find('table#public-holdings')).to have_content('25')
      expect(page.find('table#public-holdings')).to have_content('0')
    end
  end

  context 'when logged in and on home page' do
    before :each do
      login
      visit "/"
    end

    it 'does not display public holdings' do
      expect(page).to_not have_css('table#public-holdings')
    end
  end

end
