# EDL Failed Test
describe 'Deleting Subscriptions', reset_provider: true, skip:true do
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
    before do
      # make a record
      @native_id = 'test_native_id'
      @ingest_response, _search_response, _subscription = publish_new_subscription(native_id: @native_id, collection_concept_id: @c_ingest_response['concept-id'])
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
        click_on 'Delete'

        # Using 'allow_any_instance_of' causes the after delete to fail as well.
        # Need localhost to mock the CMR delete response to be an error.
        VCR.configure do |c|
          c.ignore_localhost = false
        end

        VCR.use_cassette('subscriptions/failed_delete', erb: { concept_id: @ingest_response['concept_id'] }) do
          click_on 'Yes'
        end

        VCR.configure do |c|
          c.ignore_localhost = true
        end
      end

      it 'fails to delete the record' do
        expect(page).to have_content("Concept with native-id [test_native_id] and concept-id [#{@ingest_response['concept_id']}] is already deleted.")
      end
    end
  end
end
