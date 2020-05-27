describe 'Related URLs form', js: true do
  before do
    login
    draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_tool_draft_path(draft, 'related_urls')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Related URLs')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Related URLs')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Related URLs')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Related URL')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('tool_draft_draft_related_urls_0_url_content_type', selected: ["Select a Url Content Type"])
        expect(page).to have_select('tool_draft_draft_related_urls_0_type', selected: 'Select Type', disabled: true)
        expect(page).to have_select('tool_draft_draft_related_urls_0_subtype', selected: 'Select a Subtype', disabled: true)
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '.multiple > .multiple-item-0' do
        fill_in 'Description', with: 'Test related url'
        select 'Visualization URL', from: 'URL Content Type'
        select 'Get Related Visualization', from: 'Type'
        select 'Map', from: 'Subtype'
        fill_in 'URL', with: 'nasa.gov'
      end

      click_on 'Add another Related URL'

      within '.multiple > .multiple-item-1' do
        fill_in 'Description', with: 'Test another related url'
        select 'Publication URL', from: 'URL Content Type'
        select 'Algorithm Documentation', from: 'Subtype'
        fill_in 'URL', with: 'algorithms.org'
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

        within '.multiple .multiple-item-0' do
          expect(page).to have_field('Description', with: 'Test related url')
          expect(page).to have_select('URL Content Type', selected: 'Visualization URL')
          expect(page).to have_select('Type', selected: 'Get Related Visualization')
          expect(page).to have_select('Subtype', selected: 'Map')
          expect(page).to have_field('URL', with: 'nasa.gov')
        end

        within '.multiple .multiple-item-1' do
          expect(page).to have_field('Description', with: 'Test another related url')
          expect(page).to have_select('URL Content Type', selected: 'Publication URL')
          expect(page).to have_select('Type', selected: 'View Related Information')
          expect(page).to have_select('Subtype', selected: 'Algorithm Documentation')
          expect(page).to have_field('URL', with: 'algorithms.org')
        end
      end
    end
  end
end
