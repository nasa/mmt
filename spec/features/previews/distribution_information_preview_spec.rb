require 'rails_helper'

describe 'Distribution information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There is no distribution information for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit draft_path(draft)
      end

      it 'displays the metadata' do
        within '.distribution-information-preview' do
          within 'tbody' do
            within all('tr')[1] do
              expect(page).to have_content('test 2 DistributionMedia')
              expect(page).to have_content('test 2 DistributionFormat')
              expect(page).to have_content('42KB')
              expect(page).to have_content('9001MB')
              expect(page).to have_content('1234.56')
            end
            within all('tr')[2] do
              expect(page).to have_content('test 1 DistributionMedia')
              expect(page).to have_content('test 1 DistributionFormat')
              expect(page).to have_content('25TB')
              expect(page).to have_content('1234.56')
            end
          end
        end

        within '.related-urls-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('Collection URL')
            end
            within '.card-body' do
              expect(page).to have_content('Related URL 1 Description')
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
              expect(page).to have_content('Data Set Landing Page')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('Distribution URL')
            end
            within '.card-body' do
              expect(page).to have_content('Related URL 2 Description')
              expect(page).to have_link('https://search.earthdata.nasa.gov/', href: 'https://search.earthdata.nasa.gov/')
              expect(page).to have_content('Get Service Earthdata Search')
            end
          end
          within all('li.card')[2] do
            within '.card-header' do
              expect(page).to have_content('Distribution URL')
            end
            within '.card-body' do
              expect(page).to have_content('Related URL 3 Description')
              expect(page).to have_link('https://example.com/', href: 'https://example.com/')
              expect(page).to have_content('Get Data DIF')
            end
          end
        end
      end
    end
  end
end
