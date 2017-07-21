require 'rails_helper'

describe 'Clearing saved science keywords', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when selecting science keywords and saving the form' do
    before do
      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      open_accordions

      # add_science_keywords
      choose_keyword 'EARTH SCIENCE SERVICES'
      choose_keyword 'DATA ANALYSIS AND VISUALIZATION'
      choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
      click_on 'Add Keyword'

      within '.nav-top' do
        click_on 'Save'
      end

      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
    end

    context 'when removing the science keywords and saving the form' do
      before do
        within '.selected-science-keywords' do
          find('.remove').click
          # remove_script = "$('.selected-science-keywords').find('.remove').click()"
          # page.execute_script(remove_script)
          # sleep 1
        end

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      it 'does not display the removed science keywords' do
        expect(page).to have_no_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
      end
    end
  end
end
