require 'rails_helper'

describe 'Collection citations preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_no_css('.collection-citation-cards')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.collection-citation-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('Citation title')
              expect(page).to have_content('v1')
            end
            within all('.card-body')[0] do
              expect(page).to have_content('Created by: Citation creator')
              expect(page).to have_content('Editor: Citation editor')
              expect(page).to have_content('Published by: Citation publisher')
              expect(page).to have_content('Released: 2015-07-01')
            end
            within all('.card-body')[1] do
              expect(page).to have_content('Citation other details')
            end
            within all('.card-body')[2] do
              expect(page).to have_link('http://example.com', href: 'http://example.com')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('Citation title 1')
              expect(page).to have_content('v2')
            end
            within all('.card-body')[0] do
              expect(page).to have_content('Created by: Citation creator 1')
            end
            within all('.card-body')[1] do
              expect(page).to have_link('http://example2.com', href: 'http://example2.com')
            end
          end
        end
      end
    end
  end
end
