describe 'Testing Queries when creating', js: true do
  before do
    login
    allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)
    @ingest_response, @concept_response = publish_collection_draft
    visit new_subscription_path
  end

  context 'when the form is incomplete' do
    before do
      click_on 'Test Subscription'
    end

    it 'validates the form' do
      expect(page).to have_content('Subscriber is required.')
      expect(page).to have_content('Query is required.')
      expect(page).to have_content('Subscription Name is required.')
      expect(page).to have_content('Collection Concept ID is required.')
    end

    it 'displays a modal with an informative message' do
      expect(page).to have_content('Please enter a valid subscription and try again.')
    end
  end

  context 'when the form is complete' do
    before do
      fill_in 'Name', with: 'valid_test_name'
      fill_in 'Query', with: 'day_night_flag=day'
      fill_in 'Collection Concept ID', with: @ingest_response['concept-id']

      VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
        within '.subscriber-group' do
          all('.select2-container .select2-selection').first.click
          # page.find('.select2-selection--single').click
        end
        page.find('.select2-search__field').native.send_keys('rarxd5taqea')

        page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
      end
    end

    context 'when the query starts with a "?"' do
      before do
        fill_in 'Query', with: '?day_night_flag=day'
        click_on 'Test Subscription'
      end

      it 'can succeed' do
        expect(page).to have_content("Estimate Done!\n0 granules related to this query were updated over the last 30 days. Assuming an even distribution of granule updates across that time, this would have generated 0.0 emails per day.")
      end
    end

    context 'when there is an error communicating with CMR' do
      before do
        # mock bad response
      end

      it 'displays an error message on the modal' do
        
      end
    end

    context 'when the test succeeds' do
      context 'when more than max granules are found' do
        before do
          @granules_in_test = 5_000_000
          allow_any_instance_of(Cmr::CmrClient).to receive(:test_query).and_return(Cmr::Response.new(Faraday::Response.new(status: 200, body: { 'hits' => @granules_in_test } )))
          click_on 'Test Subscription'
        end

        it 'displays the right count of e-mails' do
          granule_count = (24 * 3600 / Rails.configuration.cmr_email_frequency).round(2)
          expect(page).to have_content("Estimate Done!\n#{@granules_in_test} granules related to this query were updated over the last 30 days. Assuming an even distribution of granule updates across that time, this would have generated #{granule_count} emails per day.")
        end
      end

      context 'when fewer than max granules are found' do
        before do
          @granules_in_test = 20
          ingest_granules(@concept_response.body['EntryTitle'], @granules_in_test, 'MMT_2')
          wait_for_cmr
          click_on 'Test Subscription'
        end

        it 'displays the right amount of e-mails' do
          granule_count = (@granules_in_test / 30.0 * 3600 / Rails.configuration.cmr_email_frequency).round(2)
          expect(page).to have_content("Estimate Done!\n#{@granules_in_test} granules related to this query were updated over the last 30 days. Assuming an even distribution of granule updates across that time, this would have generated #{granule_count} emails per day.")
        end
      end

      context 'when no granules are found' do
        before do
          click_on 'Test Subscription'
        end

        it 'displays the right amount of e-mails' do
          expect(page).to have_content("Estimate Done!\n0 granules related to this query were updated over the last 30 days. Assuming an even distribution of granule updates across that time, this would have generated 0.0 emails per day.")
        end
      end
    end
  end

  context 'when the user does not have permissions to view a collection' do
    before do
      # fill in form
    end

    it 'displays the correct error message to the user' do
      
    end
  end
end

describe 'Testing Queries when creating' do
  before do
    login
    allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(false)
    allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)
    # ingest a sub
  end

  after do
    # delete sub
  end

  context 'when the form is incomplete' do
    
  end

  context 'when the form is complete' do
    context 'when there is an error communicating with CMR' do
      
    end

    context 'when the test succeeds' do
      context 'when more than max granules are found' do
        
      end

      context 'when less than max granules are found' do
        
      end
    end
  end

  context 'when the user does not have permissions to view a collection' do
    
  end
end