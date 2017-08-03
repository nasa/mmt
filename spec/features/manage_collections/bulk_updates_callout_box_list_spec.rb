require 'rails_helper'

describe 'Bulk Updates callout box on the Manage Collections page' do
  draft_display_max_count = 5 # Should agree with @draft_display_max_count found in manage_collections_controller

  before do
    login

    visit manage_collections_path
  end

  # we currently cannot test this as bulk updates are never cleared
  # CMR-3973 may allow us to clear bulk updates and test this
  # context 'when there are no bulk updates' do
  #   it 'displays an appropriate message' do
  #     expect(page).to have_content('No MMT_2 Bulk Updates found.')
  #   end
  # end

  it 'displays the bulk updates callout box' do
    expect(page).to have_content('MMT_2 Bulk Updates')
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
