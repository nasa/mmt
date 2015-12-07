# MMT-45

require 'rails_helper'

describe 'Create new draft from cloning a collection', js: true do
  short_name = 'ACR3L2DM'
  entry_title = 'ACRIM III Level 2 Daily Mean Data V001'

  context 'when editing a CMR collection' do
    before do
      login
      fill_in 'short_name', with: short_name
      click_on 'Find'

      click_on short_name

      click_on 'Clone this Record'

      open_accordions
    end

    it 'creates a new draft' do
      expect(Draft.count).to eq(1)
    end

    it 'creates a new native id for the draft' do
      draft = Draft.first
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

    it 'removes Entry Id from the metadata' do
      within '.collection-information-preview' do
        expect(page).to have_no_content('Entry Id')
      end
    end

    it 'displays a message that the draft needs a unique Entry Id' do
      expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
    end
  end
end
