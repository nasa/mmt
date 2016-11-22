# MMT-112, MMT-113

require 'rails_helper'

describe 'Public Holdings Display', reset_provider: true do
  let(:collection_count) { 3 }

  before :all do
    3.times do
      # Create 3 collections for MMT_2 (default provider)
      publish_draft
    end
  end

  context 'when on home page and not logged in' do
    before do
      visit root_path
    end

    it 'shows public holdings' do
      expect(page).to have_css('table#public-holdings')

      within 'table#public-holdings' do
        expect(page).to have_content('MMT')
        expect(page).to have_content(collection_count)
        expect(page).to have_content('0')
      end
    end

    context 'when user clicks on provider name' do
      before do
        VCR.use_cassette('public_holdings/get_provider_description') do
          click_on 'MMT_2'
        end
      end

      it 'shows the collection page and collection list' do
        expect(page).to have_content('MMT_2')
        expect(page).to have_css('table#collections')

        expect(page).to have_selector('table#collections tbody tr', count: collection_count)
      end

      it 'does not show other providers collections' do
        expect(page).to have_no_content('ACRIM III Level 2 Daily Mean Data V001')
      end
    end

    # TODO: Where is this data coming from?
    # context 'when ECHO fails to return provider description' do
    #   before do
    #     VCR.use_cassette('public_holdings/echo_fails', record: :none) do
    #       click_on 'SEDAC'
    #     end
    #   end

    #   it 'handles failure gracefully and shows what data it can' do
    #     expect(page).to have_content('SEDAC')
    #     expect(page).to have_no_content('The Socioeconomic Data and Applications Center (SEDAC) mission is to develop and operate')
    #     expect(page).to have_css('table#collections')

    #     within 'table#collections' do
    #       expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
    #       expect(page).to have_content('0')
    #     end
    #   end
    # end
  end
end
