describe 'Collection Draft Proposal creation', js: true do
  before do
    login
  end

  context 'when creating a new collection draft proposal from scratch' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      visit manage_collection_proposals_path
      click_on 'Create New Record'
    end

    it 'creates a new blank draft record' do
      expect(page).to have_content('New')
    end

    context 'when saving data into the draft' do
      before do
        fill_in 'Short Name', with: '123'

        within '.nav-top' do
          click_on 'Done'
        end
        # Accept
        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Proposal Created Successfully!')
      end

      context 'when viewing the manage collections page' do
        before do
          visit manage_collection_proposals_path
        end

        it 'displays the new draft' do
          within('.open-drafts') do
            expect(page).to have_content("#{today_string} | 123")
          end
        end

        context 'when clicking on the collection draft proposal title' do
          before do
            within('.open-drafts') do
              click_on '123'
            end
          end

          it 'displays the collection draft proposals preview page' do
            expect(page).to have_content('Collection Draft Proposals')
            expect(page).to have_content('123')
          end
        end

        context "when accessing a collection draft's json" do
          before do
            visit collection_draft_proposal_path(CollectionDraftProposal.first, format: 'json')
          end

          it 'returns the json' do
            expect(page).to have_content("{\n  \"ShortName\": \"123\"\n}")
          end
        end
      end
    end
  end

  context 'when viewing a collection' do
    before do
      @ingest_response, _concept_response = publish_collection_draft
      set_as_proposal_mode_mmt(with_required_acl: true)
      visit collection_path(@ingest_response['concept-id'])
    end

    context 'when creating a delete metadata proposal' do
      before do
        click_on 'Submit Delete Request'
        click_on 'Yes'
      end

      it 'a delete metadata proposal can be created' do
        expect(page).to have_content('Delete Collection Metadata Request Created Successfully!')
        expect(page).to have_content('Submitted')
      end
    end
  end
end
