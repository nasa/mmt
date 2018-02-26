require 'rails_helper'

describe 'Empty Service Draft Coverage Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Coverage section' do
    it 'displays the form title as an edit link' do
      within '#coverage-progress' do
        expect(page).to have_link('Coverage', href: edit_service_draft_path(service_draft, 'coverage'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#coverage-progress' do
      within '.status' do
        expect(page).to have_content('Coverage is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#coverage-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.coverage')
    end
  end
end
