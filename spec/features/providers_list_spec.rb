describe 'Search Dropdown Providers list when the user is already logged in', js: true do
  new_provider = "#{Faker::Ancient.primordial.slice(0, 5).upcase}_#{Faker::Number.number(digits: 3)}"

  before do
    real_login(method: 'not_env_not_launchpad')
    visit manage_collections_path

    within '.quick-search' do
      click_on 'search-drop'
    end
  end

  context 'when then adding a new provider' do
    before do
      # unfortunately needs to be a before each to run in the right sequence
      create_provider(new_provider)
    end

    after do
      delete_provider(new_provider)
    end

    it 'does not have the new provider in the search dropdown' do
      within '.search-dropdown' do
        expect(page).to have_no_css('option', text: new_provider)
      end
    end

    context 'when the user refreshes their providers' do
      before do
        click_on 'provider-badge-link'
        click_on 'Refresh your available providers'
        wait_for_jQuery
        click_on 'Close'
      end

      it 'has the new provider in the search dropdown' do
        within '.quick-search' do
          click_on 'search-drop'
        end

        within '.search-dropdown' do
          expect(page).to have_select('provider_id', with_options: [new_provider])
        end
      end
    end
  end
end

describe 'Providers list when the user is not yet logged in' do
  new_provider = "#{Faker::Ancient.primordial.slice(0, 5).upcase}_#{Faker::Number.number(digits: 3)}"

  context 'when then adding a new provider', js: true do
    before :all do
      create_provider(new_provider)
    end

    after :all do
      delete_provider(new_provider)
    end

    context 'when the user then logs in with the provider as an available provider', js: true do
      before do
        # For some reason, if we don't use real_login, the new provider is not
        # properly returned by CMR from `cmr_client.get_providers`
        real_login(method: 'not_env_not_launchpad')
      end

      context 'when viewing the provider list in the search dropdown' do
        before do
          visit manage_collections_path

          within '.quick-search' do
            click_on 'search-drop'
          end
        end

        it 'has the newly added provider' do
          within '.search-dropdown' do
            expect(page).to have_select('provider_id', with_options: [new_provider])
          end
        end
      end
    end
  end
end
