describe 'Proposals listed on the Manage Proposals (MMT) page', js: true do
  before do
    login
    allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_approver?).and_return(true)
  end

# TODO: This test should function as is when the dummy data function is removed
# from the controller.
#  context 'when there are no approved proposals' do
#    before do
#      visit manage_proposals_path
#    end
#
#    it 'has the appropriate text' do
#      expect(page).to have_content('No Approved Proposals found')
#    end
#  end

  context 'when using the dummy data' do
    before do
      visit manage_proposals_path
    end

    it 'displays short names correctly' do
      expect(page).to have_content('Short Name: 50')
      expect(page).to have_content('Short Name: 26')
    end

    it 'displays entry titles' do
      expect(page).to have_content('Entry Title: 50')
      expect(page).to have_content('Entry Title: 26')
    end

    it 'displays proposal status' do
      expect(page).to have_content('Approved')
    end

    it 'displays proposal request types' do
      expect(page).to have_content('Create')
      expect(page).to have_content('Delete')
    end

    it 'has the correct header' do
      within '.manage-proposals-mmt section h2' do
        expect(page).to have_content('Approved Proposals')
      end
    end

    it 'has the correct proposal count' do
      within '.manage-proposals-mmt section p' do
        expect(page).to have_content('Showing Approved Proposals 1 - 25 of 51')
      end
    end

    it 'has the correct paging buttons' do
      expect(page).to have_link('First')
      expect(page).to have_link('1')
      expect(page).to have_link('2')
      expect(page).to have_link('3')
      expect(page).to have_link('Next')
      expect(page).to have_link('Last')
    end

    context 'when sorting short name' do
      before do
        click_on 'Sort by Short Name Asc'
      end

      it 'sorts in ascending order' do
        within '.open-draft-proposals tbody tr:nth-child(1)' do
          expect(page).to have_content('Short Name: 0')
        end
      end

      context 'when sorting short name desc' do
        before do
          click_on 'Sort by Short Name Desc'
        end

        it 'sorts in descending order' do
          within '.open-draft-proposals tbody tr:nth-child(1)' do
            expect(page).to have_content('Short Name: 9')
          end
        end
      end
    end

    context 'when clicking on the action buttons' do
      context 'when clicking on the publish button' do
        before do
          within '.open-draft-proposals tbody tr:nth-child(1)' do
            click_on 'Publish'
          end
        end

        it 'has the correct text and buttons' do
          expect(page).to have_text('Please select a provider to publish this metadata to the CMR.')
          within '#approver-proposal-modal' do
            expect(page).to have_no_link('Publish')
            expect(page).to have_link('Cancel')
          end
        end
      end

      context 'when clicking on the delete button' do
        before do
          within '.open-draft-proposals tbody tr:nth-child(2)' do
            click_on 'Delete'
          end
        end

        it 'has the correct text and buttons' do
          expect(page).to have_text('Are you sure you want to delete this metadata in the CMR?')
          expect(page).to have_link('Yes')
          expect(page).to have_link('No')
        end
      end
    end
  end
end
