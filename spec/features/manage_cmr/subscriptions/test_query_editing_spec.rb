describe 'Testing Queries when editing', js: true do
  before :all do
    @subscriptions_group = create_group(members: ['testuser', 'typical'])
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['concept_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')
    
    clear_cache

    @ingest_response, @concept_response = publish_collection_draft
    @ingest_subscription_response, @search_response, _subscription = publish_new_subscription(collection_concept_id: @ingest_response['concept-id'])
  end

  after :all do
    delete_response = cmr_client.delete_subscription('MMT_2', @search_response.body['items'].first['meta']['native-id'], 'token')
    raise unless delete_response.success?

    remove_group_permissions(@subscriptions_permissions['concept_id'])
    delete_group(concept_id: @subscriptions_group['concept_id'])

    clear_cache
  end

  before do
    login

    frequency = (Rails.configuration.cmr_email_frequency / 3600.0).ceil(2)
    frequency = frequency.to_i if frequency.to_i == frequency.to_f
    @frequency = "#{frequency} #{frequency > 1 ? 'hours' : 'hour'}"

    VCR.use_cassette('urs/rarxd5taqea', record: :none) do
      visit edit_subscription_path(@ingest_subscription_response['concept_id'])
    end
  end

  context 'when the form is incomplete' do
    before do
      fill_in 'Query', with: ''
      click_on 'Estimate Notification Frequency'
    end

    it 'validates the form' do
      expect(page).to have_content('Query is required.')
    end

    it 'displays a modal with an informative message' do
      expect(page).to have_content('Please enter a valid subscription and try again.')
    end
  end

  context 'when the form is complete' do
    before do
      fill_in 'Query', with: 'day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z'
    end

    context 'when the test succeeds' do
      context 'when fewer than one granule per day is found' do
        before do
          @granules_in_test = 20
          ingest_granules(collection_entry_title: @concept_response.body['EntryTitle'], count: @granules_in_test, provider: 'MMT_2')
          wait_for_cmr
          click_on 'Estimate Notification Frequency'
        end

        it 'displays the right amount of e-mails' do
          expect(page).to have_content('Estimate Done')
          expect(page).to have_content('Query: day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z')
          expect(page).to have_content('Estimate: 1 notification/day')
          expect(page).to have_content('How was this estimate generated?')
          expect(page).to have_content("#{@granules_in_test} granules related to this query were added or updated over the last 30 days.")
          expect(page).to have_content("Notification service checks for new or updated granules once every #{@frequency}.")
          expect(page).to have_content('Estimate assumes an even distribution of new or updated granules over a period of time.')
        end
      end
    end
  end
end
