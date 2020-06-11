describe 'Table of Contents on the Additional information tab', js:true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays a table of contents' do
        expect(page).to have_button('Table of Contents')
        expect(page).to have_link('Collection Information', href: '#Collection_Information', title: 'Jump to Collection Information')
        expect(page).to have_link('Data Identification', href: '#Data_Identification', title: 'Jump to Data Identification')
        expect(page).to have_link('Acquisition Information', href: '#Acquisition_Information', title: 'Jump to Acquisition Information')
        expect(page).to have_link('Temporal Information', href: '#Temporal_Information', title: 'Jump to Temporal Information')
        expect(page).to have_link('Spatial Information', href: '#Spatial_Information', title: 'Jump to Spatial Information')
        expect(page).to have_link('Data Centers', href: '#Data_Centers', title: 'Jump to Data Centers')
        expect(page).to have_link('Data Contacts', href: '#Data_Contacts', title: 'Jump to Data Contacts')
        expect(page).to have_link('Archive And Distribution Information', href: '#Archive_And_Distribution_Information', title: 'Jump to Archive And Distribution Information')
      end

      it 'renders accordions headers with named anchor tags' do
        expect(page).to have_css('a[name=Collection_Information]', visible: false)
        expect(page).to have_css('a[name=Data_Identification]', visible: false)
        expect(page).to have_css('a[name=Acquisition_Information]', visible: false)
        expect(page).to have_css('a[name=Temporal_Information]', visible: false)
        expect(page).to have_css('a[name=Spatial_Information]', visible: false)
        expect(page).to have_css('a[name=Data_Centers]', visible: false)
        expect(page).to have_css('a[name=Data_Contacts]', visible: false)
        expect(page).to have_css('a[name=Archive_And_Distribution_Information]', visible: false)
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        draft.draft['MetadataLanguage'] = 'spa'
        draft.save

        visit collection_draft_path(draft)

        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays a table of contents' do
        expect(page).to have_button('Table of Contents')
        expect(page).to have_link('Collection Information', href: '#Collection_Information', title: 'Jump to Collection Information')
        expect(page).to have_link('Data Identification', href: '#Data_Identification', title: 'Jump to Data Identification')
        expect(page).to have_link('Acquisition Information', href: '#Acquisition_Information', title: 'Jump to Acquisition Information')
        expect(page).to have_link('Temporal Information', href: '#Temporal_Information', title: 'Jump to Temporal Information')
        expect(page).to have_link('Spatial Information', href: '#Spatial_Information', title: 'Jump to Spatial Information')
        expect(page).to have_link('Data Centers', href: '#Data_Centers', title: 'Jump to Data Centers')
        expect(page).to have_link('Data Contacts', href: '#Data_Contacts', title: 'Jump to Data Contacts')
        expect(page).to have_link('Archive And Distribution Information', href: '#Archive_And_Distribution_Information', title: 'Jump to Archive And Distribution Information')
      end

      it 'renders accordions headers with named anchor tags' do
        expect(page).to have_css('a[name=Collection_Information]', visible: false)
        expect(page).to have_css('a[name=Data_Identification]', visible: false)
        expect(page).to have_css('a[name=Acquisition_Information]', visible: false)
        expect(page).to have_css('a[name=Temporal_Information]', visible: false)
        expect(page).to have_css('a[name=Spatial_Information]', visible: false)
        expect(page).to have_css('a[name=Data_Centers]', visible: false)
        expect(page).to have_css('a[name=Data_Contacts]', visible: false)
        expect(page).to have_css('a[name=Archive_And_Distribution_Information]', visible: false)
      end
    end
  end
end
