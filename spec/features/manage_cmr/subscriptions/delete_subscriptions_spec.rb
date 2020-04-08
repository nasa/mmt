describe 'Deleting Subscriptions' do
  before do
    login
    allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:show?).and_return(true)
    allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(true)
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

          wait_for_cmr
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