describe 'Viewing a list of subscriptions' do
  before do
    login
  end

  context 'when the user has read access' do
    before do
      allow_any_instance_of(SubscriptionPolicy).to receive(:index?).and_return(true)
    end

    context 'when viewing the manage CMR page' do
      before do
        visit manage_cmr_path
      end

      it 'displays the view link' do
        expect(page).to have_css('h2.current', text: 'Manage CMR')
        expect(page).to have_content('View Subscriptions')
      end

      # The two tests in this context need to be revised when we have real endpoints
      context 'when viewing the index page' do
        before do
          visit subscriptions_path
        end

        it 'displays the dummy subscription' do
          expect(page).to have_no_link('Create a Subscription')
          expect(page).to have_content('Showing all 2 Subscriptions')

          within '.subscriptions-table' do
            expect(page).to have_content('Description')
            expect(page).to have_content('Query')
            expect(page).to have_content('Subscribers')
            expect(page).to have_content('Actions')
            expect(page).to have_content('It is a subscription')
            expect(page).to have_content('thing=stuff&&stuff_id=stuff&&stuff_color=more_stuff')
            expect(page).to have_content('fake@fake.fake')
            expect(page).to have_no_link('Edit')
            expect(page).to have_no_link('Delete')
          end
        end
      end

      context 'when viewing the index page with full permissions' do
        before do
          allow_any_instance_of(SubscriptionPolicy).to receive(:edit?).and_return(true)
          allow_any_instance_of(SubscriptionPolicy).to receive(:destroy?).and_return(true)
          allow_any_instance_of(SubscriptionPolicy).to receive(:create?).and_return(true)
          visit subscriptions_path
        end

        it 'displays the dummy subscription and links' do
          expect(page).to have_link('Create a Subscription')
          expect(page).to have_content('Showing all 2 Subscriptions')

          within '.subscriptions-table' do
            expect(page).to have_content('Description')
            expect(page).to have_content('Query')
            expect(page).to have_content('Subscribers')
            expect(page).to have_content('Actions')
            expect(page).to have_content('It is a subscription')
            expect(page).to have_content('thing=stuff&&stuff_id=stuff&&stuff_color=more_stuff')
            expect(page).to have_content('fake@fake.fake')
            expect(page).to have_link('Edit')
            expect(page).to have_link('Delete')
          end
        end
      end
    end
  end

  context 'when the user does not have read access' do
    before do
      visit subscriptions_path
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

  # context 'when there are subscriptions for multiple providers' do
  #   before do
  #     # add subscriptions for at least two providers
  #   end

  #   it 'only shows the subscriptions for the current provider' do
  #     # verify one provider's subscriptions
  #   end
  # end
end
