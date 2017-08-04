# MMT-26

require 'rails_helper'

describe 'Create new draft from collection' do
  # short_name = '12345'
  # entry_title = 'Draft Title'

  context 'when editing a CMR collection' do
    before do
      login
      ingest_response, @concept_response = publish_collection_draft

      visit collection_path(ingest_response['concept-id'])

      click_on 'Edit Record'

      # expect(page).to have_content('Metadata Fields')
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Created Successfully!')
    # end

    # it 'creates a new draft' do
    #   expect(Draft.count).to eq(1)
    # end

    # it 'saves the provider id into the draft' do
    #   expect(Draft.last.provider_id).to eq('MMT_2')
    # end

    # it 'saves the native_id from the published collection' do
    #   draft = Draft.last
    #   expect(draft.native_id).to eq('full_collection_draft_id')
    # end

    # it 'displays the draft preview page' do
      # expect(page).to have_content('DRAFT RECORD')
      expect(page).to have_content(@concept_response.body['EntryTitle'])
    end
  end

  # TODO: Not sure how this is different than the above test, removing
  # context 'when editing a CMR collection that was originally published by MMT' do
  #   current_datetime = nil
  #   before do
  #     login
  #     draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
  #     visit collection_draft_path(draft)
  #     current_datetime = Time.now.utc.strftime('%Y-%m-%dT%H:%M:00.000Z')
  #     click_on 'Publish'
  #     wait_for_cmr

  #     expect(page).to have_link 'Edit Record'
  #     page.document.synchronize do
  #       click_on 'Edit Record'
  #     end

  #     expect(page).to have_content('Metadata Fields')
  #   end

  #   it 'copies all data from the published record into the draft' do
  #     draft = Draft.order('updated_at desc').first.draft
  #     metadata = build(:full_collection_draft).draft

  #     # set the metadata update date to the autopopulated date
  #     dates = metadata['MetadataDates']
  #     date = dates.find { |d| d['Type'] == 'UPDATE' }
  #     dates.delete(date)
  #     date['Date'] = current_datetime
  #     dates << date
  #     metadata['MetadataDates'] = dates

  #     expect(draft).to eq(metadata)
  #   end
  # end
end
