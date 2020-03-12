describe 'Creating Subscriptions' do
  before do
    login
  end

  context 'when subscriptions is turned on' do
    context 'when visiting the new subscription form' do
      before do
        allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
        allow_any_instance_of(SubscriptionPolicy).to receive(:index?).and_return(true)

        visit new_subscription_path
      end

      it 'displays the new subscription form' do
        expect(page).to have_content('New MMT_2 Subscription')

        expect(page).to have_field('Description', type: 'textarea')
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
          expect(page).to have_content('Description is required.')
          expect(page).to have_content('Query is required.')
          expect(page).to have_content('Subscriber is required.')
        end
      end

      context 'when submitting the form without errors', js: true do
        let(:description) { 'Exciting Subscription with Important Data' }
        let(:query)       { 'collection_concept_id=C1234-MMT_2&downloadable=true' }

        before do
          fill_in 'Description', with: description
          fill_in 'Query', with: query

          VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
            within '.subscriber-group' do
              all('.select2-container .select2-selection').first.click
              # page.find('.select2-selection--single').click
            end
            page.find('.select2-search__field').native.send_keys('rarxd5taqea')

            page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
          end
        end

        context 'when submitting an subscription that succeeds' do
          before do
            # TODO: we are mocking this because there is no live endpoint yet
            success_response_body = '{"revision_id":1,"concept_id":"ES1200000000-MMT"}'
            success_response = cmr_success_response(success_response_body)
            allow_any_instance_of(Cmr::CmrClient).to receive(:create_subscription).and_return(success_response)

            VCR.use_cassette('urs/rarxd5taqea', record: :none) do
              within '.subscription-form' do
                click_on 'Submit'
              end
            end
          end

          it 'creates the subscription' do
            expect(page).to have_content('Subscription was successfully created.')
          end
        end

        context 'when submitting an subscription that fails' do
          before do
            error_response_body = '{"errors":["some error message"]}'
            error_response = cmr_fail_response(JSON.parse(error_response_body))
            allow_any_instance_of(Cmr::CmrClient).to receive(:create_subscription).and_return(error_response)

            VCR.use_cassette('urs/rarxd5taqea', record: :none) do
              within '.subscription-form' do
                click_on 'Submit'
              end
            end
          end

          it 'fails to create the subscription' do
            expect(page).to have_content('some error message')
          end

          it 'repopulates the form with the entered values' do
            expect(page).to have_field('Description', with: description)
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
        expect(page).to have_no_field('Description')
        expect(page).to have_no_field('Query')
        expect(page).to have_no_field('Subscriber')
      end
    end
  end
end
