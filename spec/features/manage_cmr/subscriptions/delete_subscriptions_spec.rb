describe 'Deleting Subscriptions', reset_provider: true, js: true do
  before do
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    @token = 'jwt_access_token'

    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @subscriptions_group = create_group(members: ['testuser', 'ttle9', 'hvtranho'])

    # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
      @c_ingest_response, _c_concept_response = publish_collection_draft
    end
    clear_cache
  end

  before do
    login
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
  end

  context 'when visiting the show page' do
    before do
      # make a record
      @native_id = 'test_native_id'
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @ingest_response, _search_response, _subscription = publish_new_subscription(native_id: @native_id, collection_concept_id: @c_ingest_response['concept-id'], subscriber_id:'ttle9', email_address:'thanhtam.t.le@nasa.gov', token:@token)

        # go to show page
        visit subscription_path(@ingest_response['concept_id'])
      end
    end

    context 'when clicking the delete link' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Delete'
        end
      end

      it 'displays delete subscription modal' do
        expect(page).to have_content('Are you sure you want to delete this subscription?')
        expect(page).to have_link('Yes')
        expect(page).to have_link('No')
      end

      context 'when clicking yes' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
            click_on 'Yes'

          end
        end

        it 'deletes a subscription' do
          expect(page).to have_content("Subscription with native-id [test_native_id] has already been deleted.")
        end
      end
    end

    # THIS TEST IS SKIPPED
    context 'when failing to delete a subscription',skip: true do
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
