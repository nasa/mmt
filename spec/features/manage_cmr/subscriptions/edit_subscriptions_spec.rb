describe 'Edit/Updating Subscriptions' do
  before do
    login
    allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(true)
    # make a record
    @ingest_response, search_response, @subscription = publish_new_subscription
    @native_id = search_response.body['items'].first['meta']['native-id']
  end

  # TODO: using reset_provider may be cleaner than these after blocks,
  # but does not currently work. Reinvestigate after CMR-6310
  after do
    delete_response = cmr_client.delete_subscription('MMT_2', @native_id, 'token')

    raise unless delete_response.success?
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
      expect(page).to have_field('Subscriber', with: @subscription['SubscriberId'])
      expect(page).to have_field('Collection Concept ID', with: @subscription['CollectionConceptId'])
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
        @new_query = 'A Different Query'
        fill_in 'Query', with: @new_query

        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          click_on 'Submit'
        end
      end

      it 'displays a flash success' do
        expect(page).to have_content('Subscription Updated Successfully!')
      end

      it 'takes the user to the show page and has the correct data' do
        expect(page).to have_content(@subscription['Name'])
        expect(page).to have_content(@new_query)
        expect(page).to have_content(@subscription['CollectionConceptId'])
        within '#subscriber' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end
    end

    context 'when making an invalid modification to a subscription' do
      before do
        # Making a second subscription and then trying to rename the first one
        # to the name of the second one. CMR enforces unique names, so this
        # results in an error message.
        @new_name = 'A Different Query'
        fill_in 'Subscription Name', with: @new_name
        @second_native_id = 'test_edit_id_2'

        _ingest_response, _search_response, _subscription = publish_new_subscription(name: @new_name, native_id: @second_native_id)

        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          click_on 'Submit'
        end
      end

      # TODO: using reset_provider may be cleaner than these after blocks,
      # but does not currently work. Reinvestigate after CMR-6310
      after do
        delete_response = cmr_client.delete_subscription('MMT_2', @second_native_id, 'token')

        raise unless delete_response.success?
      end

      it 'fails and repopulates the form' do
        expect(page).to have_content('Edit MMT_2 Subscription')
        expect(page).to have_field('Subscription Name', with: @new_name)
        expect(page).to have_field('Query', with: @subscription['Query'])
        expect(page).to have_field('Subscriber', with: @subscription['SubscriberId'])
        expect(page).to have_field('Collection Concept ID', with: @subscription['CollectionConceptId'])
      end

      it 'displays an error message from CMR' do
        expect(page).to have_content("The Provider Id [MMT_2] and Subscription Name [#{@new_name}] combination must be unique for a given native-id")
      end
    end
  end
end