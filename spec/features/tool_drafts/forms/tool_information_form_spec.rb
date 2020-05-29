describe 'Tool Drafts Tool Information Form', js: true do
  let(:tool_name) { 'Testing Form Tool Name' }
  let(:tool_long_name) { 'Testing Form Tool Long Name' }

  before do
    login
    draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_tool_draft_path(draft, 'tool_information')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Tool Information')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Tool Information')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Tool Information')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'URL')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 8)
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('tool_draft_draft_type', selected: 'Select a Type')

        expect(page).to have_select('tool_draft_draft_url_url_content_type', selected: ["Select a Url Content Type"])
        expect(page).to have_select('tool_draft_draft_url_type', selected: 'Select Type', disabled: true)
        expect(page).to have_select('tool_draft_draft_url_subtype', selected: 'Select a Subtype', disabled: true)
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '#tool-information' do
        fill_in 'Name', with: tool_name
        fill_in 'Long Name', with: tool_long_name
        fill_in 'Version', with: '1.0'
        fill_in 'Version Description', with: 'Description of the version of the tool.'
        select 'Downloadable Tool', from: 'Type'
        fill_in 'Last Updated Date', with: '2020-05-01T00:00:00Z'
        fill_in 'Description', with: 'Description of the factory made tool.'
        fill_in 'DOI', with: 'https://doi.org/10.1234/SOMEDAAC/5678'
      end

      within '#url' do
        fill_in 'Description', with: 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.'
        select 'Distribution URL', from: 'URL Content Type'
        select 'Download Software', from: 'Type'
        fill_in 'URL Value', with: 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Tool Draft Updated Successfully!')

        within '#tool-information' do
          expect(page).to have_field('Name', with: tool_name)
          expect(page).to have_field('Long Name', with: tool_long_name)
          expect(page).to have_field('Version', with: '1.0')
          expect(page).to have_field('Version Description', with: 'Description of the version of the tool.')
          expect(page).to have_select('Type', selected: 'Downloadable Tool')
          expect(page).to have_field('Last Updated Date', with: '2020-05-01T00:00:00Z')
          expect(page).to have_field('Description', with: 'Description of the factory made tool.')
          expect(page).to have_field('DOI', with: 'https://doi.org/10.1234/SOMEDAAC/5678')
        end

        within '#url' do
          expect(page).to have_field('Description', with: 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.')
          expect(page).to have_select('URL Content Type', selected: 'Distribution URL')
          expect(page).to have_select('Type', selected: 'Download Software')
          expect(page).to have_field('URL Value', with: 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html')
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 8)
      end
    end
  end
end
