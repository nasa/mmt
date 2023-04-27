describe 'When Viewing Subscriptions', js:true, reset_provider: true do
  before do
    @token = 'jwt_access_token'
    @client_token = 'client_token'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @subscriptions_group = create_group(name: 'SHOW_SUBSCRIPTION_SPEC_GROUP_025', members: ['hvtranho', 'ttle9'], provider_id: 'MMT_2')
      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
      @c_ingest_response, _c_concept_response = publish_collection_draft(entry_title: 'show_subscription_spec_025',native_id: 'show_subscription_spec_025',token: @token)
      login
      allow_any_instance_of(User).to receive(:urs_uid).and_return('hvtranho')
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    end
    clear_cache
  end

  after do
    @token = 'jwt_access_token'
    @client_token = 'client_token'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      remove_group_permissions(@subscriptions_permissions['concept_id'], @token)
      delete_group(concept_id: @subscriptions_group['group_id'], admin: true)
    end

    clear_cache
  end

  context 'when visiting the show page' do
    before do
      @token = 'jwt_access_token'
      @client_token = 'client_token'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        # make a record
        @ingest_response, search_response, @subscription = publish_new_subscription(name: 'show_subsrciption_spec_020', collection_concept_id: @c_ingest_response['concept-id'], token: @token)
        @native_id = search_response.body['items'].first['meta']['native-id']
      end
    end

    context 'when the user has read access only' do
      before do
        #update grants both :edit and :delete
        allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(false)
        @token = 'jwt_access_token'
        @client_token = 'client_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        # go to show page
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit subscription_path(@ingest_response['concept_id'])
        end
      end

      it 'has the correct information' do
        expect(page).to have_content(@subscription['Name'])
        expect(page).to have_content('bounding_box=-10,-5,10,5')
        expect(page).to have_content('attribute[]=float,PERCENTAGE,25.5,30')
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Hoan Vu Tran Ho')
        end
      end

      it 'has the correct buttons' do
        expect(page).to have_no_link('Edit')
        expect(page).to have_no_link('Delete')
      end
    end

    context 'when visiting the show page with update/delete access' do
      before do
        @token = 'jwt_access_token'
        @client_token = 'client_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        # go to show page
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit subscription_path(@ingest_response['concept_id'])
        end
      end

      it 'has the correct information' do
        expect(page).to have_content(@subscription['Name'])
        expect(page).to have_content('bounding_box=-10,-5,10,5')
        expect(page).to have_content('attribute[]=float,PERCENTAGE,25.5,30')
        expect(page).to have_content(@subscription['CollectionConceptId'])
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Hoan Vu Tran Ho')
        end
      end

      it 'has the correct buttons' do
        expect(page).to have_link('Edit')
        expect(page).to have_link('Delete')
      end
    end
  end
end
