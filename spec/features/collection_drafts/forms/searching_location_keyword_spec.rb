require 'rails_helper'

describe 'Searching location keywords', js: true do
  context 'when searching for location keywords' do
    before do
      login
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)

      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    context 'when selecting a keyword from the top level' do
      before do
        find('#location-keyword-search').click
        fill_in 'location-keyword-search', with: 'atlantic'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)

        find('#location-keyword-search').click
      end

      it 'adds the location keyword to the selected keywords' do
        expect(page).to have_content('OCEAN > ATLANTIC OCEAN > NORTH ATLANTIC OCEAN > BALTIC SEA')
      end

      it 'does not close the suggestions' do
        expect(page).to have_css('.tt-suggestion', text: 'OCEAN > ATLANTIC OCEAN > NORTH ATLANTIC OCEAN')
      end

      context 'when selecting the same keyword' do
        before do
          script = '$(".tt-suggestion").last().click()'
          page.execute_script(script)
        end

        it 'does not add duplicate keywords' do
          within '.selected-location-keywords' do
            expect(page).to have_css('li', text: 'OCEAN > ATLANTIC OCEAN > NORTH ATLANTIC OCEAN > BALTIC SEA', count: 1, visible: true)
          end
        end
      end

      context 'when trying to select a suggestion with less than 2 levels of keywords' do
        before do
          within '.selected-location-keywords' do
            find('.remove').click
          end

          find('#location-keyword-search').click
          fill_in 'location-keyword-search', with: 'geographic'

          find('#location-keyword-search').click
        end

        it 'does not display the invalid keywords' do
          within '.eui-nested-item-picker' do
            expect(page).to have_no_css('.tt-suggestion', text: /GEOGRAPHIC REGION$/)
          end
        end
      end
    end

    context 'when selecting a keyword from a nested level' do
      before do
        choose_keyword 'CONTINENT'
        choose_keyword 'AFRICA'

        find('#location-keyword-search').click
        fill_in 'location-keyword-search', with: 'central'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the location keyword to the selected keywords' do
        expect(page).to have_content('CONTINENT > AFRICA > CENTRAL AFRICA > ANGOLA')
      end

      context 'when selecting a different level of nesting' do
        before do
          choose_keyword 'CENTRAL AFRICA'
        end

        it 'clears the suggestions' do
          expect(page).to have_no_css('.tt-suggestion')
        end
      end
    end

    context 'when a final option keyword is selected' do
      before do
        choose_keyword 'GEOGRAPHIC REGION'
        choose_keyword 'ARCTIC'

        find('#location-keyword-search').click
        fill_in 'location-keyword-search', with: 'arctic'

        script = '$(".tt-suggestion").last().click()'
        page.execute_script(script)
      end

      it 'adds the location keyword to the selected keywords' do
        expect(page).to have_content('GEOGRAPHIC REGION > ARCTIC')
      end

      it 'does not add the final option twice to the location keyword' do
        expect(page).to have_no_content('GEOGRAPHIC REGION > ARCTIC > ARCTIC')
      end
    end
  end
end
