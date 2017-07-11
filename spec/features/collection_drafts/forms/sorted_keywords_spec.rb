require 'rails_helper'

describe 'Sorted keywords', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing the science keyword picker' do
    before do
      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      open_accordions
    end

    it 'displays first level keywords in alphabetical order' do
      within '.eui-item-list-pane' do
        within 'ul li:nth-child(2)' do
          expect(page).to have_content('EARTH SCIENCE')
          expect(page).to have_no_content('SERVICES')
        end
        within 'ul li:nth-child(3)' do
          expect(page).to have_content('EARTH SCIENCE SERVICES')
        end
      end
    end

    context 'when clicking to nested levels' do
      before do
        choose_keyword 'EARTH SCIENCE SERVICES'
        choose_keyword 'DATA ANALYSIS AND VISUALIZATION'
        choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
      end

      it 'displays the nested keywords in alphabetical order' do
        within '.eui-item-list-pane' do
          within 'ul li:nth-child(2)' do
            expect(page).to have_content('DESKTOP')
          end
          within 'ul li:nth-child(3)' do
            expect(page).to have_content('MOBILE')
          end
        end
      end
    end
  end

  context 'when viewing the spatial keyword picker' do
    # can only test top level because all nested levels (in test) have only one choice
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    it 'displays first level keywords in alphabetical order' do
      within '.eui-item-list-pane' do
        within 'ul li:nth-child(2)' do
          expect(page).to have_content('CONTINENT')
        end
        within 'ul li:nth-child(3)' do
          expect(page).to have_content('GEOGRAPHIC REGION')
        end
        within 'ul li:nth-child(4)' do
          expect(page).to have_content('OCEAN')
        end
      end
    end
  end

  context 'when selecting temporal keywords' do
    before do
      within '.metadata' do
        click_on 'Temporal Information'
      end

      open_accordions
    end

    it 'has the temporal keywords in alphabetical order' do
      within '#temporal-keywords' do
        within 'select option:nth-child(1)' do
          expect(page).to have_content('1 minute - < 1 hour')
        end
        within 'select option:nth-child(3)' do
          expect(page).to have_content('< 1 second')
        end
        within 'select option:nth-child(4)' do
          expect(page).to have_content('Annual')
        end
        within 'select option:nth-child(9)' do
          expect(page).to have_content('Decadal')
        end
        within 'select option:nth-last-child(1)' do
          expect(page).to have_content('Weekly Climatology')
        end
      end
    end
  end
end
