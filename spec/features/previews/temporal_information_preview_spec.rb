require 'rails_helper'

describe 'Temporal information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_no_css('.paleo-temporal-coverage-table')
        expect(page).to have_no_css('.temporal-keywords-preview')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.paleo-temporal-coverage-table' do
          within 'thead' do
            expect(page).to have_content('Paleo Temporal Coverage 50 Ga to 25 Ga')
          end
          within 'tbody' do
            within all('tr')[0] do
              expect(page).to have_content('test 1 Eon')
              expect(page).to have_content('test 1 Era')
              expect(page).to have_content('test 1 Period')
              expect(page).to have_content('test 1 Epoch')
              expect(page).to have_content('test 1 Stage')
            end
            within all('tr')[1] do
              expect(page).to have_content('test 2 Eon')
              expect(page).to have_content('test 2 Era')
              expect(page).to have_content('test 2 Period')
              expect(page).to have_content('test 2 Epoch')
              expect(page).to have_content('test 2 Stage')
            end
            within all('tr')[2] do
              expect(page).to have_content('test 3 Eon text 1')
            end
          end
        end

        within '.temporal-keywords-preview' do
          expect(page).to have_content('Monthly Climatology')
          expect(page).to have_content('Weekly Climatology')
        end
      end
    end
  end
end
