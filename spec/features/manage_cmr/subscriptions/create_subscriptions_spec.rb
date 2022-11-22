describe 'Creating Subscriptions', reset_provider: true do
  before do
    @token = 'jwt_access_token'
    @client_token = 'client_token'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      login
    end
    allow_any_instance_of(User).to receive(:urs_uid).and_return('hvtranho')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
  end

  context 'when subscriptions is turned on' do
    before do
      @token = 'jwt_access_token'
      @client_token = 'client_token'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @subscriptions_group = create_group(name: 'CREATE_SUBSCRIPTION_SPEC_GROUP_007', members: ['hvtranho', 'ttle9'], provider_id: 'MMT_2')
        # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
        @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
        @c_ingest_response, @c_concept_response = publish_collection_draft(entry_title: 'create_subscription_spec_007',native_id: 'create_subscription_spec_007',token: @token)
      end
      clear_cache
    end

    after do
      @token = 'jwt_access_token'
      @client_token = 'client_token'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        remove_group_permissions(@subscriptions_permissions['concept_id'], @token)
        delete_group(concept_id: @subscriptions_group['group_id'], admin: true)
      end
      clear_cache
    end

    context 'when visiting the new subscription form' do
      before do
        @token = 'jwt_access_token'
        @client_token = 'client_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit new_subscription_path
        end
      end

      context 'when submitting the form without errors', js: true do
        let(:name) { "Exciting Subscription with Important Data #{SecureRandom.uuid}" }
        let(:query) { 'point=100,20&attribute[]=float,X\Y\Z,7&instrument=1B&cloud_cover=-70.0,120.0&equator_crossing_date=2000-01-01T10:00:00Z,2010-03-10T12:00:00Z&cycle[]=1&passes[0][pass]=1&passes[0][tiles]=1L,2F' }
        let(:collection_concept_id) { @c_ingest_response['concept-id'] }

        before do
          fill_in 'Query', with: query
          fill_in 'Collection Concept ID', with: collection_concept_id

          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
            within '.subscriber-group' do
              all('.select2-container .select2-selection').first.click
            end
            page.find('.select2-search__field').native.send_keys('hvtranho')

            page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
          end
        end

        context 'when submitting a subscription that succeeds' do
          before do
            fill_in 'Subscription Name', with: name
            @token = 'jwt_access_token'
            @client_token = 'client_token'
            allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
            allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
            allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
            allow_any_instance_of(SubscriptionsController).to receive(:native_id).and_return('mmt_subscription_submit_test_success')
            # TODO: Remove when we can reset_provider - CMR-6332
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              within '.subscription-form' do
                click_on 'Submit'
              end
            end
          end

          it 'creates the subscription' do
            expect(page).to have_content('Subscription Created Successfully!')
          end
        end

        context 'when submitting a subscription that fails' do
          # Generating a genuine failure by violating uniqueness constraints
          # in the CMR.
          let(:name2) { 'Exciting Subscription with Important Data4' }
          let(:query2) { 'point=100,20&attribute[]=float,X\Y\Z,7&instrument=1B&cloud_cover=-80.0,120.0&equator_crossing_date=2000-01-01T10:00:00Z,2010-03-10T12:00:00Z&cycle[]=1' }
          before do
            @token = 'jwt_access_token'
            @client_token = 'client_token'
            allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
            allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
            allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
            allow_any_instance_of(SubscriptionsController).to receive(:native_id).and_return('mmt_subscription_submit_test_fails')
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              @native_id_failure = 'test_native_id'
              @ingest_response, _search_response, _subscription = publish_new_subscription(name: name2, query: query2, collection_concept_id: collection_concept_id, native_id: @native_id_failure, token: @token)

              fill_in 'Subscription Name', with: name2
              fill_in 'Query', with: query2
              within '.subscription-form' do
                click_on 'Submit'
              end
            end
          end

          it 'fails to create the subscription' do
            expect(page).to have_content("The subscriber-id [hvtranho] has already subscribed to the collection with concept-id [#{collection_concept_id}] using the query")
            expect(page).to have_content('Subscribers must use unique queries for each Collection.')
          end

          it 'repopulates the form with the entered values' do
            expect(page).to have_field('Subscription Name', with: name2)
            expect(page).to have_field('Query', with: query2)

            within '.select2-container' do
              expect(page).to have_css('.select2-selection__rendered', text: 'Hoan Vu Tran Ho')
            end
          end
        end
      end
    end
  end

  context 'when subscriptions is turned off' do
    before do
      allow(Mmt::Application.config).to receive(:subscriptions_enabled).and_return(false)
    end

    context 'when visiting the Manage Cmr page' do
      before do
        @token = 'jwt_access_token'
        @client_token = 'client_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit manage_cmr_path
        end
      end

      it 'does not display the Subscriptions callout box' do
        expect(page).to have_no_css('h3.eui-callout-box__title', text: 'Subscriptions')
      end
    end

    context 'when visiting the new subscription form' do
      before do
        @token = 'jwt_access_token'
        @client_token = 'client_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit new_subscription_path
        end
      end

      it 'displays the Manage Cmr page' do
        # Need to use the next line instead of the following line if js: true is on for these tests
        # expect(page).to have_css('h2.current', text: 'MANAGE CMR')
        expect(page).to have_css('h2.current', text: 'Manage CMR')

        expect(page).to have_css('h3.eui-callout-box__title', text: 'Permissions & Groups')
        expect(page).to have_css('h3.eui-callout-box__title', text: 'Orders')
      end

      it 'does not display the new subscription form' do
        expect(page).to have_no_field('Subscription Name')
        expect(page).to have_no_field('Query')
        expect(page).to have_no_field('Subscriber')
      end
    end
  end
end
