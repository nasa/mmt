# MMT-45

require 'rails_helper'

describe 'Create new draft from cloning a collection', js: true, reset_provider: true do
  short_name = '12345'
  entry_title = 'Draft Title'

  context 'when editing a CMR collection' do
    before do
      login
      publish_draft

      fill_in 'Quick Find', with: short_name
      click_on 'Find'

      click_on short_name

      click_on 'Clone this Record'

      open_accordions
    end

    it 'creates a new draft' do
      expect(Draft.count).to eq(1)
    end

    it 'saves the provider id into the draft' do
      expect(Draft.last.provider_id).to eq('MMT_2')
    end

    it 'creates a new native id for the draft' do
      draft = Draft.last
      expect(draft.native_id).to include('mmt_collection_')
    end

    it 'displays the draft preview page' do
      expect(page).to have_content('DRAFT RECORD')
      expect(page).to have_content("#{entry_title} - Cloned")
    end

    it 'appends " - Cloned" to the metadata' do
      within '.collection-information-preview' do
        expect(page).to have_content("Entry Title: #{entry_title} - Cloned")
      end
    end

    it 'removes Short Name from the metadata' do
      within '.collection-information-preview' do
        expect(page).to have_no_content('Short Name')
      end
    end

    it 'displays a message that the draft needs a unique Short Name' do
      expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
    end

    context 'when clicking the message' do
      before do
        click_on 'Click here to enter a new Short Name.'
      end

      it 'displays the empty short name field' do
        expect(page).to have_field('Short Name', with: '')
      end
    end
  end

  context 'when cloning a CMR collection that was originally published by MMT' do
    before do
      login
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
      click_on 'Publish'
      click_on 'Clone this Record'
    end

    it 'copies all data from the published record into the draft' do
      draft = Draft.order('updated_at desc').first.draft
      metadata = build(:full_draft).draft

      # EntryTitle and ShortName should be different
      metadata['EntryTitle'] = "#{metadata['EntryTitle']} - Cloned"
      metadata.delete('ShortName')

      # Remove MetadataDates
      metadata.delete('MetadataDates')

      expect(draft).to eq(metadata)
    end
  end
end
