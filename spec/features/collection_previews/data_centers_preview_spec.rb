describe 'Data Centers preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        #find('.tab-label', text: 'Additional Information').click
      end

      it 'does not display metadata' do
        #expect(page).to have_content('There are no listed data centers for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        #find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the metadata' do
        #within '.data-centers-preview' do
        #within all('li.data-center')[0] do
        #within '.dc-title-container' do
        #expect(page).to have_content('AARHUS-HYDRO')
        #expect(page).to have_content('ARCHIVER')
        #expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
        #end

        #within '.dc-contact-info' do
        #within '.data-center-addresses' do
        #expect(page).to have_content('300 E Street Southwest')
        #expect(page).to have_content('Room 203')
        #expect(page).to have_content('Address line 3')
        #expect(page).to have_content('Washington, DC 20546')

        #expect(page).to have_content('8800 Greenbelt Road')
        #expect(page).to have_content('Greenbelt, MD 20771')
        #end

        #within '.data-center-contact-details' do
        #expect(page).to have_content('9-6, M-F')
        #expect(page).to have_link('Email', href: 'mailto:example@example.com')
        #expect(page).to have_link('Email', href: 'mailto:example2@example.com')

        #expect(page).to have_content('Contact Details')
        #expect(page).to have_content('Email only')
        #end

        #expect(page).to have_link('http://example.com/', href: 'http://example.com/')
        #end
        #end

        #within all('li.data-center')[1] do
        #within '.dc-title-container' do
        #expect(page).to have_content('ESA/ED')
        #expect(page).to have_content('ORIGINATOR, DISTRIBUTOR')
        #expect(page).to have_content('Educational Office, Ecological Society of America')
        #end

        #within '.dc-contact-info' do
        #within '.data-center-addresses' do
        #expect(page).to have_content('300 E Street Southwest')
        #expect(page).to have_content('Room 203')
        #expect(page).to have_content('Address line 3')
        #expect(page).to have_content('Washington, DC 20546')

        #expect(page).to have_content('8800 Greenbelt Road')
        #expect(page).to have_content('Greenbelt, MD 20771')
        #end

        #within '.data-center-contact-details' do
        #expect(page).to have_content('10-2, M-W')
        #expect(page).to have_link('Email', href: 'mailto:example@example.com')
        #expect(page).to have_link('Email', href: 'mailto:example2@example.com')

        #expect(page).to have_content('Contact Details')
        #expect(page).to have_content('Email only')
        #end

        #expect(page).to have_link('http://example.com/', href: 'http://example.com/')
        #end
        #end
        #end
        end
    end
  end
end
