describe 'Service Drafts associated with published records at UMM Version higher than MMT supports', reset_provider: true do
  before do
    login
  end

  context 'when viewing a service with published revisions at versions that are unsupported by MMT' do
    before do
      ingest_response = publish_service_v1_2_draft(include_new_draft: true)

      @draft_id = Draft.last.id
    end

    context 'when visiting the service draft show page' do
      before do
        visit service_draft_path(@draft_id)
      end

      it 'displays a page and banner message explaining the draft has a Published Record with an unsupported version' do
        within '.eui-banner--warn' do
          expect(page).to have_content('Associated Published Record version is unsupported. Editing this Service Draft is currently unavailable.')
        end

        within '.no-access' do
          expect(page).to have_content('Published Version Unsupported')
          expect(page).to have_content('This Service Draft has an associated Service that has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this Service Draft is currently unavailable.')
        end
      end

      it 'does not display the normal draft show page' do
        expect(page).to have_no_link('Publish Service Draft')

        expect(page).to have_no_content('Metadata Fields')
        expect(page).to have_no_content('Service Information')
        expect(page).to have_no_content('Service Keywords')
      end
    end

    context 'when trying to visit the service draft edit page directly' do
      before do
        visit edit_service_draft_path(@draft_id)
      end

      it 'displays a page and banner message explaining the draft has a Published Record with an unsupported version' do
        within '.eui-banner--warn' do
          expect(page).to have_content('Associated Published Record version is unsupported. Editing this Service Draft is currently unavailable.')
        end

        within '.no-access' do
          expect(page).to have_content('Published Version Unsupported')
          expect(page).to have_content('This Service Draft has an associated Service that has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this Service Draft is currently unavailable.')
        end
      end

      it 'does not display the draft edit page' do
        expect(page).to have_no_css('form#umm_form')
        expect(page).to have_no_css('div.nav-top')
        expect(page).to have_no_button('Previous')
        expect(page).to have_no_content('Save & Jump To')
        expect(page).to have_no_button('Next')
        expect(page).to have_no_button('Done')
      end
    end
  end
end
