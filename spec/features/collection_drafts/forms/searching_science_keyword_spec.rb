require 'rails_helper'

describe 'Searching science keywords', js: true do
  context 'when searching for science keywords' do
    before do
      login
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)

      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      open_accordions
    end

    context 'when selecting a keyword from the top level' do
      before do
        find('#science-keyword-search').click
        fill_in 'science-keyword-search', with: 'rocks'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)

        find('#science-keyword-search').click
      end

      it 'adds the science keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
      end

      it 'does not close the suggestions' do
        expect(page).to have_css('.tt-suggestion', text: 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
      end

      context 'when selecting the same keyword' do
        before do
          script = '$(".tt-suggestion").last().click()'
          page.execute_script(script)
        end

        it 'does not add duplicate keywords' do
          within '.selected-science-keywords' do
            expect(page).to have_css('li', text: 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE', count: 1, visible: true)
          end
        end
      end

      context 'when trying to select a suggestion with less than 3 levels of keywords' do
        before do
          within '.selected-science-keywords' do
            find('.remove').click
          end

          find('#science-keyword-search').click
          fill_in 'science-keyword-search', with: 'rocks'

          find('#science-keyword-search').click
        end

        it 'displays valid keywords' do
          expect(page).to have_css('.tt-suggestion', text: /EARTH SCIENCE > SOLID EARTH > ROCKS\/MINERALS\/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL\/OPTICAL PROPERTIES > LUMINESCENCE$/)
        end

        it 'does not display the invalid keyword' do
          within '.eui-nested-item-picker' do
            expect(page).to have_no_css('.tt-suggestion', text: /EARTH SCIENCE$/)
            expect(page).to have_no_css('.tt-suggestion', text: /EARTH SCIENCE > SOLID EARTH$/)
          end
        end

        context 'when trying to add an invalid keyword from a nested level' do
          before do
            choose_keyword 'EARTH SCIENCE'
            find('#science-keyword-search').click
            fill_in 'science-keyword-search', with: 'rocks'

            find('#science-keyword-search').click
          end

          it 'displays valid keywords' do
            expect(page).to have_css('.tt-suggestion', text: /SOLID EARTH > ROCKS\/MINERALS\/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL\/OPTICAL PROPERTIES > LUMINESCENCE$/)
          end

          it 'does not display the invalid keyword' do
            expect(page).to have_no_css('.tt-suggestion', text: /SOLID EARTH$/)
          end
        end

        context 'when trying to add a keyword from three levels deep' do
          before do
            choose_keyword 'SOLID EARTH'
            find('#science-keyword-search').click
            fill_in 'science-keyword-search', with: 'rocks'

            find('#science-keyword-search').click
          end

          it 'displays valid keywords' do
            expect(page).to have_css('.tt-suggestion', text: /ROCKS\/MINERALS\/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL\/OPTICAL PROPERTIES > LUMINESCENCE$/)
          end
        end
      end
    end

    context 'when selecting a keyword from a nested level' do
      before do
        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'SOLID EARTH'

        find('#science-keyword-search').click
        fill_in 'science-keyword-search', with: 'rocks'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the science keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
      end

      context 'when selecting a different level of nesting' do
        before do
          choose_keyword 'ROCKS/MINERALS/CRYSTALS'
        end

        it 'clears the suggestions' do
          expect(page).to have_no_css('.tt-suggestion')
        end
      end
    end

    context 'when a final option keyword is selected' do
      before do
        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'SOLID EARTH'
        choose_keyword 'ROCKS/MINERALS/CRYSTALS'
        choose_keyword 'SEDIMENTARY ROCKS'
        choose_keyword 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES'
        choose_keyword 'LUMINESCENCE'

        find('#science-keyword-search').click
        fill_in 'science-keyword-search', with: 'lumin'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the spatial keyword to the selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
      end

      it 'does not add the final option twice to the spatial keyword' do
        expect(page).to have_no_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE > LUMINESCENCE')
      end
    end
  end
end
