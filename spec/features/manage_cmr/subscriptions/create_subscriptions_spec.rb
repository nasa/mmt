# EDL Failed Test
describe 'Creating Subscriptions', reset_provider: true, skip:true do
  before do
    login
  end

  context 'when subscriptions is turned on' do
    before :all do
      VCR.use_cassette('edl', record: :new_episodes) do
        @subscriptions_group = create_group(members: ['testuser', 'typical'])
      end
      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')
      @c_ingest_response, @c_concept_response = publish_collection_draft

      clear_cache
    end

    after :all do
      remove_group_permissions(@subscriptions_permissions['concept_id'])
      VCR.use_cassette('edl', record: :new_episodes) do
        delete_group(concept_id: @subscriptions_group['group_id'])
      end

      clear_cache
    end

    context 'when visiting the new subscription form' do
      before do
        visit new_subscription_path
      end

      context 'when submitting the form without errors', js: true do
        let(:name) { "Exciting Subscription with Important Data #{SecureRandom.uuid}" }
        let(:query) { 'point=100,20&attribute[]=float,X\Y\Z,7&instrument=1B&cloud_cover=-70.0,120.0&equator_crossing_date=2000-01-01T10:00:00Z,2010-03-10T12:00:00Z&cycle[]=1&passes[0][pass]=1&passes[0][tiles]=1L,2F' }
        let(:collection_concept_id) { @c_ingest_response['concept-id'] }

        before do
          fill_in 'Query', with: query
          fill_in 'Collection Concept ID', with: collection_concept_id

          VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
            within '.subscriber-group' do
              all('.select2-container .select2-selection').first.click
            end
            page.find('.select2-search__field').native.send_keys('rarxd5taqea')

            page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
          end
        end

        context 'when submitting a subscription that succeeds' do
          before do
            fill_in 'Subscription Name', with: name
            # TODO: Remove when we can reset_provider - CMR-6332
            VCR.use_cassette('urs/rarxd5taqea', record: :none) do
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
            @native_id_failure = 'test_native_id'
            @ingest_response, _search_response, _subscription = publish_new_subscription(name: name2, query: query2, collection_concept_id: collection_concept_id, native_id: @native_id_failure)

            fill_in 'Subscription Name', with: name2
            fill_in 'Query', with: query2
            VCR.use_cassette('urs/rarxd5taqea', record: :none) do
              within '.subscription-form' do
                click_on 'Submit'
              end
            end
          end

          it 'fails to create the subscription' do
            expect(page).to have_content("The subscriber-id [rarxd5taqea] has already subscribed to the collection with concept-id [#{collection_concept_id}] using the query")
            expect(page).to have_content('Subscribers must use unique queries for each Collection.')
          end

          it 'repopulates the form with the entered values' do
            expect(page).to have_field('Subscription Name', with: name2)
            expect(page).to have_field('Query', with: query2)

            within '.select2-container' do
              expect(page).to have_css('.select2-selection__rendered', text: 'Rvrhzxhtra Vetxvbpmxf')
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
        visit manage_cmr_path
      end

      it 'does not display the Subscriptions callout box' do
        expect(page).to have_no_css('h3.eui-callout-box__title', text: 'Subscriptions')
      end
    end

    context 'when visiting the new subscription form' do
      before do
        visit new_subscription_path
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
