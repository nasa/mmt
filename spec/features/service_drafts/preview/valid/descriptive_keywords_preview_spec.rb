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
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_keywords' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_draft_service_keywords_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_keywords', anchor: 'service_draft_draft_service_keywords'))

        keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
        expect(keyword_parts[0]).to have_content('EARTH SCIENCE SERVICES')
        expect(keyword_parts[1]).to have_content('DATA ANALYSIS AND VISUALIZATION')
        expect(keyword_parts[2]).to have_content('GEOGRAPHIC INFORMATION SYSTEMS')
        expect(keyword_parts[3]).to have_content('DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#descriptive_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.ancillary-keywords')
    end
  end
end
