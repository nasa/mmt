describe 'When Viewing Subscriptions' do
  before :all do
    @subscriptions_group = create_group(members: ['testuser', 'typical'])
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['concept_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')

    clear_cache
  end

  after :all do
    remove_group_permissions(@subscriptions_permissions['concept_id'])
    delete_group(concept_id: @subscriptions_group['concept_id'])

    clear_cache
  end

  before do
    login
    allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)
  end

  context 'when visiting the show page' do
    before :all do
      # make a record
      @ingest_response, search_response, @subscription = publish_new_subscription(native_id: @native_id)
      @native_id = search_response.body['items'].first['meta']['native-id']
    end

    # TODO: using reset_provider may be cleaner than these after blocks,
    # but does not currently work. Reinvestigate after CMR-6310
    after :all do
      delete_response = cmr_client.delete_subscription('MMT_2', @native_id, 'token')

      raise unless delete_response.success?
    end

    context 'when the user has read access only' do
      before do
        allow_any_instance_of(SubscriptionPolicy).to receive(:edit?).and_return(false)
        allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(false)

        # go to show page
        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          visit subscription_path(@ingest_response['concept_id'])
        end
      end

      it 'has the correct information' do
        expect(page).to have_content(@subscription['Name'])
        expect(page).to have_content(@subscription['Query'])
        expect(page).to have_content(@subscription['CollectionConceptId'])
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end

      it 'has the correct buttons' do
        expect(page).to have_no_link('Edit')
        expect(page).to have_no_link('Delete')
      end
    end

    context 'when visiting the show page with update/delete access' do
      before do
        allow_any_instance_of(SubscriptionPolicy).to receive(:edit?).and_return(true)
        allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(true)
        # go to show page
        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          visit subscription_path(@ingest_response['concept_id'])
        end
      end

      it 'has the correct information' do
        expect(page).to have_content(@subscription['Name'])
        expect(page).to have_content(@subscription['Query'])
        expect(page).to have_content(@subscription['CollectionConceptId'])
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end

      it 'has the correct buttons' do
        expect(page).to have_link('Edit')
        expect(page).to have_link('Delete')
      end
    end
  end
end
