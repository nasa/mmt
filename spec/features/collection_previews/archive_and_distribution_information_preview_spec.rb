describe 'Archive And Distribution Information preview',js:true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end
      it 'does not display metadata' do
        #expect(page).to have_content('There is no archive and distribution information for this collection.')
        #expect(page).to have_no_css('.file-archive-information-preview')
        #expect(page).to have_no_css('.file-distribution-information-preview')
      end
    end

    context 'when there is metadata' do
      let(:draft) { create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first) }

      before do
        login
        visit collection_draft_path(draft)
      end

      it 'displays the correct progress circles' do
        within '#archive-and-distribution-information .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required.icon-green.file-distribution-information')
          expect(page).to have_css('.eui-icon.eui-required.icon-green.file-archive-information')
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.direct-distribution-information')
          expect(page).to have_link(nil, href: edit_collection_draft_path(draft, 'archive_and_distribution_information', anchor: 'file-distribution-information'))
          expect(page).to have_link(nil, href: edit_collection_draft_path(draft, 'archive_and_distribution_information', anchor: 'file-archive-information'))
          expect(page).to have_link(nil, href: edit_collection_draft_path(draft, 'archive_and_distribution_information', anchor: 'direct-distribution-information'))
        end
      end
      it 'displays the metadata' do
        screenshot_and_open_image
        #within '.file-archive-information-preview' do
        #within all('li.file-archive-information')[0] do
        #expect(page).to have_content('Format: kml')
        #expect(page).to have_content('Format Type: Native')
        #expect(page).to have_content('Format Description: A format description')
        #expect(page).to have_content('Average File Size: 2 MB')
        #expect(page).to have_content('Total Collection File Size: 25 GB')
        #expect(page).to have_content('Description: A file archive information description')
        #end
        #within all('li.file-archive-information')[1] do
        #expect(page).to have_content('Format: jpeg')
        #expect(page).to have_content('Format Description: A format description')
        #expect(page).to have_content('Average File Size: 3 MB')
        #expect(page).to have_content('Total Collection File Size: 99 TB')
        #expect(page).to have_content('Description: Another file archive information description')
        #end
        #end

        #within '.file-distribution-information-preview' do
        #within all('li.file-distribution-information')[0] do
        #expect(page).to have_content('Format: tiff')
        #expect(page).to have_content('Format Type: Native')
        #expect(page).to have_content('Format Description: A format description')
        #expect(page).to have_content('Media: disc, file, online')
        #expect(page).to have_content('Average File Size: 2 KB')
        #expect(page).to have_content('Total Collection File Size: 10 TB')
        #expect(page).to have_content('Description: File distribution information description')
        #expect(page).to have_content('Fees: $2,900')
        #end
        #end

        #within '.direct-distribution-information-preview' do
        #within all('li.direct-distribution-information')[0] do
        #expect(page).to have_content('Region: us-east-2')
        #expect(page).to have_content('S3 Bucket and Object Prefix Names: prefix-1, prefix-2, prefix-3')
        #expect(page).to have_content('S3 Credentials API Endpoint: link.com')
        #expect(page).to have_content('S3 Credentials API Documentation URL: amazon.com')
        #end
        #end
      end
    end
  end
end
