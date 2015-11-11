# MMT-45

require 'rails_helper'

describe 'Create new draft from cloning a collection', js: true do
  entry_id = 'doi:10.3334/ORNLDAAC/1_1'
  entry_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  context 'when editing a CMR collection' do
    before do
      login
      fill_in 'entry_id', with: entry_id
      click_on 'Find'

      click_on entry_id

      click_on 'Clone this Record'
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
  end
end
