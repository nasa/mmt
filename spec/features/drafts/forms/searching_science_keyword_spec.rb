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
        fill_in 'science_keyword_search', with: 'geographic'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)

        find('#science_keyword_search').click
      end

      it 'adds the science keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
      end

      it 'does not close the suggestions' do
        expect(page).to have_css('.tt-suggestion', text: 'EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
      end

      context 'when selecting the same keyword' do
        before do
          script = '$(".tt-suggestion").last().click()'
          page.execute_script(script)
        end

        it 'does not add duplicate keywords' do
          within '.selected-science-keywords' do
            expect(page).to have_css('li', text: 'EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS', count: 1, visible: true)
          end
        end
      end

      context 'when trying to select a suggestion with less than 3 levels of keywords' do
        before do
          within '.selected-science-keywords' do
            find('.remove').click
          end

          find('#science_keyword_search').click
          fill_in 'science_keyword_search', with: 'earth'

          script = '$(".tt-suggestion").first().click()'
          page.execute_script(script)
        end

        it 'does not add the keyword' do
          within '.selected-science-keywords' do
            expect(page).to have_no_content('EARTH')
          end
        end
      end
    end

    context 'when selecting a keyword from a nested level' do
      before do
        choose_keyword 'EARTH SCIENCE SERVICES'
        choose_keyword 'DATA ANALYSIS AND VISUALIZATION'

        find('#science_keyword_search').click
        fill_in 'science_keyword_search', with: 'geographic'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the science keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
      end

      context 'when selecting a different level of nesting' do
        before do
          choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
        end

        it 'clears the suggestions' do
          expect(page).to have_no_css('.tt-suggestion')
        end
      end
    end
  end
end
