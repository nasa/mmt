require 'rails_helper'

describe 'Sidebar preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit draft_path(draft)
      end

      it 'does not display metadata' do
        within 'aside.geographic-coverage' do
          expect(page).to have_content('No Spatial Coordinates found')
          expect(page).to have_content('No Location Keywords found')
          expect(page).to have_content('No Temporal Coverages found')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit draft_path(draft)
      end

      it 'displays the metadata' do
        within 'aside.geographic-coverage' do
          within '.spatial-coordinates-sidebar' do
            within all('li')[0] do
              expect(page).to have_content('Bounding Rectangle')
            end
            within all('li')[1] do
              expect(page).to have_content('N: 90.0')
            end
            within all('li')[2] do
              expect(page).to have_content('S: -90.0')
            end
            within all('li')[3] do
              expect(page).to have_content('E: 180.0')
            end
            within all('li')[4] do
              expect(page).to have_content('W: -180.0')
            end
            within all('li')[5] do
              expect(page).to have_content('N: 58.968602')
            end
            within all('li')[6] do
              expect(page).to have_content('S: 18.968602')
            end
            within all('li')[7] do
              expect(page).to have_content('E: -56.9284587')
            end
            within all('li')[8] do
              expect(page).to have_content('W: -96.9284587')
            end
          end
          within '.location-keyword-sidebar' do
            within all('ul')[0] do
              expect(page).to have_content('GEOGRAPHIC REGION ARCTIC')
            end
            within all('ul')[1] do
              expect(page).to have_content('OCEAN ATLANTIC OCEAN')
            end
          end
          within '.temporal-coverage-sidebar' do
            within all('li')[0] do
              expect(page).to have_content('Single DateTimes')
            end
            within all('li')[1] do
              expect(page).to have_content('2015-07-01')
            end
            within all('li')[2] do
              expect(page).to have_content('2015-12-25')
            end
            within all('li')[3] do
              expect(page).to have_content('DateTime Ranges')
            end
            within all('li')[4] do
              expect(page).to have_content('2014-07-01 to 2014-08-01')
            end
            within all('li')[5] do
              expect(page).to have_content('2015-07-01 to 2015-08-01')
            end
            within all('li')[6] do
              expect(page).to have_content('Periodic Ranges')
            end
            within all('li')[7] do
              expect(page).to have_content('2015-07-01 to 2015-08-01')
            end
            within all('li')[8] do
              expect(page).to have_content('2016-07-01 to 2016-08-01')
            end
          end
        end
      end
    end
  end
end
