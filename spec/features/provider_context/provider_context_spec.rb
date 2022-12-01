describe 'Provider context', reset_provider: true, js:true do
  let(:order_guid) { 'FF330AD3-1A89-871C-AC94-B689A5C95723' }

  context 'when the user has multiple providers' do
    before do
      login(provider:nil, providers: %w(MMT_1 MMT_2))
      visit '/'
    end

    context 'when a user logs in for the first time' do
      it 'saves the users available providers' do
        expect(User.first.available_providers).to eq(%w(MMT_1 MMT_2))
      end

      it 'prompts the user to select a provider context' do
        expect(page).to have_content('Please select your provider context')
      end

      context 'when the user selects a provider context' do
        before do
          select 'MMT_1', from: 'select_provider'
          wait_for_jQuery
        end

        it 'saves the users provider' do
          expect(User.first.provider_id).to eq('MMT_1')
        end

        it 'displays the users current provider' do
          within '.eui-badge--sm.daac' do
            expect(page).to have_content('MMT_1')
          end
        end

        context 'when the user logs out and logs in again' do
          before do
            click_on 'profile-link'

            click_on 'Logout'

            login(provider: nil, providers: nil)
          end

          it 'displays their last used provider context' do
            within '.eui-badge--sm.daac' do
              expect(page).to have_content('MMT_1')
            end
          end

          # Clicking badge allows user to click to get to provider menu
          context 'when clicking on the provider badge' do
            before do
              click_on 'provider-badge-link'
            end

            it 'prompts the user to select a provider context' do
              within '#provider-context' do
                expect(page).to have_content('Please select your provider context')
              end
            end
          end
        end
      end
    end

    context 'when a user changes their provider context' do
      before do
        select 'MMT_1', from: 'select_provider'
        wait_for_jQuery

        click_on 'profile-link'
        click_on 'Change Provider'
        select 'MMT_2', from: 'select_provider'
        wait_for_jQuery
      end

      it 'saves the new provider context' do
        expect(User.first.provider_id).to eq('MMT_2')
      end

      it 'displays the new provider context' do
        within '.eui-badge--sm.daac' do
          expect(page).to have_content('MMT_2')
        end
      end

      # This is the exception case (see redirector.rb)
      context 'when the user is on the provider order details page' do
        before do
          # The order guid belongs to NSIDC_ECS
          login(provider: 'NSIDC_ECS', providers: %w(MMT_2 MMT_1 NSIDC_ECS))

          VCR.use_cassette('echo_soap/order_processing_service/provider_orders/terminal_order', record: :none) do
            visit provider_order_path(order_guid)
          end

          within '#user-info' do
            click_on 'profile-link'
            click_on 'Change Provider'
          end

          select 'MMT_1', from: 'select_provider'
          wait_for_jQuery
        end

        it 'redirects to the orders index page when switching provider context' do
          expect(page).to have_current_path(orders_path, ignore_query: true)
        end
      end

      context 'when the user is on the permissions creation page' do
        before do

          @token = 'jwt_access_token'
          allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('edl_client_token')
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
            visit permissions_path
            click_on 'Create a Permission'
          end

          within '#user-info' do
            click_on 'profile-link'
            click_on 'Change Provider'
          end

          select 'MMT_1', from: 'select_provider'
          wait_for_jQuery
        end

        it 'redirects to the permissions index page when switching provider context' do
          expect(page).to have_current_path(permissions_path, ignore_query: true)
        end
      end
    end
  end

  context 'when the user only has one provider' do
    before do
      login(providers: %w(MMT_2), provider: 'MMT_2')
      visit '/'
    end

    before :all do
      # add_provider_context_permission('MMT_2')
    end

    it 'saves the provider as the users provider' do
      expect(User.first.provider_id).to eq('MMT_2')
      expect(User.first.available_providers).to eq(['MMT_2'])
    end

    it 'displays the provider context' do
      within '.eui-badge--sm.daac' do
        expect(page).to have_content('MMT_2')
      end
    end

    context 'when a user gains a provider and refreshes their available providers' do
      before do
        click_on 'profile-link'
        click_on 'Change Provider'
        allow_any_instance_of(User).to receive(:available_providers).and_return(%w(MMT_1 MMT_2))
        click_on 'Refresh your available providers'
        wait_for_jQuery
      end

      it 'prompts the user to select their provider context' do
        expect(page).to have_content('Please select your provider context')
        expect(User.first.available_providers).to eq(%w(MMT_1 MMT_2))
      end
    end
  end

  context 'when the user has no providers' do
    before do
      login(providers: [])
      visit '/'
    end

    it 'displays a message' do
      expect(page).to have_content('You currently have no available providers. Please contact your provider administrator or the CMR OPS team to set up provider access.')
    end
  end

  context 'when the user loses a provider' do
    before do
      login(provider:nil, providers: %w(MMT_1 MMT_2))
      visit '/'
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        select 'MMT_2', from: 'select_provider'
      end
      wait_for_jQuery
      expect(page).to have_content('Create Collection Record')
    end

    context 'when the user loses a provider while logged out' do
      before do
        click_on 'profile-link'
        click_on 'Logout'
        visit'/'

      end

      context 'when a user loses their active provider' do
        before do
          login(provider:nil, providers: %w(MMT_1 NSIDC_ECS))
          visit '/'
        end

        after do
          # allow_any_instance_of(User).to receive(:available_providers).and_return(%w(MMT_1 MMT_2 NSIDC_ECS))
          # add_provider_context_permission(%w(MMT_2))
        end

        it 'deletes their current provider and shows them the provider context page' do
          expect(User.first.provider_id).to eq(nil)
          expect(User.first.available_providers).not_to include('MMT_2')

          expect(page).to have_content('Please select your provider context')
          expect(page).to have_select('select_provider', with_options: %w(MMT_1 NSIDC_ECS))
        end
      end

      context 'when a user loses an available provider' do
        before do
          login(providers: %w(MMT_1 MMT_2))
          visit '/'
        end

        after do
          # allow_any_instance_of(User).to receive(:available_providers).and_return(%w(MMT_1 MMT_2 NSIDC_ECS))
          # add_provider_context_permission(%w(NSIDC_ECS))
        end

        it 'removes their available provider' do
          expect(User.first.provider_id).to eq('MMT_2')
          expect(User.first.available_providers).not_to include('NSIDC_ECS')

          expect(page).to have_content('Create Collection Record')
          click_on 'provider-badge-link'
          expect(page).to have_select('select_provider', with_options: %w(MMT_1 MMT_2))
        end
      end
    end

    context 'when the user loses a provider while logged in' do
      context 'when a user loses their active provider' do
        before do
          allow_any_instance_of(User).to receive(:available_providers).and_return(%w(MMT_1 NSIDC_ECS))
          allow_any_instance_of(User).to receive(:provider_id).and_return(nil)
          # delete_provider_context_permission('MMT_2')
          click_on 'provider-badge-link'
          click_on 'Refresh your available providers'
          wait_for_jQuery
        end

        after do
          # add_provider_context_permission(%w(MMT_2))
        end

        it 'deletes their current provider and shows them the provider context page' do
          expect(User.first.provider_id).to eq(nil)
          expect(User.first.available_providers).not_to include('MMT_2')

          expect(page).to have_content('Please select your provider context')
          expect(page).to have_select('select_provider', with_options: %w(MMT_1 NSIDC_ECS))
        end
      end

      context 'when a user loses an available provider' do
        before do
          allow_any_instance_of(User).to receive(:available_providers).and_return(%w(MMT_1 MMT_2))
          allow_any_instance_of(User).to receive(:provider_id).and_return('MMT_2')
          # delete_provider_context_permission('NSIDC_ECS')
          click_on 'provider-badge-link'
          click_on 'Refresh your available providers'
          wait_for_jQuery
        end

        after do
          allow_any_instance_of(User).to receive(:available_providers).and_return(%w(MMT_1 MMT_2 NSIDC_ECS))
        end

        it 'removes their available provider' do
          expect(User.first.provider_id).to eq('MMT_2')
          expect(User.first.available_providers).not_to include('NSIDC_ECS')

          expect(page).to have_content('Please select your provider context. You can change your context at any point.')
          expect(page).to have_select('select_provider', with_options: %w(MMT_1 MMT_2))
        end
      end
    end
  end
end
