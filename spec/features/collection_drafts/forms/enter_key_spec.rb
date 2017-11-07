require 'rails_helper'

describe 'Form Submission with Enter Key', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when pressing enter on a form' do
    before do
      within '.metadata' do
        click_on 'Collection Information'
      end

      fill_in 'Short Name', with: 'Name'

      page.find('#draft_short_name').native.send_keys(:enter)
    end

    it 'does not submit the form' do
      expect(page).to have_no_content('This page has invalid data. Are you sure you want to save it and proceed?')
    end
  end
end
