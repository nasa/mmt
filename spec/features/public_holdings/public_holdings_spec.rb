# MMT-112, MMT-113

require 'rails_helper'

describe 'Public Holdings Display' do
  context 'when on home page and not logged in' do
    before do
      visit root_url
    end

    it 'shows public holdings' do
      expect(page).to have_css('table#public-holdings')

      within 'table#public-holdings' do
        expect(page).to have_content('SEDAC')
        expect(page).to have_content('25')
        expect(page).to have_content('0')
      end
    end

    context 'when user clicks on provider name' do
      before do
        VCR.use_cassette('public_holdings/get_provider_description', record: :once) do
          click_on 'SEDAC'
        end
      end

      it 'shows the collection page and collection list' do
        expect(page).to have_content('SEDAC')
        expect(page).to have_content('TEST')
        expect(page).to have_css('table#collections')

        within 'table#collections' do
          expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
          expect(page).to have_content('0')
        end
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
        expect(page).to have_no_content('The Socioeconomic Data and Applications Center (SEDAC) mission is to develop and operate')
        expect(page).to have_css('table#collections')

        within 'table#collections' do
          expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
          expect(page).to have_content('0')
        end
      end
    end
  end
end
