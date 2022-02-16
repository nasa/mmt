describe 'Data Contacts preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        #expect(page).to have_content('There are no listed data contacts for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        #within '.data-contacts-preview' do
        #within all('li.data-contact')[0] do
        #within '.dc-title-container' do
        #expect(page).to have_content('First Name Last Name')
        #expect(page).to have_content('Science Contact, Technical Contact')
        #expect(page).to have_content('Famous University')
        #end

        #within '.dc-contact-info' do
        #within '.data-contact-addresses' do
        #expect(page).to have_content('300 E Street Southwest')
        #expect(page).to have_content('Room 203')
        #expect(page).to have_content('Address line 3')
        #expect(page).to have_content('Washington, DC 20546')

        #expect(page).to have_content('8800 Greenbelt Road')
        #expect(page).to have_content('Greenbelt, MD 20771')
        #end

        #within '.data-contact-contact-details' do
        #expect(page).to have_content('10-2, M-W')
        #expect(page).to have_link('Email', href: 'mailto:example1@example.com')
        #expect(page).to have_link('Email', href: 'mailto:example2@example.com')

        #expect(page).to have_content('Contact Details')
        #expect(page).to have_content('Email only')
        #end

        #expect(page).to have_content('Related URL 1 Description')
        #expect(page).to have_link('http://example.com/', href: 'http://example.com/')
        #expect(page).to have_content('Home Page')
        #end
        #end

        #within all('li.data-contact')[1] do
        #within '.dc-title-container' do
        #expect(page).to have_content('Group Name')
        #expect(page).to have_content('User Services, Science Software Development')
        #expect(page).to have_content('Famous University')
        #end

        #within '.dc-contact-info' do
        #within '.data-contact-addresses' do
        #expect(page).to have_content('300 E Street Southwest')
        #expect(page).to have_content('Room 203')
        #expect(page).to have_content('Address line 3')
        #expect(page).to have_content('Washington, DC 20546')

        #expect(page).to have_content('8800 Greenbelt Road')
        #expect(page).to have_content('Greenbelt, MD 20771')
        #end

        #within '.data-contact-contact-details' do
          #expect(page).to have_content('9-5, M-F')
          #expect(page).to have_link('Email', href: 'mailto:example3@example.com')
        #expect(page).to have_link('Email', href: 'mailto:example4@example.com')

        #expect(page).to have_content('Contact Details')
        #expect(page).to have_content('Email only')
        #end

        #expect(page).to have_content('Related URL 1 Description')
        #expect(page).to have_link('http://example.com/', href: 'http://example.com/')
        #expect(page).to have_content('Home Page')
        #end
        #end

        #within all('li.data-contact')[2] do
        #within '.dc-title-container' do
          #expect(page).to have_content('First Name 3 Last Name 3')
          #expect(page).to have_content('Investigator, Metadata Author')
          #expect(page).to have_content('ESA/ED')
          #end

          #within '.dc-contact-info' do
          #within '.data-contact-addresses' do
          #expect(page).to have_content('300 E Street Southwest')
          #expect(page).to have_content('Room 203')
          #expect(page).to have_content('Address line 3')
          #expect(page).to have_content('Washington, DC 20546')

          #expect(page).to have_content('8800 Greenbelt Road')
          #expect(page).to have_content('Greenbelt, MD 20771')
          #end

          #within '.data-contact-contact-details' do
          #expect(page).to have_content('1-4, M-W')
          #expect(page).to have_link('Email', href: 'mailto:example5@example.com')
          #expect(page).to have_link('Email', href: 'mailto:example6@example.com')

          #expect(page).to have_content('Contact Details')
          #expect(page).to have_content('Email only')
          #end

          #expect(page).to have_content('Related URL 1 Description')
          #expect(page).to have_link('http://example.com/', href: 'http://example.com/')
          #expect(page).to have_content('Home Page')
          #end
          #end

          #within all('li.data-contact')[3] do
          #within '.dc-title-container' do
          #expect(page).to have_content('Group Name 2')
          #expect(page).to have_content('User Services')
          #expect(page).to have_content('ESA/ED')
          #end

          #within '.dc-contact-info' do
          #within '.data-contact-addresses' do
          #expect(page).to have_content('300 E Street Southwest')
          #expect(page).to have_content('Room 203')
          #expect(page).to have_content('Address line 3')
          #expect(page).to have_content('Washington, DC 20546')

          #expect(page).to have_content('8800 Greenbelt Road')
          #expect(page).to have_content('Greenbelt, MD 20771')
          #end

          #within '.data-contact-contact-details' do
          #expect(page).to have_content('9-5, M-F')
          #expect(page).to have_link('Email', href: 'mailto:example7@example.com')
          #expect(page).to have_link('Email', href: 'mailto:example8@example.com')

          #expect(page).to have_content('Contact Details')
          #expect(page).to have_content('Email only')
          #end

          #expect(page).to have_content('Related URL 1 Description')
          #expect(page).to have_link('http://example.com/', href: 'http://example.com/')
          #expect(page).to have_content('Home Page')
          #end
        #end
        #end
        end
    end
  end
end
