describe 'Variable Drafts Related URLs form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'related_urls')
  end

  context 'when viewing the form with no values' do
    it 'does not display required icons for accordions in Related URLs section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Related URLs')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
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
        expect(page).to have_select('variable_draft_draft_related_urls_0_url_content_type', selected: ['Select a Url Content Type'])
        expect(page).to have_select('variable_draft_draft_related_urls_0_type', selected: 'Select Type', disabled: true)
        expect(page).to have_select('variable_draft_draft_related_urls_0_subtype', selected: 'Select a Subtype', disabled: true)
        expect(page).to have_select('variable_draft_draft_related_urls_0_format', selected: 'Select a Format')
        expect(page).to have_select('variable_draft_draft_related_urls_0_mime_type', selected: 'Select a Mime Type')
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '.multiple > .multiple-item-0' do
        fill_in 'Description', with: 'Test related url'
        select 'Publication URL', from: 'URL Content Type'
        select 'View Related Information', from: 'Type'
        select 'Science Data Product Software Documentation', from: 'Subtype'
        fill_in 'URL', with: 'science.org'
        select 'HTML', from: 'Format'
      end

      click_on 'Add another Related URL'

      within '.multiple > .multiple-item-1' do
        fill_in 'Description', with: 'Test another related url'
        select 'Publication URL', from: 'URL Content Type'
        select 'Algorithm Theoretical Basis Document (ATBD)', from: 'Subtype'
        fill_in 'URL', with: 'algorithms.org'
        select 'text/markdown', from: 'Mime Type'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        within '.multiple .multiple-item-0' do
          expect(page).to have_field('Description', with: 'Test related url')
          expect(page).to have_select('URL Content Type', selected: 'Publication URL')
          expect(page).to have_select('Type', selected: 'View Related Information')
          expect(page).to have_select('Subtype', selected: 'Science Data Product Software Documentation')
          expect(page).to have_field('URL', with: 'science.org')
          expect(page).to have_select('Format', selected: 'HTML')
        end

        within '.multiple .multiple-item-1' do
          expect(page).to have_field('Description', with: 'Test another related url')
          expect(page).to have_select('URL Content Type', selected: 'Publication URL')
          expect(page).to have_select('Type', selected: 'View Related Information')
          expect(page).to have_select('Subtype', selected: 'Algorithm Theoretical Basis Document (ATBD)')
          expect(page).to have_field('URL', with: 'algorithms.org')
          expect(page).to have_select('Mime Type', selected: 'text/markdown')
        end
      end
    end
  end

end
