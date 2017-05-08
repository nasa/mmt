require 'rails_helper'

describe 'Bulk Updates callout box on the Manage Metadata page' do
  draft_display_max_count = 5 # Should agree with @draft_display_max_count found in manage_metadata_controller

  before do
    login

    visit manage_metadata_path
  end

  context 'when there are no bulk updates' do
    it 'displays the bulk updates' do
      expect(page).to have_content('No MMT_2 Bulk Updates found.')
    end
  end

  context 'when clicking on the "Initiate a Bulk Update" button' do
    before do
      within '.bulk-update-callout' do
        click_on 'Initiate a Bulk Update'
      end
    end

    it 'displays the Bulk Update Collection Search page' do
      expect(page).to have_content('MMT_2 Bulk Update Collection Search')

      expect(page).to have_css('form#bulk-updates-search')
    end
  end
end
