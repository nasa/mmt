require 'rails_helper'

describe 'Manage CMR provider holdings', reset_provider: true, js: true do
  before do
    login
  end

  context 'when visiting the provider holdings with one available provider' do
    before do
      user = User.first
      user.provider_id = 'MMT_1'
      user.available_providers = %w(MMT_1)
      user.save

      VCR.use_cassette('provider_holdings/mmt_1', record: :none) do
        visit provider_holdings_path
      end
    end

    it 'displays the available provider holdings' do
      expect(page).to have_content('MMT_1 Holdings')

      # Ensure that the user was redirected since they only have 1 provider
      expect(page.current_path).to eq(provider_holding_path('MMT_1'))
    end
  end

  context 'when visiting the provider holdings with multiple available providers' do
    before do
      user = User.first
      user.available_providers = %w(MMT_1 MMT_2)
      user.save

      visit provider_holdings_path
    end

    it 'displays a list of available providers' do
      within '#data-providers' do
        within all('tr')[2] do
          expect(page).to have_content('MMT_1')
        end
        within all('tr')[3] do
          expect(page).to have_content('MMT_2')
        end
      end
    end

    context 'when selecting a provider' do
      before do
        within '#data-providers' do
          VCR.use_cassette('provider_holdings/mmt_2', record: :none) do
            click_on 'MMT_2'
          end
        end
      end

      it 'displays the available provider holdings' do
        expect(page).to have_content('MMT_2 Holdings')
      end
    end
  end
end
