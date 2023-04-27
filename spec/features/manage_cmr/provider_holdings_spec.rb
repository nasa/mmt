describe 'Manage CMR provider holdings', js: true do
  before do
    login
  end

  context 'when visiting the provider holdings with one available provider' do
    before do
      login(provider: 'MMT_1', providers: %w(MMT_1))

      visit provider_holdings_path
    end

    it 'displays the available provider holdings' do
      expect(page).to have_content('Provider Holdings')
      # Ensure that the user was redirected since they only have 1 provider
      expect(page.current_path).to eq(provider_holding_path('MMT_1'))
    end
  end

  context 'when visiting the provider holdings with multiple available providers' do
    before do
      login(providers: %w(MMT_1 MMT_2))

      visit provider_holdings_path
    end

    it 'displays a list of available providers' do
      within '#data-providers' do
        expect(page).to have_content('MMT_1')
        expect(page).to have_content('MMT_2')
      end
    end

    context 'when selecting a provider' do
      before do
        within '#data-providers' do
          click_on 'MMT_1'
        end
      end

      it 'displays the available provider holdings' do
        expect(page).to have_content('MMT_1 Holdings')
      end
    end
  end
end
