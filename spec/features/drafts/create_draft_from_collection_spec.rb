# MMT-26

require 'rails_helper'

describe 'Create new draft from collection', js: true do
  short_name = 'ACR3L2DM'
  entry_title = 'ACRIM III Level 2 Daily Mean Data V001'

  context 'when editing a CMR collection' do
    before do
      login
      fill_in 'short_name', with: short_name
      click_on 'Find'

      click_on short_name

      click_on 'Edit Record'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully created')
    end

    it 'creates a new draft' do
      expect(Draft.count).to eq(1)
    end

    it 'saves the native_id from the published collection' do
      draft = Draft.first
      expect(draft.native_id).to eq('collection25')
    end

    it 'displays the draft preview page' do
      expect(page).to have_content('DRAFT RECORD')
      expect(page).to have_content(entry_title)
    end
  end

  context 'when editing a CMR collection that was originally published by MMT' do
    current_datetime = nil
    before do
      login
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
      current_datetime = Time.now.utc.strftime('%Y-%m-%dT%H:%M:00.000Z')
      click_on 'Publish'
      click_on 'Edit Record'
    end

    it 'copies all data from the published record into the draft' do
      draft = Draft.order('updated_at desc').first.draft
      metadata = build(:full_draft).draft

      # set the metadata update date to the autopopulated date
      dates = metadata['MetadataDates']
      date = dates.find { |d| d['Type'] == 'UPDATE' }
      dates.delete(date)
      date['Date'] = current_datetime
      dates << date
      metadata['MetadataDates'] = dates

      expect(draft).to eq(metadata)
    end
  end
end
