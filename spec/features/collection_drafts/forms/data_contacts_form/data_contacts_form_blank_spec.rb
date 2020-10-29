require 'rails_helper'

describe 'Data Contacts form saving when blank' do
  before do
    login
  end

  context 'when saving the form when there is no data' do
    before do
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)

      click_on 'Data Contacts', match: :first
      expect(page).to have_content('Data Contacts')

      within '.nav-top' do
        click_on 'Save'
      end
      expect(page).to have_content('Data Contacts')
    end

    context 'when checking the accordion headers for required icons' do
      it 'does not display required icons for accordions in Data Contacts section' do
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end
    end
    
    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end
  end
end
