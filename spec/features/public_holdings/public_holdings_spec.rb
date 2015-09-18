# MMT-112, MMT-113

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
      expect(page.find('table#public-holdings')).to have_content('SEDAC')
      expect(page.find('table#public-holdings')).to have_content('25')
      expect(page.find('table#public-holdings')).to have_content('0')
    end

    context 'when user clicks on provider name' do
      before do
        VCR.use_cassette('public_holdings/get_provider_description', record: :none) do
          click_on 'SEDAC'
        end
      end

      it 'shows the collection page and collection list' do
        expect(page).to have_content('SEDAC')
        expect(page).to have_content('TEST')
        expect(page).to have_css('table#collections')
        expect(page.find('table#collections')).to have_content('ACRIM III Level 2 Daily Mean Data V001')
        expect(page.find('table#collections')).to have_content('0')
      end
    end

    context 'when ECHO fails to return provider description' do
      before do
        VCR.use_cassette('public_holdings/echo_fails', record: :none) do
          click_on 'SEDAC'
        end
      end

      it 'handles failure gracefully and shows what data it can' do
        expect(page).to have_content('SEDAC')
        expect(page).to_not have_content('The Socioeconomic Data and Applications Center (SEDAC) mission is to develop and operate')
        expect(page).to have_css('table#collections')
        expect(page.find('table#collections')).to have_content('ACRIM III Level 2 Daily Mean Data V001')
        expect(page.find('table#collections')).to have_content('0')
      end
    end

  end

end
