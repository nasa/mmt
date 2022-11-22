describe 'Testing Queries when creating Subscriptions', reset_provider: true, js: true do
  before do
    @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjc0MjQ0NzA4LCJpYXQiOjE2NjkwNjA3MDgsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.DbId48dKbMlWuIWgIQfBF5E068LCBQ2YQJJhOdWxul5yvkzmpr4s2DCG7RrtIuZ5VKghUDKd1a34PXO6m0-nYE2zyhTgaB5SpH0YJbhY8oYtthmx4cONbhaIi0cJ6jTX4HyJqN51Sa-8YFOiJmCG1fQXRnTu_EM-nIwfUuo3b_8rad0yzc9e5uBGxia-WOyraELhyQbA1xUj_r_WkZ1Jspe_oyBz0gBbVNcJwLEIFWCxlM8c-SC8NdwHZ1q_6cZ5yQaA2UjM6N7hBT_8P0gGo-AF6C02mCYl4pg7HXTXjrpNQdwPg4tbSgnUpkNreGeCL3ER6kKXSz91oofGQI6oxw'
    @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @subscriptions_group = create_group(name: 'TEST_QUERY_SUBSCR_GROUP_030', members: ['hvtranho'], provider_id: 'MMT_2')
      # cmr_client.delete_permission('ACL1200451187-CMR', @token)
      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['update', 'read'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
      login
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      allow_any_instance_of(User).to receive(:urs_uid).and_return('hvtranho')
      @ingest_response, @concept_response = publish_collection_draft(entry_title: 'test_query_spec_entry_id_030',native_id: 'test_query_spec_native_id_030',token: @token)
      frequency = (Rails.configuration.cmr_email_frequency / 3600.0).ceil(2)
      frequency = frequency.to_i if frequency.to_i == frequency.to_f
      @frequency = "#{frequency} #{frequency > 1 ? 'hours' : 'hour'}"
      visit new_subscription_path
    end
    clear_cache
  end

  after do
    @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjc0MjQ0NzA4LCJpYXQiOjE2NjkwNjA3MDgsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.DbId48dKbMlWuIWgIQfBF5E068LCBQ2YQJJhOdWxul5yvkzmpr4s2DCG7RrtIuZ5VKghUDKd1a34PXO6m0-nYE2zyhTgaB5SpH0YJbhY8oYtthmx4cONbhaIi0cJ6jTX4HyJqN51Sa-8YFOiJmCG1fQXRnTu_EM-nIwfUuo3b_8rad0yzc9e5uBGxia-WOyraELhyQbA1xUj_r_WkZ1Jspe_oyBz0gBbVNcJwLEIFWCxlM8c-SC8NdwHZ1q_6cZ5yQaA2UjM6N7hBT_8P0gGo-AF6C02mCYl4pg7HXTXjrpNQdwPg4tbSgnUpkNreGeCL3ER6kKXSz91oofGQI6oxw'
    @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
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
      @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjc0MjQ0NzA4LCJpYXQiOjE2NjkwNjA3MDgsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.DbId48dKbMlWuIWgIQfBF5E068LCBQ2YQJJhOdWxul5yvkzmpr4s2DCG7RrtIuZ5VKghUDKd1a34PXO6m0-nYE2zyhTgaB5SpH0YJbhY8oYtthmx4cONbhaIi0cJ6jTX4HyJqN51Sa-8YFOiJmCG1fQXRnTu_EM-nIwfUuo3b_8rad0yzc9e5uBGxia-WOyraELhyQbA1xUj_r_WkZ1Jspe_oyBz0gBbVNcJwLEIFWCxlM8c-SC8NdwHZ1q_6cZ5yQaA2UjM6N7hBT_8P0gGo-AF6C02mCYl4pg7HXTXjrpNQdwPg4tbSgnUpkNreGeCL3ER6kKXSz91oofGQI6oxw'
      @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        click_on 'Estimate Notification Frequency'
        wait_for_jQuery
      end
    end

    it 'validates the form' do
      expect(page).to have_content('Subscriber is required.')
      expect(page).to have_content('Query is required.')
      expect(page).to have_content('Subscription Name is required.')
      expect(page).to have_content('Collection Concept ID is required.')
    end

    it 'displays a modal with an informative message' do
      expect(page).to have_content('Please enter a valid subscription and try again.')
    end
  end

  context 'when the form is complete' do
    before do
      fill_in 'Name', with: 'valid_test_name'
      fill_in 'Query', with: 'day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z'
      fill_in 'Collection Concept ID', with: @ingest_response['concept-id']
      @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjc0MjQ0NzA4LCJpYXQiOjE2NjkwNjA3MDgsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.DbId48dKbMlWuIWgIQfBF5E068LCBQ2YQJJhOdWxul5yvkzmpr4s2DCG7RrtIuZ5VKghUDKd1a34PXO6m0-nYE2zyhTgaB5SpH0YJbhY8oYtthmx4cONbhaIi0cJ6jTX4HyJqN51Sa-8YFOiJmCG1fQXRnTu_EM-nIwfUuo3b_8rad0yzc9e5uBGxia-WOyraELhyQbA1xUj_r_WkZ1Jspe_oyBz0gBbVNcJwLEIFWCxlM8c-SC8NdwHZ1q_6cZ5yQaA2UjM6N7hBT_8P0gGo-AF6C02mCYl4pg7HXTXjrpNQdwPg4tbSgnUpkNreGeCL3ER6kKXSz91oofGQI6oxw'
      @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        within '.subscriber-group' do
          all('.select2-container .select2-selection').first.click
        end
        page.find('.select2-search__field').native.send_keys('hvtranho')

        page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
      end
    end

    # context 'when the query starts with a "?"' do
    #   before do
    #     @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjczODg4MTI1LCJpYXQiOjE2Njg3MDQxMjUsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.FxXUUeX71oazuafGetO8yu16kGFhNwZvxcAwDUf-i4afG1hyik0Ye62kFZXgVXekseP0lH9nnoaU0Szto7UVE95mP9TIGsZr4P1vUvUcVPAat1-qqyDOF8MtAlNGw7z_54i_ciSHuBJbUJGcXnFA0ux-4tX9DDEJnRjnDVu5KfityaGgZXMqKQkZ3Nx00lSR4IfSKG6ayxTT-7D-6wuJ4qOxQQ-LxxB49JRkmr9Dl_ZQT5nVpvHI4dxqcysQSTVivPRDZ5odCi6BhEgItZrpltGwOsodtJXCcl60xrVl26ngmk1qxejcK_ta1VWtobpsEPeLE7SdDFUN1j4fAiS97Q'
    #     @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
    #     allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    #     allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    #     allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    #     VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
    #       @granules_in_test = 40
    #       ingest_granules(collection_entry_title: @concept_response.body['EntryTitle'], count: @granules_in_test, provider: 'MMT_2', token: @token)
    #       wait_for_cmr
    #       fill_in 'Query', with: '?day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z'
    #       click_on 'Estimate Notification Frequency'
    #       wait_for_jQuery
    #     end
    #   end
    #
    #   it 'displays the right number of e-mails' do
    #     expect(page).to have_content('Estimate Done')
    #     expect(page).to have_content('Query: ?day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z')
    #     expect(page).to have_content("Estimate: #{(@granules_in_test / 30.0).ceil} notifications/day")
    #     expect(page).to have_content('How was this estimate generated?')
    #     expect(page).to have_content("#{@granules_in_test} granules related to this query were added or updated over the last 30 days.")
    #     expect(page).to have_content("Notification service checks for new or updated granules once every #{@frequency}.")
    #     expect(page).to have_content('Estimate assumes an even distribution of new or updated granules over a period of time.')
    #   end
    # end

    context 'when there is an error communicating with CMR' do
      before do
        @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjc0MjQ0NzA4LCJpYXQiOjE2NjkwNjA3MDgsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.DbId48dKbMlWuIWgIQfBF5E068LCBQ2YQJJhOdWxul5yvkzmpr4s2DCG7RrtIuZ5VKghUDKd1a34PXO6m0-nYE2zyhTgaB5SpH0YJbhY8oYtthmx4cONbhaIi0cJ6jTX4HyJqN51Sa-8YFOiJmCG1fQXRnTu_EM-nIwfUuo3b_8rad0yzc9e5uBGxia-WOyraELhyQbA1xUj_r_WkZ1Jspe_oyBz0gBbVNcJwLEIFWCxlM8c-SC8NdwHZ1q_6cZ5yQaA2UjM6N7hBT_8P0gGo-AF6C02mCYl4pg7HXTXjrpNQdwPg4tbSgnUpkNreGeCL3ER6kKXSz91oofGQI6oxw'
        @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          # policy mock is needed here because of the specific cmr check, without this the second rspec mock will not be able to match correctly
          allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(true)
          cmr_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse('{"errors": ["One of parameters [user_type] or [user_id] are required."]}'), response_headers: {}))
          allow_any_instance_of(Cmr::CmrClient).to receive(:check_user_permissions).with({ concept_id: @ingest_response['concept-id'], user_id: 'hvtranho' }, @token).and_return(cmr_response)
          click_on 'Estimate Notification Frequency'
          wait_for_jQuery
        end
      end

      it 'displays an error message on the modal' do
        expect(page).to have_content("An error occurred while checking the user's permissions: One of parameters [user_type] or [user_id] are required.")
      end
    end

    # context 'when the test succeeds' do
    #   context 'when more than max granules are found' do
    #     before do
    #       @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjczODg4MTI1LCJpYXQiOjE2Njg3MDQxMjUsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.FxXUUeX71oazuafGetO8yu16kGFhNwZvxcAwDUf-i4afG1hyik0Ye62kFZXgVXekseP0lH9nnoaU0Szto7UVE95mP9TIGsZr4P1vUvUcVPAat1-qqyDOF8MtAlNGw7z_54i_ciSHuBJbUJGcXnFA0ux-4tX9DDEJnRjnDVu5KfityaGgZXMqKQkZ3Nx00lSR4IfSKG6ayxTT-7D-6wuJ4qOxQQ-LxxB49JRkmr9Dl_ZQT5nVpvHI4dxqcysQSTVivPRDZ5odCi6BhEgItZrpltGwOsodtJXCcl60xrVl26ngmk1qxejcK_ta1VWtobpsEPeLE7SdDFUN1j4fAiS97Q'
    #       @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
    #       allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    #       allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    #       allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    #       VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
    #         @granules_in_test = 5_000_000
    #         allow_any_instance_of(Cmr::CmrClient).to receive(:test_query).and_return(Cmr::Response.new(Faraday::Response.new(status: 200, body: { 'hits' => @granules_in_test } )))
    #         click_on 'Estimate Notification Frequency'
    #         wait_for_jQuery
    #       end
    #     end
    #
    #     it 'displays the right count of e-mails' do
    #       granule_count = (24 * 3600 / Rails.configuration.cmr_email_frequency).ceil
    #       expect(page).to have_content('Estimate Done')
    #       expect(page).to have_content("Estimate: #{granule_count} notifications/day")
    #       expect(page).to have_content('How was this estimate generated?')
    #       expect(page).to have_content("#{@granules_in_test} granules related to this query were added or updated over the last 30 days.")
    #       expect(page).to have_content("Notification service checks for new or updated granules once every #{@frequency}.")
    #       expect(page).to have_content('Estimate assumes an even distribution of new or updated granules over a period of time.')
    #     end
    #   end
    #
    #   context 'when fewer than one granule per day are found' do
    #     before do
    #       @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjczODg4MTI1LCJpYXQiOjE2Njg3MDQxMjUsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.FxXUUeX71oazuafGetO8yu16kGFhNwZvxcAwDUf-i4afG1hyik0Ye62kFZXgVXekseP0lH9nnoaU0Szto7UVE95mP9TIGsZr4P1vUvUcVPAat1-qqyDOF8MtAlNGw7z_54i_ciSHuBJbUJGcXnFA0ux-4tX9DDEJnRjnDVu5KfityaGgZXMqKQkZ3Nx00lSR4IfSKG6ayxTT-7D-6wuJ4qOxQQ-LxxB49JRkmr9Dl_ZQT5nVpvHI4dxqcysQSTVivPRDZ5odCi6BhEgItZrpltGwOsodtJXCcl60xrVl26ngmk1qxejcK_ta1VWtobpsEPeLE7SdDFUN1j4fAiS97Q'
    #       @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
    #       allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    #       allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    #       allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    #       VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
    #         @granules_in_test = 20
    #         ingest_granules(collection_entry_title: @concept_response.body['EntryTitle'], count: @granules_in_test, provider: 'MMT_2', token: @token)
    #         wait_for_cmr
    #         click_on 'Estimate Notification Frequency'
    #         wait_for_jQuery
    #       end
    #     end
    #
    #     it 'displays the right amount of e-mails' do
    #       expect(page).to have_content('Estimate Done')
    #       expect(page).to have_content("Estimate: 0 notification/day")
    #       expect(page).to have_content('How was this estimate generated?')
    #       expect(page).to have_content("#{@granules_in_test} granules related to this query were added or updated over the last 30 days.")
    #       expect(page).to have_content("Notification service checks for new or updated granules once every #{@frequency}.")
    #       expect(page).to have_content('Estimate assumes an even distribution of new or updated granules over a period of time.')
    #     end
    #   end
    #
    #   context 'when no granules are found' do
    #     before do
    #       @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjczODg4MTI1LCJpYXQiOjE2Njg3MDQxMjUsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.FxXUUeX71oazuafGetO8yu16kGFhNwZvxcAwDUf-i4afG1hyik0Ye62kFZXgVXekseP0lH9nnoaU0Szto7UVE95mP9TIGsZr4P1vUvUcVPAat1-qqyDOF8MtAlNGw7z_54i_ciSHuBJbUJGcXnFA0ux-4tX9DDEJnRjnDVu5KfityaGgZXMqKQkZ3Nx00lSR4IfSKG6ayxTT-7D-6wuJ4qOxQQ-LxxB49JRkmr9Dl_ZQT5nVpvHI4dxqcysQSTVivPRDZ5odCi6BhEgItZrpltGwOsodtJXCcl60xrVl26ngmk1qxejcK_ta1VWtobpsEPeLE7SdDFUN1j4fAiS97Q'
    #       @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
    #       allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    #       allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
    #       allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    #       VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
    #         click_on 'Estimate Notification Frequency'
    #         wait_for_jQuery
    #       end
    #     end
    #
    #     it 'displays the right amount of e-mails' do
    #       expect(page).to have_content('Estimate Done')
    #       expect(page).to have_content("Estimate: 0 notifications/day")
    #       expect(page).to have_content('How was this estimate generated?')
    #       expect(page).to have_content("0 granules related to this query were added or updated over the last 30 days.")
    #       expect(page).to have_content("Notification service checks for new or updated granules once every #{@frequency}.")
    #       expect(page).to have_content('Estimate assumes an even distribution of new or updated granules over a period of time.')
    #     end
    #   end
    # end
  end

  context 'when the user does not have permissions to view a collection' do
    before do
      @token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imh2dHJhbmhvIiwiZXhwIjoxNjc0MjQ0NzA4LCJpYXQiOjE2NjkwNjA3MDgsImlzcyI6IkVhcnRoZGF0YSBMb2dpbiJ9.DbId48dKbMlWuIWgIQfBF5E068LCBQ2YQJJhOdWxul5yvkzmpr4s2DCG7RrtIuZ5VKghUDKd1a34PXO6m0-nYE2zyhTgaB5SpH0YJbhY8oYtthmx4cONbhaIi0cJ6jTX4HyJqN51Sa-8YFOiJmCG1fQXRnTu_EM-nIwfUuo3b_8rad0yzc9e5uBGxia-WOyraELhyQbA1xUj_r_WkZ1Jspe_oyBz0gBbVNcJwLEIFWCxlM8c-SC8NdwHZ1q_6cZ5yQaA2UjM6N7hBT_8P0gGo-AF6C02mCYl4pg7HXTXjrpNQdwPg4tbSgnUpkNreGeCL3ER6kKXSz91oofGQI6oxw'
      @client_token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2OTgyODEyMiwiaWF0IjoxNjY4NTMyMTIyLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.kufh1GEAHMNMe-j9xJwAtiYR8MX-jnAPT9V7U0NVB2HSocOwSD2JfsVwrkFaKQqHug_DPyEmMbwWCe6aR7Tkdpb7-vq6KUxMPOdu3Kx3kNxhloq3_Rhv9Ob82UlzOsPhHhWWpYPGYpzh_kI1PJveWqSWtTsK8u2WzbfYYwYj5SNRhGgdCg2NJsSbkg6eB4PfgXMBl6vyY-K_TLkKVYHp7ScPyxhRZMyQPagLJOmjEf3Xg6nM4tkjZrBb04N3QEsXimEmu1IJO3whgJ8cC1cMbFnqL5P5qDWE0wQ-fHfvnMndu0j-BsafQfgpQBmsDV-l7tlF7nK3bBYjxW0oHkHUwQ'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@client_token)
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @ingest_response2, _concept_response = publish_collection_draft(provider_id: 'NSIDC_ECS', suppress_concept_query_error: true, entry_title: 'test_query_spec_entry_id_050',native_id: 'test_query_spec_native_id_050', token: @token)
        fill_in 'Name', with: 'valid_test_name'
        fill_in 'Query', with: 'day_night_flag=day&updated_since=2020-05-06T16:23:09Z&production_date[]=2000-01-01T10:00:00Z,2021-03-10T12:00:00Z'
        fill_in 'Collection Concept ID', with: @ingest_response2['concept-id']
        VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
          within '.subscriber-group' do
            all('.select2-container .select2-selection').first.click
          end
          page.find('.select2-search__field').native.send_keys('rarxd5taqea')

          page.find('ul#select2-subscriber-results li.select2-results__option--highlighted').click
        end
        click_on 'Estimate Notification Frequency'
        wait_for_jQuery
      end
    end

    it 'displays the correct error message to the user' do
      expect(page).to have_content("Estimate failed.\nThe subscriber does not have access to the specified collection.")
    end
  end
end
