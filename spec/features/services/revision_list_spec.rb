describe 'Service revision list', reset_provider: true, js: true do
  context 'when viewing a published service' do
    before :all do
      # CMR does not return revisions sorted by revision_id. It sorts
      # by name first (and maybe other things). If the sort_key is working
      # correctly, the last revision (c_test_01), should be visible on the page
      native_id = 'service_revision_native_id'
      _ingest_response, _concept_response = publish_service_draft(native_id: native_id, revision_count: 10, name: 'b_test_01')
      @ingest_response, @concept_response = publish_service_draft(native_id: native_id, name: 'c_test_01')
    end

    before do
      login

      visit service_path(@ingest_response['concept-id'])
    end

    it 'displays the number of revisions' do
      expect(page).to have_content('Revisions (10)')
    end

    context 'when clicking on the revision link' do
      before do
        wait_for_cmr
        click_on 'Revisions'
      end

      it 'displays the revision page' do
        expect(page).to have_content('Revision History')
      end

      it 'displays the service long name' do
        expect(page).to have_content(@concept_response.body['LongName'])
      end

      it 'displays when the revision was made' do
        expect(page).to have_content(today_string, count: 10)
      end

      it 'displays what user made the revision' do
        expect(page).to have_content('typical', count: 10)
      end

      it 'displays the most recent revisions' do
        expect(page).to have_content('11 - Published')
      end

      it 'displays the correct phrasing for reverting records' do
        expect(page).to have_content('Revert to this Revision', count: 9)
      end

      context 'when viewing an old revision' do
        link_text = 'You are viewing an older revision of this service. Click here to view the latest published version.'
        before do
          all('a', text: 'View').last.click
        end

        it 'displays a message that the revision is old' do
          expect(page).to have_link(link_text)
        end

        it 'does not display a link to manage collection associations' do
          expect(page).to have_no_link('Manage Collection Associations')
        end

        context 'when clicking the message' do
          before do
            click_on link_text
          end

          it 'displays the latest revision to the user' do
            expect(page).to have_no_link(link_text)
          end
        end
      end
    end

    context 'when searching for the service' do
      before do
        full_search(record_type: 'Services', keyword: @concept_response.body['LongName'], provider: 'MMT_2')
      end

      it 'only displays the latest revision' do
        within '#service-search-results' do
          expect(page).to have_content(@concept_response.body['LongName'], count: 1)
        end
      end
    end
  end
end
