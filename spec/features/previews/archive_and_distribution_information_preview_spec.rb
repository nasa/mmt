describe 'Archive And Distribution Information preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end
      it 'does not display metadata' do
        expect(page).to have_no_css('.file-archive-information-cards')
        expect(page).to have_no_css('.file-distribution-information-cards')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.file-archive-information-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('kml')
            end
            within all('.card-body')[0] do
              expect(page).to have_content('Native')
              expect(page).to have_content('Average File Size: 2 MB')
              expect(page).to have_content('Total Collection File Size: 25 GB')
              expect(page).to have_content('Description: A file archive information description')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('jpeg')
            end
            within all('.card-body')[0] do
              expect(page).to have_content('Supported')
              expect(page).to have_content('Average File Size: 3 MB')
              expect(page).to have_content('Total Collection File Size: 99 TB')
              expect(page).to have_content('Description: Another file archive information description')
            end
          end
        end

        within '.file-distribution-information-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('tiff')
            end
            within all('.card-body')[0] do
              expect(page).to have_content('Native')
              expect(page).to have_content('Media: disc, file, online')
              expect(page).to have_content('Average File Size: 2 KB')
              expect(page).to have_content('Total Collection File Size: 10 TB')
              expect(page).to have_content('Description: File distribution information description')
              expect(page).to have_content('Fees: $2,900')
            end
          end
        end
      end
    end
  end
end