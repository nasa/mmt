# TODO: When CMR-6310 has been finished, we should add a test for viewing the
# subscription page with no subscriptions. Until we have the provider reset,
# that test would be flaky and fail intermittently because of CMR's update time.
# EDL Failed Test
describe 'Viewing a list of subscriptions', reset_provider: true, skip:true do
  before :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      @subscriptions_group = create_group(members: ['testuser', 'typical'])
    end
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')
    @c_ingest_response, _c_concept_response = publish_collection_draft

    clear_cache

    _ingest_response, @search_response, @subscription = publish_new_subscription(collection_concept_id: @c_ingest_response['concept-id'])
    _ingest_response2, @search_response2, @subscription2 = publish_new_subscription(collection_concept_id: @c_ingest_response['concept-id'])
  end

  after :all do
    remove_group_permissions(@subscriptions_permissions['concept_id'])
    VCR.use_cassette('edl', record: :new_episodes) do
      delete_group(concept_id: @subscriptions_group['group_id'])
    end

    clear_cache
  end

  before do
    login
  end

  context 'when the user has read access and not update access' do
    before do
      # Update is needed because both Create and Edit are checked in the code
      allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(false)
    end

    context 'when viewing the manage CMR page' do
      before do
        visit manage_cmr_path
      end

      it 'displays the view link' do
        expect(page).to have_css('h2.current', text: 'Manage CMR')
        expect(page).to have_content('View Subscriptions')
      end
    end

    context 'when viewing the index page' do
      before do
        visit subscriptions_path
      end

      it 'displays expected subscriptions without edit or delete links' do
        expect(page).to have_no_link('Create a Subscription')
        expect(page).to have_content('Showing all 2 Subscriptions')
        within '.subscriptions-table' do
          expect(page).to have_content('Name')
          expect(page).to have_content('Query')
          expect(page).to have_content('Collection Concept Id')
          expect(page).to have_content('Subscriber')
          expect(page).to have_content('Actions')
          expect(page).to have_content(@subscription['Name'])
          expect(page).to have_content(@subscription['Query'])
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['CollectionConceptId'])
          expect(page).to have_content(@subscription2['CollectionConceptId'])
          expect(page).to have_content(@subscription2['SubscriberId'])
          expect(page).to have_content(@subscription2['Name'])
          expect(page).to have_content(@subscription2['Query'])
          expect(page).to have_no_link('Edit')
          expect(page).to have_no_link('Delete')
        end
      end
    end
  end

  context 'when viewing the index page with full permissions' do
    before do
      visit subscriptions_path
    end

    it 'displays expected subscriptions and edit and delete links' do
      expect(page).to have_link('Create a Subscription')
      expect(page).to have_content('Showing all 2 Subscriptions')

      within '.subscriptions-table' do
        expect(page).to have_content('Name')
        expect(page).to have_content('Query')
        expect(page).to have_content('Collection Concept Id')
        expect(page).to have_content('Subscriber')
        expect(page).to have_content('Actions')
        expect(page).to have_content(@subscription['Name'])
        expect(page).to have_content(@subscription['Query'])
        expect(page).to have_content(@subscription['SubscriberId'])
        expect(page).to have_content(@subscription['CollectionConceptId'])
        expect(page).to have_content(@subscription2['CollectionConceptId'])
        expect(page).to have_content(@subscription2['SubscriberId'])
        expect(page).to have_content(@subscription2['Name'])
        expect(page).to have_content(@subscription2['Query'])
        expect(page).to have_link('Edit')
        expect(page).to have_link('Delete')
      end
    end
  end

  context 'when the user does not have read access' do
    before do
      # Granting read permission in CMR for verifying proper ingest, so we need
      # to return false for this test
      allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(false)
      visit subscriptions_path
    end

    it 'redirects to manage CMR' do
      expect(page).to have_content('You are not permitted to perform this action.')
      expect(page).to have_content('Data Quality Summaries')
      expect(page).to have_content('Service Management')
      expect(page).to have_content('Orders')
      expect(page).to have_content('Provider Information')
      expect(page).to have_content('Subscriptions')
      expect(page).to have_no_content('View Subscriptions')
    end
  end

  context 'when there are subscriptions for multiple providers' do
    before do
      @subscriptions_group_other_provider = create_group(provider_id: 'MMT_1', members: ['testuser', 'typical'])
      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions_other_provider = add_permissions_to_group(@subscriptions_group_other_provider['concept_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_1')
      @c_ingest_response2, _c_concept_response = publish_collection_draft
      @c_ingest_response3, _c3_concept_response = publish_collection_draft(provider_id: 'MMT_1')
      clear_cache

      _ingest_response2, @search_response3, @subscription3 = publish_new_subscription(provider: 'MMT_1', email_address: 'fake@fake.fake', query: 'polygon=10,10,30,10,30,20,10,20,10,10&equator_crossing_longitude=0,10', subscriber_id: 'fakeid', collection_concept_id: @c_ingest_response3['concept-id'])

      allow_any_instance_of(SubscriptionPolicy).to receive(:index?).and_return(true)
      visit subscriptions_path
    end

    after do
      remove_group_permissions(@subscriptions_permissions_other_provider['concept_id'])
      delete_group(concept_id: @subscriptions_group_other_provider['concept_id'])
    end

    it 'only shows the subscriptions for the current provider' do
      expect(page).to have_content('Name')
      expect(page).to have_content('Query')
      expect(page).to have_content('Collection Concept Id')
      expect(page).to have_content('Subscriber')
      expect(page).to have_content('Actions')
      expect(page).to have_content(@subscription['Name'])
      expect(page).to have_content(@subscription['Query'])
      expect(page).to have_content(@subscription['SubscriberId'])
      expect(page).to have_content(@subscription['CollectionConceptId'])
      expect(page).to have_content(@subscription2['Name'])
      expect(page).to have_content(@subscription2['Query'])
      expect(page).to have_content(@subscription2['SubscriberId'])
      expect(page).to have_content(@subscription2['CollectionConceptId'])
      expect(page).to have_no_content(@subscription3['CollectionConceptId'])
      expect(page).to have_no_content(@subscription3['SubscriberId'])
      expect(page).to have_no_content(@subscription3['Name'])
      expect(page).to have_no_content(@subscription3['Query'])
    end
  end
end

# EDL Failed Test
describe 'Subscription index page', skip:true do
  before do
    VCR.use_cassette('edl', record: :new_episodes) do
      @subscriptions_group = create_group(members: ['testuser', 'typical'])
    end
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')

    clear_cache

    login
    visit subscriptions_path
  end

  after do
    remove_group_permissions(@subscriptions_permissions['concept_id'])
    VCR.use_cassette('edl', record: :new_episodes) do
      delete_group(concept_id: @subscriptions_group['group_id'])
    end

    clear_cache
  end

  context 'when there are no subscriptions' do
    before do
      visit subscriptions_path
    end

    it 'has the expected text' do
      expect(page).to have_content('Subscription operations run periodically throughout each day. Email notifications are sent if new data matching your query is available.')
      expect(page).to have_content('No subscriptions found.')
    end
  end
end

describe 'when switching providers on the subscription index page', reset_provider: true do
  context 'when the user does not have subscription management permissions in the new provider', js: true do
    before :all do
      VCR.use_cassette('edl', record: :new_episodes) do
        @group_concept, @permission_concept = prepare_subscription_permissions(%w[read])
      end
    end

    before do
      login(provider: 'MMT_2', providers: %w[LARC MMT_2])
      visit subscriptions_path
      click_on 'profile-link'
      click_on 'Change Provider'
      select 'LARC', from: 'select_provider'
      wait_for_jQuery
    end

    it 'has an error message' do
      expect(page).to have_content('You are not permitted to perform this action.')
    end

    it 'arrives at the manage CMR page' do
      expect(page).to have_content('Provider Information')
      expect(page).to have_content('Permissions & Groups')
      expect(page).to have_content('Orders')
      expect(page).to have_content('Data Quality Summaries')
      expect(page).to have_content('Service Management')
      expect(page).to have_content('Subscriptions')
    end
  end
end
