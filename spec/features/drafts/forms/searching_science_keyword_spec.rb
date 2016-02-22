require 'rails_helper'

describe 'Searching science keywords', js: true do
  context 'when searching for science keywords' do
    before do
      login
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      open_accordions
    end

    context 'when selecting a keyword from the top level' do
      before do
        find('#science_keyword_search').click
        fill_in 'science_keyword_search', with: 'aerosol'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the science keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT')
      end

      it 'does not close the suggestions' do
        expect(page).to have_css('.tt-suggestion', text: 'EARTH SCIENCE > ATMOSPHERE > AEROSOLS')
      end
    end

    context 'when selecting a keyword from a nested level' do
      before do
        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'ATMOSPHERE'

        find('#science_keyword_search').click
        fill_in 'science_keyword_search', with: 'aerosol'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the science keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT')
      end

      context 'when selecting a different level of nesting' do
        before do
          choose_keyword 'AEROSOL OPTICAL DEPTH/THICKNESS'
        end

        it 'clears the suggestions' do
          expect(page).to have_no_css('.tt-suggestion')
        end
      end
    end
  end
end
