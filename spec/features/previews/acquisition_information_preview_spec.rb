require 'rails_helper'

describe 'Acquisition information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('No platforms or instruments have been added to this associated with this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.platform-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('Aircraft')
              expect(page).to have_content('test 1 P ShortName')
            end
            within '.card-body' do
              expect(page).to have_content('Instruments')
              expect(page).to have_content('test 1 PI ShortName')
              expect(page).to have_content('test 1d PI ShortName')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('Earth Observation Satellites')
              expect(page).to have_content('test a1 P ShortName')
            end
            within '.card-body' do
              expect(page).to have_content('Instruments')
              expect(page).to have_content('test a1 PI ShortName')
              expect(page).to have_content('test a1d PI ShortName')
            end
          end
        end

        within '.projects-table' do
          within all('tr')[1] do
            expect(page).to have_content('test 1 ShortName test 1a Campaign test 1b Campaign 2015-07-01 to 2015-12-25')
          end
          within all('tr')[2] do
            expect(page).to have_content('test 2 ShortName test 2a Campaign test 2b Campaign 2015-07-01 to 2015-12-25')
          end
        end
      end
    end
  end
end
