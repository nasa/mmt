describe 'Reverting to previous tools', reset_provider: true, js: true do
  before :all do
    # tool for simple reverting tool test
    @simple_revert_ingest_response, @simple_revert_concept_response, @native_id = publish_tool_draft(revision_count: 2)

    # tool for reverting tool with many revisions
    @multiple_revisions_ingest_response, @multiple_revisions_concept_response, @native_id2 = publish_tool_draft(revision_count: 4, long_name: 'Reverting Tools Test', number_revision_long_names: true)
  end

  after :all do
    delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')
    delete_response2 = cmr_client.delete_tool('MMT_2', @native_id2, 'token')

    raise unless delete_response.success? && delete_response2.success?
  end

  before do
    login
  end

  context 'when the latest revision is a published tool' do
    before do
      visit tool_path(@simple_revert_ingest_response['concept-id'])

      click_on 'Revisions'
    end

    it 'displays the correct phrasing for reverting records' do
      expect(page).to have_content('Revert to this Revision', count: 1)
    end

    context 'when reverting the tool' do
      before do
        click_on 'Revert to this Revision'
        click_on 'Yes'

        wait_for_jQuery
        wait_for_cmr
      end

      it 'displays all the correct revision information' do
        expect(page).to have_content('Revision Created Successfully!')

        expect(page).to have_content('Published', count: 1)
        expect(page).to have_content('Revision View', count: 2)
        expect(page).to have_content('Revert to this Revision', count: 2)
      end
    end

    context 'when reverting to a revision before the previous revision from a different provider context' do
      context 'when visiting the revisions page from a different provider' do
        before do
          login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

          visit tool_revisions_path(@multiple_revisions_ingest_response['concept-id'])
        end

        it 'displays all the correct revision information' do
          within 'main header' do
            expect(page).to have_content('Reverting Tools Test -- revision 04')
          end

          expect(page).to have_content('Published', count: 1)
          expect(page).to have_content('Revision View', count: 3)
          expect(page).to have_content('Revert to this Revision', count: 3)
        end

        context 'when reverting to the earliest revision' do
          before do
            visit tool_revisions_path(@multiple_revisions_ingest_response['concept-id'])

            within '#tool-revisions-table tbody tr:last-child' do
              # make sure we are clicking on the correct link
              expect(page).to have_content('1 - Revision')

              click_on 'Revert to this Revision'
            end
          end

          it 'displays a modal informing the user they need to switch providers' do
            expect(page).to have_content('Reverting this tool requires you change your provider context to MMT_2')
          end

          context 'when clicking Yes' do
            before do
              find('.not-current-provider-link').click
              wait_for_jQuery
            end

            it 'reverts the tool to the correct revision and displays the correct revision information and switches provider context' do
              within 'main header' do
                expect(page).to have_content('Reverting Tools Test -- revision 01')
              end

              expect(page).to have_content('Published', count: 1)
              expect(page).to have_content('Revision View', count: 4)
              expect(page).to have_content('Revert to this Revision', count: 4)

              expect(User.first.provider_id).to eq('MMT_2')
            end
          end
        end
      end
    end

    context 'when reverting the tool fails ingestion into CMR' do
      before do
        # Do something to the revision so it fails
        # Add a new field to the metadata, similar to a field name changing
        # and old metadata still having the old field name
        new_concept = @simple_revert_concept_response.deep_dup
        new_concept.body['BadField'] = 'Not going to work'

        allow_any_instance_of(Cmr::CmrClient).to receive(:get_concept).and_return(new_concept)

        click_on 'Revert to this Revision', match: :first
        click_on 'Yes'

        wait_for_jQuery
        wait_for_cmr
      end

      it 'displays an error message' do
        expect(page).to have_content('extraneous key [BadField] is not permitted')
      end
    end
  end

  context 'when the latest revision is a deleted tool' do
    before do
      ingest_response, _concept_response, @native_id3 = publish_tool_draft

      cmr_client.delete_tool('MMT_2', @native_id3, 'token')
      wait_for_cmr

      visit tool_revisions_path(ingest_response['concept-id'])
    end

    it 'displays the correct phrasing for reverting records' do
      expect(page).to have_content('Reinstate', count: 1)
    end

    context 'when reverting the tool' do
      before do
        click_on 'Reinstate'
        click_on 'Yes'

        wait_for_jQuery
        wait_for_cmr
      end

      it 'displays all the correct revision information' do
        expect(page).to have_content('Revision Created Successfully!')

        expect(page).to have_content('Published', count: 1)
        expect(page).to have_content('Deleted', count: 1)
        expect(page).to have_content('Revision View', count: 1)
        expect(page).to have_content('Revert to this Revision', count: 1)
      end
    end
  end
end
