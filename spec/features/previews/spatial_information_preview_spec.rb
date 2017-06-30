require 'rails_helper'

describe 'Spatial information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There is no spatial information for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.spatial-extent-table' do
          within all('tr')[1] do
            expect(page).to have_content('HORIZONTAL Zone ID CARTESIAN CARTESIAN')
          end
        end

        within '.tiling-identification-systems-table' do
          within all('tr')[1] do
            expect(page).to have_content('System name -50 50 -30 30')
          end
          within all('tr')[2] do
            expect(page).to have_content('System name 1 -25 25 -15 15')
          end
        end

        within '.spatial-information-table' do
          within all('tr')[0] do
            expect(page).to have_content('Spatial Coverage Type: Vertical & Horizontal')
          end
          within all('tr')[1] do
            expect(page).to have_content('Hor. Datum Name	Ellipsoid Name Semi Major Axis Flattening Ratio Denominator')
          end
          within all('tr')[2] do
            expect(page).to have_content('Datum name Ellipsoid name 3.0	4.0')
          end
          within all('tr')[3] do
            expect(page).to have_content('Vert. Datum Name Distance Units Encoding Method	Resolutions')
          end
          within all('tr')[4] do
            expect(page).to have_content('Datum	Distance Units Encoding [1.0, 2.0, 3.0]')
          end
        end

        within '.location-keyword-preview' do
          within all('ul')[0] do
            expect(page).to have_content('GEOGRAPHIC REGION ARCTIC')
          end
          within all('ul')[1] do
            expect(page).to have_content('OCEAN ATLANTIC OCEAN')
          end
        end
      end
    end
  end
end
