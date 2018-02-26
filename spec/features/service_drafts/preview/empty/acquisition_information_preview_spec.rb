require 'rails_helper'

describe 'Empty Service Draft Acquisition Information Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Acquisition Information section' do
    it 'displays the form title as an edit link' do
      within '#acquisition_information-progress' do
        expect(page).to have_link('Acquisition Information', href: edit_service_draft_path(service_draft, 'acquisition_information'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#acquisition_information-progress' do
      within '.status' do
        expect(page).to have_content('Acquisition Information is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#acquisition_information-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.platforms')
    end
  end
end
