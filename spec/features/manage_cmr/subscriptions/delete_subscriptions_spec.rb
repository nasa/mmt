describe 'Deleting Subscriptions' do
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
  end

  context 'when visiting the show page' do
    before do
      # make a record
      @native_id = 'test_native_id'
      @ingest_response, _search_response, _subscription = publish_new_subscription(native_id: @native_id)
      # go to show page
      VCR.use_cassette('urs/rarxd5taqea', record: :none) do
        visit subscription_path(@ingest_response['concept_id'])
      end
    end

    context 'when clicking the delete link' do
      before do
        click_on 'Delete'
      end

      it 'displays delete subscription modal' do
        expect(page).to have_content('Are you sure you want to delete this subscription?')
        expect(page).to have_link('Yes')
        expect(page).to have_link('No')
      end

      context 'when clicking yes' do
        before do
          click_on 'Yes'
        end

        it 'deletes a subscription' do
          expect(page).to have_content('Subscription Deleted Successfully!')
        end
      end
    end

    context 'when failing to delete a subscription' do
      before do
        # Generate an error message by deleting it underneath the 'user'
        cmr_client.delete_subscription('MMT_2', @native_id, 'token')
        click_on 'Delete'

        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          click_on 'Yes'
        end
      end

      it 'fails to delete the record' do
        expect(page).to have_content("Concept with native-id [test_native_id] and concept-id [#{@ingest_response['concept_id']}] is already deleted.")
      end
    end
  end
end
