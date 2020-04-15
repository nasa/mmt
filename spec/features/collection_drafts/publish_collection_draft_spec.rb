describe 'Publishing collection draft records', js: true do
  before do
    login
  end

  context 'when publishing a collection draft record' do
    before do
      @email_count = ActionMailer::Base.deliveries.count

      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: '12345', draft_entry_title: 'Draft Title')
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Published Successfully!')
    end

    it 'displays the published record page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collections')
        expect(page).to have_content('12345_1')
      end
    end

    it 'displays the published metadata' do
      within '.collection-short-name' do
        expect(page).to have_content('12345')
      end

      within '.collection-title' do
        expect(page).to have_content('Draft Title')
      end

      within '.collection-overview-table' do
        expect(page).to have_no_css('td', text: 'Not Provided', count: 8)
      end
    end

    it 'sends the user a notification email' do
      expect(ActionMailer::Base.deliveries.count).to eq(@email_count + 1)
    end

    context 'when searching for the published record' do
      before do
        fill_in 'keyword', with: '12345'
        click_on 'Search Collections'
      end

      it 'displays the new published record in search results' do
        expect(page).to have_content('12345')
        expect(page).to have_content('Draft Title')
        expect(page).to have_content(today_string)
      end
    end
  end

  context 'when publishing an incomplete record' do
    before do
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays a message to the user' do
      message = 'This draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.'
      expect(page).to have_content(message)
    end
  end

  context 'when publishing a collection draft and CMR returns a 500 error' do
    before do
      draft = create(:full_collection_draft)
      visit collection_draft_path(draft)

      # Adding question marks to token causes a 500 error for now
      bad_response = { 'Echo-Token' => '???' }
      allow_any_instance_of(Cmr::BaseClient).to receive(:token_header).and_return(bad_response)

      # Record the request so we can keep testing for 500 errors
      VCR.configure do |c|
        c.ignore_localhost = false
      end

      VCR.use_cassette('ingest/500_error', record: :none) do
        click_on 'Publish'
      end

      VCR.configure do |c|
        c.ignore_localhost = true
      end
    end

    it 'displays a link to submit feedback' do
      recorded_request_id = 'a037669d-c94e-45d1-838c-707b884245ab'

      expect(page).to have_css('.eui-banner--danger')

      expect(page).to have_link('Click here to submit feedback')
      expect(page).to have_xpath("//a[contains(@href,'#{recorded_request_id}')]")
    end
  end

  context 'when publishing a new draft that has a non url encoded native id' do
    before do
      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first, native_id: 'not & url, encoded / native id', draft_short_name: 'test short name')
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Published Successfully!')
    end

    it 'displays the published record page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collections')
        expect(page).to have_content('test short name_1')
      end
    end
  end

  context 'when publishing a draft with data that will return a CMR ingest error' do
    let(:draft) { create(:collection_invalid_ingest_error, user: User.where(urs_uid: 'testuser').first) }

    before do
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays a generic error message' do
      expect(page).to have_content('Collection Draft was not published successfully')
    end

    it 'displays the error returned from CMR' do
      within 'section.errors' do
        expect(page).to have_content('This draft has the following errors:')
        expect(page).to have_link('Spatial Extent', href: edit_collection_draft_path(draft, 'spatial_information'))
        expect(page).to have_content('Orbit Parameters must be defined for a collection whose granule spatial representation is ORBIT.')
      end
    end
  end

  context 'when publishing a record that was valid when the page loaded, but not when the user tried to publish' do
    before do
      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: '12345', draft_entry_title: 'Draft Title')
      visit collection_draft_path(draft)
      draft.draft['Version'] = ''
      draft.save
      click_on 'Publish'
    end

    it 'displays an error message' do
      expect(page).to have_content('This collection can not be published')
    end
  end
end
