require 'rails_helper'

describe 'Invalid Service Draft Science and Ancillary Keywords Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Science and Ancillary Keywords section' do
    it 'displays the form title as an edit link' do
      within '#science_and_ancillary_keywords-progress' do
        expect(page).to have_link('Science and Ancillary Keywords', href: edit_service_draft_path(service_draft, 'science_and_ancillary_keywords'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#science_and_ancillary_keywords-progress' do
      within '.status' do
        expect(page).to have_content('Science and Ancillary Keywords is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#science_and_ancillary_keywords-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.science-keywords')
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.ancillary-keywords')
    end
  end
end
