# TODO: When CMR-6310 has been finished, we should add a test for viewing the
# subscription page with no subscriptions. Until we have the provider reset,
# that test would be flaky and fail intermittently because of CMR's update time.

describe 'Viewing a list of subscriptions' do
  before :all do
    @subscriptions_group = create_group(members: ['testuser', 'typical'])
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['concept_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')

    clear_cache

    _ingest_response, @search_response, @subscription = publish_new_subscription
    _ingest_response2, @search_response2, @subscription2 = publish_new_subscription
  end

  after :all do
    # TODO: using reset_provider may be cleaner than these after blocks,
    # but does not currently work. Reinvestigate after CMR-6310
    delete_response1 = cmr_client.delete_subscription('MMT_2', @search_response.body['items'].first['meta']['native-id'], 'token')
    delete_response2 = cmr_client.delete_subscription('MMT_2', @search_response2.body['items'].first['meta']['native-id'], 'token')
    raise unless delete_response1.success? && delete_response2.success?

    remove_group_permissions(@subscriptions_permissions['concept_id'])
    delete_group(concept_id: @subscriptions_group['concept_id'])

    clear_cache
  end

  before do
    login
  end

  context 'when the user has read access' do
    before do
      allow_any_instance_of(SubscriptionPolicy).to receive(:index?).and_return(true)
      allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(false)
      #allow_any_instance_of(SubscriptionPolicy).to receive(:edit?).and_return(false)
      #allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(false)
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

      # These tests can be improved when we can reset_provider. They should have
      # only 2 subscriptions on them, but if the subscription tests are run
      # together, CMR does not always finish deleting subscriptions from other
      # tests before starting this one, so it fails at the commented out line.
      it 'displays expected subscriptions without edit or delete links' do
        expect(page).to have_no_link('Create a Subscription')
        # expect(page).to have_content('Showing all 2 Subscriptions')

        within '.subscriptions-table' do
          expect(page).to have_content('Name')
          expect(page).to have_content('Query')
          expect(page).to have_content('Collection Concept Id')
          expect(page).to have_content('Subscribers')
          expect(page).to have_content('Actions')
          expect(page).to have_content(@subscription['Name'])
          expect(page).to have_content(@subscription['Query'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content(@subscription['CollectionConceptId'])
          expect(page).to have_content(@subscription2['CollectionConceptId'])
          expect(page).to have_content(@subscription2['EmailAddress'])
          expect(page).to have_content(@subscription2['Name'])
          expect(page).to have_content(@subscription2['Query'])
          expect(page).to have_no_link('Edit')
          expect(page).to have_no_link('Delete')
        end
      end
    end

    context 'when viewing the index page with full permissions' do
      before do
        allow_any_instance_of(SubscriptionPolicy).to receive(:edit?).and_return(true)
        allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(true)
        allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(true)
        allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
        visit subscriptions_path
      end

      # These tests can be improved when we can reset_provider. They should have
      # only 2 subscriptions on them, but if the subscription tests are run
      # together, CMR does not always finish deleting subscriptions from other
      # tests before starting this one, so it fails at the commented out line.
      it 'displays expected subscriptions and edit and delete links' do
        expect(page).to have_link('Create a Subscription')
        # expect(page).to have_content('Showing all 2 Subscriptions')

        within '.subscriptions-table' do
          expect(page).to have_content('Name')
          expect(page).to have_content('Query')
          expect(page).to have_content('Collection Concept Id')
          expect(page).to have_content('Subscribers')
          expect(page).to have_content('Actions')
          expect(page).to have_content(@subscription['Name'])
          expect(page).to have_content(@subscription['Query'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content(@subscription['CollectionConceptId'])
          expect(page).to have_content(@subscription2['CollectionConceptId'])
          expect(page).to have_content(@subscription2['EmailAddress'])
          expect(page).to have_content(@subscription2['Name'])
          expect(page).to have_content(@subscription2['Query'])
          expect(page).to have_link('Edit')
          expect(page).to have_link('Delete')
        end
      end
    end
  end

  context 'when the user does not have read access' do
    before do
      # Granting read permission in CMR for verifying proper ingest, so we need
      # to return false for this test
      allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(false)
      allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(false)
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
      @subscriptions_group = create_group(provider_id: 'MMT_1', members: ['testuser', 'typical'])
      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['concept_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_1')

      clear_cache

      _ingest_response, @search_response, @subscription = publish_new_subscription
      _ingest_response2, @search_response2, @subscription2 = publish_new_subscription(provider: 'MMT_1', email_address: 'fake@fake.fake', query: 'polygon=10,10,30,10,30,20,10,20,10,10&equator_crossing_longitude=0,10')

      allow_any_instance_of(SubscriptionPolicy).to receive(:index?).and_return(true)
      visit subscriptions_path
    end

    # TODO: using reset_provider may be cleaner than these after blocks,
    # but does not currently work. Reinvestigate after CMR-6310
    after do
      delete_response1 = cmr_client.delete_subscription('MMT_2', @search_response.body['items'].first['meta']['native-id'], 'token')
      delete_response2 = cmr_client.delete_subscription('MMT_1', @search_response2.body['items'].first['meta']['native-id'], 'token')
      raise unless delete_response1.success? && delete_response2.success?

      remove_group_permissions(@subscriptions_permissions['concept_id'])
      delete_group(concept_id: @subscriptions_group['concept_id'])

      clear_cache
    end

    it 'only shows the subscriptions for the current provider' do
      expect(page).to have_content('Name')
      expect(page).to have_content('Query')
      expect(page).to have_content('Collection Concept Id')
      expect(page).to have_content('Subscribers')
      expect(page).to have_content('Actions')
      expect(page).to have_content(@subscription['Name'])
      expect(page).to have_content(@subscription['Query'])
      expect(page).to have_content(@subscription['EmailAddress'])
      expect(page).to have_content(@subscription['CollectionConceptId'])
      expect(page).to have_no_content(@subscription2['CollectionConceptId'])
      expect(page).to have_no_content(@subscription2['EmailAddress'])
      expect(page).to have_no_content(@subscription2['Name'])
      expect(page).to have_no_content(@subscription2['Query'])
    end
  end
end

describe 'when switching providers on the subscription index page' do
  context 'when the user does not have subscription management permissions in the new provider', js: true do
    before do
      login(provider: 'MMT_2', providers: %w[MMT_1 MMT_2])

      @group_concept, @permission_concept = prepare_subscription_permissions(%w[read])
      visit subscriptions_path

      click_on 'profile-link'
      click_on 'Change Provider'
      select 'MMT_1', from: 'select_provider'
      wait_for_jQuery
    end

    # TODO: Remove when reset provider works
    after do
      delete_group(concept_id: @group_concept)
      remove_group_permissions(@permission_concept)
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
