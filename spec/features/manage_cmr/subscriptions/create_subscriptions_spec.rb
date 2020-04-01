describe 'Creating Subscriptions' do
  before do
    login
  end

  context 'when subscriptions is turned on' do
    context 'when visiting the new subscription form' do
      before do
        allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
        allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)

        visit new_subscription_path
      end

      it 'displays the new subscription form' do
        expect(page).to have_content('New MMT_2 Subscription')

        expect(page).to have_field('Subscription Name', type: 'textarea')
        expect(page).to have_field('Query', type: 'textarea')
        expect(page).to have_field('Subscriber', type: 'select')
      end

      context 'when submitting an invalid empty subscription form', js: true do
        before do
          within '.subscription-form' do
            click_on 'Submit'
          end
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('Subscription Name is required.')
          expect(page).to have_content('Query is required.')
          expect(page).to have_content('Subscriber is required.')
          expect(page).to have_content('Collection Concept ID is required.')
        end
      end

      context 'when submitting the form without errors', js: true do
        let(:name) { "Exciting Subscription with Important Data #{SecureRandom.uuid}" }
        let(:query) { 'collection_concept_id=C1234-MMT_2&downloadable=true' }
        let(:collection_concept_id) { 'C1234-MMT_2' }

        before do
          fill_in 'Query', with: query
          fill_in 'Collection Concept ID', with: collection_concept_id

          VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
            within '.subscriber-group' do
              all('.select2-container .select2-selection').first.click
              # page.find('.select2-selection--single').click
            end
            page.find('.select2-search__field').native.send_keys('rarxd5taqea')

            page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
          end
        end

        context 'when submitting a subscription that succeeds' do
          # TODO: When we have access to a read endpoint, we should delete the
          # subscription created in this test.
          before do
            fill_in 'Subscription Name', with: name
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
          before do
            @ingest_response, _subscription = publish_new_subscription(name: name2, query: query, collection_concept_id: collection_concept_id, native_id: 'test_native_id')

            fill_in 'Subscription Name', with: name2
            VCR.use_cassette('urs/rarxd5taqea', record: :none) do
              within '.subscription-form' do
                click_on 'Submit'
              end
            end
          end

          # Clean up the one made before the test.
          after do
            cmr_client.delete_subscription('MMT_2', 'test_native_id', 'token').inspect
          end

          it 'fails to create the subscription' do
            expect(page).to have_content('The Provider Id [MMT_2] and Subscription Name [Exciting Subscription with Important Data4] combination must be unique for a given native-id')
          end

          it 'repopulates the form with the entered values' do
            expect(page).to have_field('Subscription Name', with: name2)
            expect(page).to have_field('Query', with: query)

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
