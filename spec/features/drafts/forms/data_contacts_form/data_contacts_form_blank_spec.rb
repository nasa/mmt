require 'rails_helper'

describe 'Data Contacts form saving when blank', js: true do
  before do
    login
  end

  context 'when saving the form when there is no data' do
    before do
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      click_on 'Data Contacts', match: :first
      expect(page).to have_content('Data Contacts')

      within '.nav-top' do
        click_on 'Save'
      end
      expect(page).to have_content('Data Contacts')
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully updated')
    end
  end
end
