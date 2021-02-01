describe 'Valid Service Draft Descriptive Keywords Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Keywords section' do
    it 'displays the form title as an edit link' do
      within '#descriptive_keywords-progress' do
        expect(page).to have_link('Descriptive Keywords', href: edit_service_draft_path(service_draft, 'descriptive_keywords'))
      end
    end
  end

  it 'displays the correct status icon' do
    within '#descriptive_keywords-progress' do
      within '.status' do
        expect(page).to have_content('Descriptive Keywords is valid')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-required.icon-green.service-keywords')
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'descriptive_keywords', anchor: 'service-keywords'))
    end
  end

  include_examples 'Descriptive Keywords Full Preview'

  it 'displays links to edit/update the keywords' do
    within '.umm-preview.descriptive_keywords' do
      expect(page).to have_css('.umm-preview-field-container', count: 2)

      within '#service_draft_draft_service_keywords_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'descriptive_keywords', anchor: 'service_draft_draft_service_keywords'))
      end

      within '#service_draft_draft_ancillary_keywords_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'descriptive_keywords', anchor: 'service_draft_draft_ancillary_keywords'))
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.ancillary-keywords')
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'descriptive_keywords', anchor: 'ancillary-keywords'))
    end
  end
end
