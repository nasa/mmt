require 'rails_helper'

describe 'Service Information Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      fill_in 'Name', with: 'Service Name'
      fill_in 'Long Name', with: 'Long Service Name'
      select 'NOT PROVIDED', from: 'Type'
      fill_in 'Version', with: '1.0'
      fill_in 'Description', with: 'Description of the test service'

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Service Information Form'
    end
  end
end
