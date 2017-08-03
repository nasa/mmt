require 'rails_helper'

describe 'Related URLs preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There are no related URLs for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
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
              expect(page).to have_content('Get Data Earthdata Search')
            end
          end
          within all('li.card')[2] do
            within '.card-header' do
              expect(page).to have_content('Distribution URL')
            end
            within '.card-body' do
              expect(page).to have_content('Related URL 3 Description')
              expect(page).to have_link('https://example.com/', href: 'https://example.com/')
              expect(page).to have_content('Get Service DIF')
            end
          end
        end
      end
    end
  end
end
