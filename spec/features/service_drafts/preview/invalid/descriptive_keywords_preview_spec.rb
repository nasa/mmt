describe 'Invalid Service Draft Descriptive Keywords Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Descriptive Keywords section' do
    it 'displays the form title as an edit link' do
      within '#descriptive_keywords-progress' do
        expect(page).to have_link('Descriptive Keywords', href: edit_service_draft_path(service_draft, 'descriptive_keywords'))
      end
    end
  end

  it 'displays the correct status icon' do
    within '#descriptive_keywords-progress' do
      within '.status' do
        expect(page).to have_content('Service Keywords is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.service-keywords')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_keywords' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_draft_service_keywords_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_keywords', anchor: 'service_draft_draft_service_keywords'))

        keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
        expect(keyword_parts[0]).to have_content('EARTH SCIENCE SERVICES')
      end
    end
  end

  it 'displays the correct status icon' do
    within '#descriptive_keywords-progress' do
      within '.status' do
        expect(page).to have_content('Science and Ancillary Keywords is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.science-keywords')
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.ancillary-keywords')
    end
  end
end
