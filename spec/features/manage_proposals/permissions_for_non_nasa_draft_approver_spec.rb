describe 'Approver Permissions for Non-NASA Workflow in MMT', js: true do
  context 'when the user has Non-NASA Draft Approver permissions: in MMT' do
    before do
      allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
      login
      visit manage_collections_path
    end

    it 'the user can see the Manage Proposals tab' do
      expect(page).to have_link('Manage Collections')
      expect(page).to have_link('Manage Variables')
      expect(page).to have_link('Manage Services')
      expect(page).to have_link('Manage CMR')
      expect(page).to have_link('Manage Proposals')

      within 'main header' do
        expect(page).to have_css('h2.current', text: 'MANAGE COLLECTIONS')
      end
    end
  end
end
