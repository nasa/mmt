describe 'User Permissions for Non-NASA Workflow in MMT', js: true do
  before do
    allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_user?).and_return(true)
    login
  end

  context 'when viewing the manage collections page' do
    before do
      visit manage_collections_path
    end

    it 'the user cannot see the Manage Proposals tab' do
      expect(page).to have_link('Manage Collections')
      expect(page).to have_link('Manage Variables')
      expect(page).to have_link('Manage Services')
      expect(page).to have_link('Manage CMR')
      expect(page).to have_no_link('Manage Proposals')

      within 'main header' do
        expect(page).to have_css('h2.current', text: 'MANAGE COLLECTIONS')
      end
    end
  end

  context 'when trying to access the manage proposals page directly' do
    before do
      visit manage_proposals_path
    end

    it 'the user cannot access the Manage Proposals tab' do
      expect(page).to have_link('Manage Collections')
      expect(page).to have_link('Manage Variables')
      expect(page).to have_link('Manage Services')
      expect(page).to have_link('Manage CMR')
      expect(page).to have_no_link('Manage Proposals')
      expect(page).to have_no_content('Approved Proposals')

      within 'main header' do
        expect(page).to have_css('h2.current', text: 'MANAGE COLLECTIONS')
      end
    end
  end
end
