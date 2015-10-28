# MMT-51

require 'rails_helper'

describe 'Publishing draft records', js: true, reset_provider: true do
  context 'when publishing a draft record' do
    before do
      login
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
      click_on 'Publish'
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully published')
    end

    it 'displays the published record page' do
      expect(page).to have_content 'PUBLISHED RECORD'
    end

    it 'displays the published metadata' do
      # Data Identification
      expect(page).to have_content('Entry Id: 12345')
      expect(page).to have_content('Entry Title: Draft Title')
      expect(page).to have_content('Title: Publication reference title')
      expect(page).to have_content('Publisher: Publication reference publisher')
      expect(page).to have_content('Collection Progress: In work')
      expect(page).to have_content('Use Constraints: These are some use constraints')
      expect(page).to have_content('Author: Publication reference author')
      expect(page).to have_content('Publication Date: 2015-07-01T00:00:00.000Z')
      expect(page).to have_content('Data Language: English')

      # Descriptive Keywords
      # TODO

      # Metadata Information
      # TODO

      # Temporal Extent
      expect(page).to have_content('Beginning Date Time: 2014-07-01T00:00:00.000Z')
      expect(page).to have_content('Ending Date Time: 2014-08-01T00:00:00.000Z')
      expect(page).to have_content('Temporal Keywords test 1 Keyword test 2 Keyword')

      # Spatial Extent
      expect(page).to have_content('Spatial Keywords f47ac10b-58cc-4372-a567-0e02b2c3d479 abdf4d5c-55dc-4324-9ae5-5adf41e99da3')

      # Acquisition Information
      expect(page).to have_content('Short Name: test 1 P ShortName')
      expect(page).to have_content('Long Name: test 1 P LongName')
      expect(page).to have_content('Short Name: test 1 PI ShortName')
      expect(page).to have_content('Long Name: test 1 PI LongName')
      expect(page).to have_content('Short Name: test 1 PS ShortName')
      expect(page).to have_content('Long Name: test 1 PS LongName')
      expect(page).to have_content('Short Name: test 1 ShortName')
      expect(page).to have_content('Long Name: test 1 LongName')

      # Distribution Information
      # TODO
    end

    context 'when searching for the published record' do
      before do
        fill_in 'entry_id', with: '12345'
        click_on 'Find'
      end

      it 'displays the new published record in search results' do
        expect(page).to have_content('12345')
        expect(page).to have_content('Draft Title')
        expect(page).to have_content(today_string)
      end
    end
  end
end
