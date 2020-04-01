describe 'Edit/Updating Subscriptions' do
  before do
    login
    allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:update?).and_return(true)
    # make a record
    @native_id = 'test_native_id'
    @ingest_response, @subscription = publish_new_subscription(native_id: @native_id)
  end

  context 'when visiting the show page and clicking the edit button' do
    before do
      VCR.use_cassette('urs/rarxd5taqea', record: :none) do
        visit subscription_path(@ingest_response['concept_id'], subscription: @subscription, native_id: @native_id)
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
        visit edit_subscription_path(@ingest_response['concept_id'], subscription: @subscription, native_id: @native_id)
      end
    end

    it 'has the right fields' do
      expect(page).to have_content('Edit MMT_2 Subscription')
      expect(page).to have_field('Subscription Name', with: @subscription['Name'])
      expect(page).to have_field('Query', with: @subscription['Query'])
      expect(page).to have_field('Subscriber', with: @subscription['SubscriberId'])
      expect(page).to have_field('Collection Concept ID', with: @subscription['CollectionConceptId'])
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
        within '#subscribers' do
          expect(page).to have_content(@subscription['SubscriberId'])
          expect(page).to have_content(@subscription['EmailAddress'])
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end
    end

    context 'when making an invalid modification to a subscription' do
      before do
        @new_name = 'A Different Query'
        fill_in 'Subscription Name', with: @new_name
        @second_native_id = 'test_edit_id_2'

        @ingest_response, @subscription = publish_new_subscription(name: @new_name, native_id: @second_native_id)

        VCR.use_cassette('urs/rarxd5taqea', record: :none) do
          click_on 'Submit'
        end
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