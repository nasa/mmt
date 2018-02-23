require 'rails_helper'

describe 'Valid Service Draft Related URL Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Related URL section' do
    it 'displays the form title as an edit link' do
      within '#related_url-progress' do
        expect(page).to have_link('Related URL', href: edit_service_draft_path(service_draft, 'related_url'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#related_url-progress' do
      within '.status' do
        expect(page).to have_content('Related URL is valid')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#related_url-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-required.icon-green.related-url')
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#related_url-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.online-access-url-pattern-match')
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.online-access-url-pattern-substitution')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.related_url' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_draft_related_url_preview' do
        expect(page).to have_css('h5', text: 'Related URL')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'related_url', anchor: 'service_draft_draft_related_url'))

        within '.card-header' do
          expect(page).to have_content('DistributionURL')
        end
        within '.card-body' do
          expect(page).to have_content('Test related url')
          expect(page).to have_link('nasa.gov', href: 'nasa.gov')

          type_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
          expect(type_parts[0]).to have_content('GET SERVICE')
          expect(type_parts[1]).to have_content('SOFTWARE PACKAGE')
        end
      end
    end
  end
end
