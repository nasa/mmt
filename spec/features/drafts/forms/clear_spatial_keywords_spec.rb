require 'rails_helper'

describe 'Clearing saved spatial keywords', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when selecting and saving spatial keywords' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions

      # add_spatial_keywords
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

    it 'populates the form with the selected spatial keywords' do
      expect(page).to have_content('GEOGRAPHIC REGION > ARCTIC')
    end

    context 'when removing the spatial keywords and submitting the form' do
      before do
        within '.selected-spatial-keywords' do
          find('.remove').click
          sleep 1
        end

        within '.nav-top' do
          click_on 'Save'
        end

        find('#invalid-draft-accept').click
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it 'does not display the removed spatial keywords' do
        expect(page).to have_no_content('GEOGRAPHIC REGION > ARCTIC')
      end
    end
  end
end
