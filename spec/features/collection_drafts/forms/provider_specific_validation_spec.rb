describe 'Provider specific validation', js: true do
  context 'when viewing the forms as a provider with specific validation rules' do
    before do
      login(provider: 'MMT_1', providers: %w[MMT_1 MMT_2])

      @draft = create(:mmt_1_collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when viewing a field in the properties portion of the schema' do
      before do
        visit edit_collection_draft_path(@draft, form: 'collection_information')
      end

      it 'validates the form using the provider specific rules' do
        fill_in 'Version', with: 'v2.000'
        find('body').click
        expect(page).to have_content 'Version must match the provided pattern'
        expect(page).to have_content 'Version is too long'

        find('#draft_version_description').click

        click_on 'Help modal for Version'
        expect(page).to have_content 'Must not contain the letter V'
        expect(page).to have_content 'Maximum Length: 5'
        expect(page).to have_content 'Pattern: ^[^vV]+$'
      end
    end

    context 'when viewing a field in the definitions portion of the schema' do
      before do
        visit edit_collection_draft_path(@draft, form: 'collection_citations')
      end

      it 'validates the form using the provider specific rules' do
        click_on 'Help modal for Version'
        expect(page).to have_no_content 'Must not contain the letter V'
        expect(page).to have_no_content "Maximum Length: 5\n" # need the newline, otherwise it is a substring of the expectation below
        expect(page).to have_no_content 'Pattern: ^[^vV]+$'

        expect(page).to have_content 'Maximum Length: 50'
      end
    end
  end
end
