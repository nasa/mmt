require 'rails_helper'

describe 'Clearing saved location keywords', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when selecting and saving location keywords' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions

      # add_location_keywords
      choose_keyword 'GEOGRAPHIC REGION'
      choose_keyword 'ARCTIC'
      click_on 'Add Keyword'

      within '.nav-top' do
        click_on 'Save'
      end

      find('#invalid-draft-accept').click

      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully updated')
    end

    it 'populates the form with the selected location keywords' do
      expect(page).to have_content('GEOGRAPHIC REGION > ARCTIC')
    end

    context 'when removing the location keywords and submitting the form' do
      before do
        within '.selected-location-keywords' do
          find('.remove').click
          # sleep 1
        end

        within '.nav-top' do
          click_on 'Save'
        end

        find('#invalid-draft-accept').click
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it 'does not display the removed location keywords' do
        expect(page).to have_no_content('GEOGRAPHIC REGION > ARCTIC')
      end
    end
  end
end
