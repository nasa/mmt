require 'rails_helper'

describe 'Empty Variable Draft Service Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Service section' do
    it 'displays the form title as an edit link' do
      within '#service-progress' do
        expect(page).to have_link('Service', href: edit_variable_draft_path(@draft, 'service'))
      end
    end

    it 'displays the corrent status icon' do
      within '#service-progress' do
        within '.status' do
          expect(page).to have_content('Service is valid')
        end
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#service-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#service-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.variable_draft_draft_service')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_service_preview' do
          expect(page).to have_css('h5', text: 'Services')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'service', anchor: 'variable_draft_draft_service'))

          expect(page).to have_css('p', text: 'No value for Services provided.')
        end
      end
    end
  end
end
