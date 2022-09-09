describe 'When Viewing Subscriptions', js:true, reset_provider: true do
  before :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      @subscriptions_group = create_group(members: ['testuser', 'typical'])
    end
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')
    @c_ingest_response, _c_concept_response = publish_collection_draft

    clear_cache
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

  context 'when visiting the show page' do
    before :all do
      # make a record
      @ingest_response, search_response, @subscription = publish_new_subscription(native_id: @native_id, collection_concept_id: @c_ingest_response['concept-id'])
      @native_id = search_response.body['items'].first['meta']['native-id']
    end

    context 'when the user has read access only' do
      before do
        #update grants both :edit and :delete
        allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(false)

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
