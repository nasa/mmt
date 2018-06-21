require 'rails_helper'

describe 'Invalid Service Draft Service Keywords Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Service Keywords section' do
    it 'displays the form title as an edit link' do
      within '#service_keywords-progress' do
        expect(page).to have_link('Service Keywords', href: edit_service_draft_path(service_draft, 'service_keywords'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#service_keywords-progress' do
      within '.status' do
        expect(page).to have_content('Service Keywords is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#service_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.service-keywords')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_keywords' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_service_keywords_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_keywords', anchor: 'service_draft_service_keywords'))

        keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
        expect(keyword_parts[0]).to have_content('EARTH SCIENCE SERVICES')
      end
    end
  end
end
