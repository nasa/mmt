require 'rails_helper'

describe 'Provider specific validation', js: true do
  context 'when viewing the forms as a provider with specific validation rules' do
    before do
      login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

      draft = create(:mmt_1_collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)
    end

    context 'when viewing a field in the properties portion of the schema' do
      before do
        click_on 'Collection Information'
      end

      it 'validates the form using the provider specific rules' do
        fill_in 'Version', with: 'v2.000'
        expect(page).to have_content 'Version must match the provided pattern'
        expect(page).to have_content 'Version is too long'

        click_on 'Help modal for Version'
        expect(page).to have_content 'Must not contain the letter V'
        expect(page).to have_content 'Maximum Length: 5 Pattern: ^[^vV]+$'
      end
    end

    context 'when viewing a field in the definitions portion of the schema' do
      before do
        click_on 'Collection Citations', match: :first
      end

      it 'validates the form using the provider specific rules' do
        click_on 'Help modal for Version'
        expect(page).to have_no_content 'Must not contain the letter V'
        expect(page).to have_no_content 'Maximum Length: 5 Pattern: ^[^vV]+$'

        expect(page).to have_content 'Maximum Length: 50'
      end
    end
  end
end
