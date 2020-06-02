describe 'Empty Service Draft Descriptive Keywords Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Service Keywords section' do
    it 'displays the form title as an edit link' do
      within '#descriptive_keywords-progress' do
        expect(page).to have_link('Descriptive Keywords', href: edit_service_draft_path(service_draft, 'descriptive_keywords'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#descriptive_keywords-progress' do
      within '.status' do
        expect(page).to have_content('Descriptive Keywords is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.service-keywords')
    end
  end

# TODO: MMT-1997 needs to update the preview to fix this test.
#  it 'displays the stored values correctly within the preview' do
#    within '.umm-preview.service_keywords' do
#      expect(page).to have_css('.umm-preview-field-container', count: 1)
#
#      within '#service_draft_draft_service_keywords_preview' do
#        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_keywords', anchor: 'service_draft_draft_service_keywords'))
#
#        expect(page).to have_css('p', text: 'No value for Service Keywords provided.')
#      end
#    end
#  end

  it 'displays the correct progress indicators for non required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.ancillary-keywords')
    end
  end
end
