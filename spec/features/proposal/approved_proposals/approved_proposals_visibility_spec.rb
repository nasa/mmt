describe 'Viewing the Approved Proposals page', js: true do
  context 'when logged into DMMT approver and user permissions' do
    before do
      login
      set_as_proposal_mode_mmt(with_required_acl: true)
      visit approved_proposals_approved_proposals_path
    end

    it 'cannot reach the approved_proposals page' do
      expect(page).to have_no_link('Manage Collections')
      expect(page).to have_link('Manage Collection Proposals')

      within 'main header' do
        expect(page).to have_css('h2.current', text: 'MANAGE COLLECTION PROPOSALS')
      end
    end
  end

  context 'when logged into MMT with approver and user permissions' do
    before do
      login
      allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
      allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_user?).and_return(true)
      visit approved_proposals_approved_proposals_path
    end

    it 'cannot reach the approved_proposals page' do
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

  context 'when logged into MMT without approver and user permissions' do
    before do
      login
      visit approved_proposals_approved_proposals_path
    end

    it 'cannot reach the approved_proposals page' do
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
end
