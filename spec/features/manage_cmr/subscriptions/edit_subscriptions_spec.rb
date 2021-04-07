describe 'Edit/Updating Subscriptions', reset_provider: true do
  before :all do
    @subscriptions_group = create_group(members: ['testuser', 'typical'])
    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
    @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['concept_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2')
    @c_ingest_response, _c_concept_response = publish_collection_draft

    clear_cache
  end

  after :all do
    remove_group_permissions(@subscriptions_permissions['concept_id'])
    delete_group(concept_id: @subscriptions_group['concept_id'])

    clear_cache
  end

  before do
    login
    # make a record
    @ingest_response, search_response, @subscription = publish_new_subscription(collection_concept_id: @c_ingest_response['concept-id'])
    @native_id = search_response.body['items'].first['meta']['native-id']
  end

  context 'when visiting the show page and clicking the edit button' do
    before do
      VCR.use_cassette('urs/rarxd5taqea', record: :none) do
        visit subscription_path(@ingest_response['concept_id'])
        click_on 'Edit'
      end
    end

    it 'takes the user to the edit page' do
      expect(page).to have_content('Edit MMT_2 Subscription')
      expect(page).to have_field('Subscription Name', with: @subscription['Name'])
      expect(page).to have_field('Query', with: @subscription['Query'])
      expect(page).to have_field('Subscriber', with: @subscription['SubscriberId'], disabled: true)
      expect(page).to have_field('Collection Concept ID', with: @subscription['CollectionConceptId'], disabled: true)
    end
  end

  context 'when visiting the edit page' do
    before do
      # go to show page
      VCR.use_cassette('urs/rarxd5taqea', record: :none) do
        visit edit_subscription_path(@ingest_response['concept_id'])
      end
    end

    context 'when making a valid modification to a subscription' do
      before do
        @new_name = 'A Different Name'
        fill_in 'Subscription Name', with: @new_name

        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          click_on 'Submit'
        end
      end

      it 'displays a flash success' do
        expect(page).to have_content('Subscription Updated Successfully!')
      end

      it 'takes the user to the show page and has the correct data' do
        expect(page).to have_content(@new_name)
        expect(page).to have_content(@subscription['Query'])
        expect(page).to have_content(@subscription['CollectionConceptId'])
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end
    end

    context 'when using the same name for a subscription' do
      before do
        # Making a second subscription and then trying to rename the first one
        # to the name of the second one. CMR does not enforce unique names, so this
        # will succeed.
        @new_name = 'A Different Name'
        fill_in 'Subscription Name', with: @new_name
        @second_native_id = 'test_edit_id_2'

        _ingest_response, _search_response, _subscription = publish_new_subscription(name: @new_name, native_id: @second_native_id, collection_concept_id: @c_ingest_response['concept-id'])

        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          click_on 'Submit'
        end
      end

      it 'displays a flash success' do
        expect(page).to have_content('Subscription Updated Successfully!')
      end

      it 'takes the user to the show page and has the correct data' do
        expect(page).to have_content(@new_name)
        expect(page).to have_content(@subscription['Query'])
        expect(page).to have_content(@c_ingest_response['concept-id'])
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end
    end
  end
end
