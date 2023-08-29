describe 'Edit/Updating Subscriptions', reset_provider: true, js: true do
  before do
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    @token = 'jwt_access_token'

    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @subscriptions_group = create_group(name: 'Test_edit_subscriptions_group1222', members: ['testuser', 'ttle9', 'hvtranho'])

      # the ACL is currently configured to work like Ingest, U covers CUD (of CRUD)
      @subscriptions_permissions = add_permissions_to_group(@subscriptions_group['group_id'], ['read', 'update'], 'SUBSCRIPTION_MANAGEMENT', 'MMT_2', @token)
      @c_ingest_response, _c_concept_response = publish_collection_draft(token: @token, native_id: 'edit_subscriptions_12')

      clear_cache
    end
  end

  before do
    login
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

    allow_any_instance_of(User).to receive(:urs_uid).and_return('ttle9')
  end

  context 'when visiting the show page and clicking the edit button' do
    before do
      # make a record
      # @native_id = 'test native id'
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @ingest_response, _search_response, _subscription = publish_new_subscription(name: 'Test_edit_subscriptions_122',native_id: 'ingest_nativeId_1234', collection_concept_id: @c_ingest_response['concept-id'], subscriber_id:'ttle9', email_address:'thanhtam.t.le@nasa.gov', token:@token, query:"bounding_box=-10,-5,10,5&attribute\[\]=float,PERCENTAGE,25.5,30&entry_title=9fed60ea-b092-4cf3-83a9-7e133171f4f6f")
        visit subscription_path(@ingest_response['concept_id'])
        click_on 'Edit'
      end
    end

    it 'takes the user to the edit page' do
      expect(page).to have_content('Edit MMT_2 Subscription')
      expect(page).to have_field('Subscription Name', with: 'Test_edit_subscriptions_122')
      expect(page).to have_field('Query', with: 'bounding_box=-10,-5,10,5&attribute[]=float,PERCENTAGE,25.5,30&entry_title=9fed60ea-b092-4cf3-83a9-7e133171f4f6f')
      expect(page).to have_field('Subscriber', with: 'ttle9', disabled: true)
      expect(page).to have_field('Collection Concept ID', with: 'C1200451147-MMT_2', disabled: true)
    end
  end

  context 'when visiting the edit page' do
    before do
      # @native_id = 'test_native_id'
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @ingest_response, _search_response, _subscription = publish_new_subscription(name: 'Test_edit_subscriptions_133',native_id: 'ingest_nativeId_1234', collection_concept_id: @c_ingest_response['concept-id'], subscriber_id:'ttle9', email_address:'thanhtam.t.le@nasa.gov', token:@token, query:"bounding_box=-10,-5,10,5&attribute\[\]=float,PERCENTAGE,25.5,30&entry_title=9fed60ea-b092-4cf3-83a9-7e123777f4f6f")
        visit edit_subscription_path(@ingest_response['concept_id'])
      end
    end

    context 'when making a valid modification to a subscription' do
      before do
        @new_name = 'A Different Name'
        fill_in 'Subscription Name', with: @new_name
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_1_vcr", record: :none) do
          click_on 'Submit'
        end
      end

      it 'displays a flash success' do
        expect(page).to have_content('Subscription Updated Successfully!')
      end

      it 'takes the user to the show page and has the correct data' do
        expect(page).to have_content(@new_name)
        expect(page).to have_content(@ingest_response['Query'])
        expect(page).to have_content(@c_ingest_response['concept-id'])
        within '#subscriber' do
          expect(page).to have_content(@ingest_response['SubscriberId'])
          expect(page).to have_content(@ingest_response['EmailAddress'])
          expect(page).to have_content('ttle9')
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
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_2_vcr", record: :none) do
          click_on 'Submit'
        end
      end

      it 'displays a flash success' do
        expect(page).to have_content('Subscription Updated Successfully!')
      end

      it 'takes the user to the show page and has the correct data' do
        expect(page).to have_content(@new_name)
        expect(page).to have_content(@ingest_response['Query'])
        expect(page).to have_content(@c_ingest_response['concept-id'])
        within '#subscriber' do
          expect(page).to have_content(@ingest_response['SubscriberId'])
          expect(page).to have_content(@ingest_response['EmailAddress'])
          expect(page).to have_content('ttle9')
        end
      end
    end
  end
end
