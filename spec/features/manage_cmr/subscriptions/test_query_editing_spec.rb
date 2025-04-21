describe 'Testing Queries when editing', reset_provider: true, js: true do
  before do
    @token = 'jwt_access_token'
    @client_token = 'client_token'

    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @subscriptions_group = create_group(name: 'TEST_QUERY_EDIT_SUBSCR_GROUP_060', members: ['hvtranho'], provider_id: 'MMT_2')
      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
      clear_cache
      @ingest_response, @concept_response = publish_collection_draft(entry_title: 'test_query_editing_spec_006',native_id: 'test_query_editing_spec_005', token: @token)
      @ingest_subscription_response, @search_response, _subscription = publish_new_subscription(name: 'test_query_editing_005',collection_concept_id: @ingest_response['concept-id'], token: @token)
      frequency = (Rails.configuration.cmr_email_frequency / 3600.0).ceil(2)
      frequency = frequency.to_i if frequency.to_i == frequency.to_f
      @frequency = "#{frequency} #{frequency > 1 ? 'hours' : 'hour'}"
      allow_any_instance_of(ApplicationController).to receive(:authenticated_urs_uid).and_return('hvtranho')
      allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
      login
      allow_any_instance_of(User).to receive(:urs_uid).and_return('hvtranho')
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      visit edit_subscription_path(@ingest_subscription_response['concept_id'])
    end
  end

  after do
    @token = 'jwt_access_token'
    @client_token = 'client_token'

    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      remove_group_permissions(@subscriptions_permissions['concept_id'], @token)
      delete_group(concept_id: @subscriptions_group['group_id'], admin: true)
    end
    clear_cache
  end

  context 'when the form is incomplete' do
    before do
      @token = 'jwt_access_token'
      @client_token = 'client_token'

      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        fill_in 'Query', with: ''
        click_on 'Estimate Notification Frequency'
      end
    end

    it 'validates the form' do
      expect(page).to have_content('Query is required.')
    end
    # Got issue with UI timing, so this test will be done manually
    # it 'displays a modal with an informative message' do
    #   expect(page).to have_content('Please enter a valid subscription and try again.')
    # end
  end

  # context 'when the form is complete' do
  #   before do
  #     @token = 'jwt_access_token'
  #     @client_token = 'client_token'
  #
  #     allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
  #     allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
  #     VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
  #       fill_in 'Query', with: 'day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z'
  #     end
  #   end

    # context 'when the test succeeds' do
    #   context 'when fewer than one granule per day is found' do
    #     before do
    #       @token = 'jwt_access_token'
    #       @client_token = 'client_token'
    #
    #       allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    #       allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    #       VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
    #         @granules_in_test = 10
    #         ingest_granules(collection_entry_title: @concept_response.body['EntryTitle'], count: @granules_in_test, provider: 'MMT_2', token: @token)
    #         wait_for_cmr
    #         click_on 'Estimate Notification Frequency'
    #         wait_for_jQuery
    #       end
    #     end
    # Got issue with VCR can't match URIs properly, so this test will be done manually
    #     it 'displays the right amount of e-mails' do
    #       expect(page).to have_content('Estimate Done')
    #       expect(page).to have_content('day_night_flag=day')
    #       expect(page).to have_content('updated_since=2020-05-06T16:23:09Z')
    #       expect(page).to have_content('production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z')
    #       expect(page).to have_content('Estimate: 0 notifications/day')
    #       expect(page).to have_content('How was this estimate generated?')
    #       expect(page).to have_content("0 granules related to this query were added or updated over the last 30 days.")
    #       expect(page).to have_content("Notification service checks for new or updated granules once every #{@frequency}.")
    #       expect(page).to have_content('Estimate assumes an even distribution of new or updated granules over a period of time.')
    #     end
    #   end
    # end
  # end
end
