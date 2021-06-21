describe 'Valid Service Draft Service Quality Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { service_draft.draft }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Quality section' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#service_quality-progress' do
          expect(page).to have_link('Service Quality', href: edit_service_draft_path(service_draft, 'service_quality'))
        end
      end

      it 'displays the correct status icon' do
        within '#service_quality-progress' do
          within '.status' do
            expect(page).to have_content('Service Quality is valid')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#service_quality-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.service-quality')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service-quality'))
        end
      end
    end
  end

  context 'when examining the metadata preview section' do
    include_examples 'Service Quality Full Preview' do
      let(:draft) { service_draft.draft }
    end

    it 'displays links to edit/update the data' do
      within '.umm-preview.service_quality' do
        # Grouped fields cause n + 1 preview containers
        expect(page).to have_css('.umm-preview-field-container', count: 4)

        within '#service_draft_draft_service_quality_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality'))
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality_quality_flag'))
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality_traceability'))
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality_lineage'))
        end
      end
    end
  end
end
