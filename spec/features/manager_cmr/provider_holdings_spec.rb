require 'rails_helper'

describe 'Manage CMR provider holdings', js: true do
  before do
    login
  end

  context 'when visiting the provider holdings with one available provider' do
    before do
      user = User.first
      user.provider_id = 'MMT_1'
      user.available_providers = %w(MMT_1)
      user.save

      ingest_response, @concept_response = publish_draft(provider_id: 'MMT_1')

      visit manage_cmr_path

      click_on 'Holdings Report'
    end

    it 'displays the available provider holdings' do

      expect(page.current_path).to eq(provider_holding_path('MMT_1'))
      # within '#collections' do

      #     expect(page).to have_content("#{@concept_response.body['EntryTitle']} 0")

      # end
    end
  end

  context 'when visiting the provider holdings with multiple available providers' do
    before do
      user = User.first
      user.available_providers = %w(MMT_1 MMT_2)
      user.save

      @holdings = cmr_client.get_provider_holdings(false, 'MMT_2').body

      # ingest_response, @concept_response = publish_draft

      visit manage_cmr_path

      click_on 'Holdings Report'
    end

    it 'displays a list of available providers' do
      within '#provider-holdings' do
        within all('tr')[1] do
          # Don't test number of collections in MMT_1 because it will fail locally if the developer has published collections
          expect(page).to have_content('MMT_1')
        end
        within all('tr')[2] do
          expect(page).to have_content("MMT_2 #{@holdings.count} 0")
        end
      end
    end

    context 'when selecting a provider' do
      before do
        click_on 'MMT_2'
      end

      it 'displays the available provider holdings' do
        expect(page).to have_content("MMT_2 Holdings")
        # within '#collections' do
        #   within all('tr')[1] do
        #     expect(page).to have_content("#{@concept_response.body['EntryTitle']} 0")
        #   end
        # end
      end
    end
  end
end
