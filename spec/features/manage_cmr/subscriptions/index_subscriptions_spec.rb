# TODO: When CMR-6310 has been finished, we should add a test for viewing the
# subscription page with no subscriptions. Until we have the provider reset,
# that test would be flaky and fail intermittently because of CMR's update time.
describe 'Viewing a list of subscriptions', reset_provider: true, js:true do
  before do
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    @token = 'jwt_access_token'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
      @subscriptions_group = create_group(name: 'Test_subscription_group66844', members: ['testuser', 'ttle9', 'hvtranho'])

      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
      @c_ingest_response, _c_concept_response = publish_collection_draft(token: @token, native_id: 'index_subscription_1269931444')

      clear_cache

      _ingest_response, @search_response, @subscription = publish_new_subscription(name: 'Test_subscription_2345_01444', collection_concept_id: @c_ingest_response['concept-id'], subscriber_id:'ttle9', email_address:'thanhtam.t.le@nasa.gov', token:@token, query:"bounding_box=-10,-5,10,5&attribute\[\]=float,PERCENTAGE,25.5,30&entry_title=334eb338-09c8-41ef-b00f-db3b364db444", native_id: 'ingest_nativeId_12544')
      _ingest_response2, @search_response2, @subscription2 = publish_new_subscription(name: 'Test_subscription_2345_02444',collection_concept_id: @c_ingest_response['concept-id'], subscriber_id:'ttle9', email_address:'thanhtam.t.le@nasa.gov', token:@token, query:"bounding_box=-10,-5,10,5&attribute\[\]=float,PERCENTAGE,25.5,30&entry_title=9fed60ea-b092-4cf3-83a9-7e48174f4f4f", native_id: 'ingest_nativeId_13544')
    end
  end

  before do
    login
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
  end

  context 'when the user has read access and not update access' do
    before do
      # Update is needed because both Create and Edit are checked in the code
      allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(false)
    end

    context 'when viewing the manage CMR page' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
          allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
          visit manage_cmr_path
        end
      end

      it 'displays the view link' do
        expect(page).to have_css('h2.current', text: 'MANAGE CMR')
        expect(page).to have_content('View Subscriptions')
      end
    end

    context 'when viewing the index page' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
          allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
          visit subscriptions_path
        end
      end

      it 'displays expected subscriptions without edit or delete links' do
        expect(page).to have_no_link('Create a Subscription')
        expect(page).to have_content('Showing all 3 Subscriptions')
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
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
        visit subscriptions_path
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      end
    end

    it 'displays expected subscriptions and edit and delete links' do
      expect(page).to have_link('Create a Subscription')
      expect(page).to have_content('Showing all 3 Subscriptions')
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
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(false)
        visit subscriptions_path
      end
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
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
        @token = 'jwt_access_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        @subscriptions_group = create_group(name: 'Test_subscription_group331111111', members: ['testuser', 'ttle9', 'hvtranho'])
        @subscriptions_group_other_provider = create_group(provider_id: 'MMT_1')

        # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
        @subscriptions_permissions_other_provider = add_permissions_to_group(@subscriptions_group_other_provider['group_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_1', @token)
        @c_ingest_response2, _c_concept_response = publish_collection_draft(token: @token, native_id: 'ingest_nativeId_15111111')
        @c_ingest_response3, _c3_concept_response = publish_collection_draft(provider_id: 'MMT_1', token: @token, native_id: 'ingest_nativeId_15200000')

        clear_cache

        _ingest_response2, @search_response3, @subscription3 = publish_new_subscription(name: 'Test_subscription_45678_06', provider: 'MMT_1', email_address: 'thanhtam.t.le@nasa.gov', query: 'polygon=10,10,30,10,30,20,10,20,10,10&equator_crossing_longitude=0,10', subscriber_id: 'ttle9', collection_concept_id: @c_ingest_response3['concept-id'],token:@token, native_id: 'ingest_nativeId_135111111')
      end
    end

    before 'visit_subscription_path' do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_4_vcr", record: :none) do
        visit subscriptions_path
      end
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
      expect(page).to have_content(@subscription3['SubscriberId'])
      expect(page).to have_no_content(@subscription3['Name'])
      expect(page).to have_no_content(@subscription3['Query'])
    end
  end
end

describe 'Subscription index page', js:true do
  before do
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
      @token = 'jwt_access_token'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      @subscriptions_group = create_group(name: 'Test_subscription_group231', members: ['testuser', 'ttle9', 'hvtranho'])

      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)

      clear_cache

      login
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      visit subscriptions_path
    end
  end

  context 'when there are no subscriptions' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        visit subscriptions_path
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      end
    end

    it 'has the expected text' do
      expect(page).to have_content('Subscription operations run periodically throughout each day. Email notifications are sent if new data matching your query is available.')
      expect(page).to have_content('No subscriptions found.')
    end
  end
end

describe 'when switching providers on the subscription index page', reset_provider: true, js:true do
  context 'when the user does not have subscription management permissions in the new provider', js: true do
    before do
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
      @token = 'jwt_access_token'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @group_concept, @permission_concept = prepare_subscription_permissions(%w[read],'MMT_2', @token)
        login(provider: 'MMT_2', providers: %w[LARC MMT_2])
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        visit subscriptions_path
        click_on 'profile-link'
        click_on 'Change Provider'
        select 'LARC', from: 'select_provider'
        wait_for_jQuery
      end
    end

    before do

      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        login(provider: 'MMT_2', providers: %w[LARC MMT_2])
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        visit subscriptions_path
        click_on 'profile-link'
        click_on 'Change Provider'
        select 'LARC', from: 'select_provider'
        wait_for_jQuery
      end
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
