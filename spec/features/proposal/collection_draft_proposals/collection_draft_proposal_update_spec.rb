describe 'Collection Draft Proposal Update', reset_provider: true, js: true do
  before do
    login
  end

  context 'when updating an existing collection draft proposal' do
    before do
      set_as_proposal_mode_mmt(with_draft_user_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
    end

    context 'when updating data' do
      before do
        visit edit_collection_draft_proposal_path(@collection_draft_proposal)
        fill_in 'Short Name', with: 'A Special Short Name'
        fill_in 'Abstract', with: 'collection abstract'
        within '.nav-top' do
          click_on 'Done'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Proposal Updated Successfully!')
        expect(page).to have_content('A Special Short Name')
        expect(page).to have_content('collection abstract')
      end
    end

    context 'when a proposal is not "in work"' do
      before do
        mock_submit(CollectionDraftProposal.first)
        visit edit_collection_draft_proposal_path(@collection_draft_proposal)
      end

      it 'cannot be edited' do
        expect(page).to have_content('Only proposals in an "In Work" status can be edited.')
        expect(page).to have_link('Cancel Proposal Submission')
      end
    end
  end

  context 'when creating a metadata update request' do
    context 'when searching for collections' do
      before do
        set_as_proposal_mode_mmt(with_draft_user_acl: true)
        visit manage_collection_proposals_path
        click_on 'Search Collections'
      end

      it 'displays the search results' do
        # skipping the numbers of results as they may change and the numbers aren't important for these tests
        expect(page).to have_content('Collection Results')
        expect(page).to have_content('Showing collections 1 - 25 of')
      end

      context 'when viewing a collection' do
        before do
          click_on 'SWDB_L310'
        end

        it 'displays the collection preview page' do
          within '#collection-general-overview' do
            expect(page).to have_content('SWDB_L310')
            expect(page).to have_content('SeaWiFS Deep Blue Aerosol Optical Depth and Angstrom Exponent Daily Level 3 Data Gridded at 1.0 Degrees V004 (SWDB_L310) at GES DISC')
          end
        end

        context 'when creating an update metadata proposal' do
          before do
            click_on 'Create Update Request'
            click_on 'Yes'
          end

          it 'creates the update metadata proposal' do
            expect(page).to have_content('Collection Metadata Update Request Created Successfully!')
            expect(page).to have_content('In Work')
          end

          context 'when editing the update proposal' do
            before do
              within '.progress-indicator' do
                click_on 'Collection Information'
              end

              fill_in 'Short Name', with: 'Update_Proposal_Short_Name'
              fill_in 'Entry Title', with: 'New Update Proposal Title'

              within '.nav-top' do
                click_on 'Done'
              end
            end

            it 'updates the update proposal' do
              expect(page).to have_content('Collection Draft Proposal Updated Successfully!')

              within '#collection-general-overview' do
                expect(page).to have_content('Update_Proposal_Short_Name')
                expect(page).to have_content('New Update Proposal Title')
              end
            end

            context 'when viewing the Manage Collection Proposals page' do
              before do
                visit manage_collection_proposals_path
              end

              it 'displays the update proposal' do
                within '.eui-callout-box .all-proposals' do
                  expect(page).to have_content('Update_Proposal_Short_Name')
                  expect(page).to have_content('In Work | Update Collection Request')
                end
              end
            end
          end
        end
      end
    end
  end
end
