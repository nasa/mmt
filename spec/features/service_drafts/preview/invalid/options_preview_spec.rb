require 'rails_helper'

describe 'Invalid Service Draft Options Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Options section' do
    it 'displays the form title as an edit link' do
      within '#options-progress' do
        expect(page).to have_link('Options', href: edit_service_draft_path(service_draft, 'options'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#options-progress' do
      within '.status' do
        expect(page).to have_content('Options is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#options-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.service-options')
    end
  end
end
