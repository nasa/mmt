describe 'Non-NASA Draft User Permissions for Draft MMT', reset_provider: true do
  before do
    set_as_proposal_mode_mmt(with_draft_user_acl: true)
  end

  context 'when the user has permissions for Non-NASA Draft User' do
    before :all do
      @non_nasa_draft_users_group = create_group(name: 'Non-NASA Draft Users Group', members: ['testuser'], provider_id: 'MMT_2')
      @non_nasa_permissions = add_permissions_to_group(@non_nasa_draft_users_group['concept_id'], 'create', 'NON_NASA_DRAFT_USER', 'MMT_2')
    end

    after :all do
      remove_group_permissions(@non_nasa_permissions['concept_id'])
    end

    before do
      login
    end

    context 'when visiting the Manage Collection Proposals page' do
      before do
        visit manage_collection_proposals_path
      end

      it 'displays the Manage Collection Proposals page' do
        expect(page).to have_content('Create Collection Proposal')
        expect(page).to have_content('Collection Draft Proposals')
      end

      context 'when creating a new collection draft proposals page' do
        before do
          click_on 'Create New Record'
        end

        it 'creates a new blank draft record' do
          expect(page).to have_content('New')

          expect(page).to have_content('Collection Information')
        end
      end
    end

    context 'when there are collection draft proposals' do
      before do
        @collection_draft_proposal = create(:full_collection_draft_proposal, draft_short_name: 'Example Proposal Short Name', draft_entry_title: 'Example Proposal Title')
      end

      context 'when visiting the show page for a collection draft proposal' do
        before do
          visit collection_draft_proposal_path(@collection_draft_proposal)
        end

        it 'displays the collection draft proposal show page' do
          expect(page).to have_content('Example Proposal Short Name')
          expect(page).to have_content('Example Proposal Title')

          expect(page).to have_link('Submit for Review')
          expect(page).to have_link('Delete Collection Draft Proposal')
          within '#proposal-status-display' do
            expect(page).to have_content('In Work')
          end
          expect(page).to have_content('Metadata Fields')
        end
      end

      context 'when visiting the edit page for a collection draft proposal' do
        before do
          visit edit_collection_draft_proposal_path(@collection_draft_proposal)
        end

        it 'displays the collection draft proposal Collection Information form' do
          expect(page).to have_content('Collection Information')

          expect(page).to have_field('Short Name', with: 'Example Proposal Short Name')
          expect(page).to have_field('Entry Title', with: 'Example Proposal Title')
        end
      end
    end
  end
end
