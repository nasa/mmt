require 'rails_helper'

describe 'Bulk Updates callout box on the Manage Metadata page' do
  draft_display_max_count = 5 # Should agree with @draft_display_max_count found in manage_metadata_controller

  before do
    login

    visit manage_metadata_path
  end

  context 'when there are bulk updates' do
    it 'displays the bulk updates' do
      expect(page).to have_content('ABCDEF123 | IN_PROGRESS')
      expect(page).to have_content('12345678 | COMPLETE')
      expect(page).to have_content('12345678 | COMPLETE')
    end

    context "when more than #{draft_display_max_count} bulk updates exist" do
      it 'displays the "More" link for bulk updates' do
        within '.bulk-update-callout' do
          expect(page).to have_link('More')
        end
      end

      context 'when clicking on the "More" link for bulk updates' do
        before do
          within '.bulk-update-callout' do
            click_on 'More'
          end
        end

        it 'displays the Bulk Updates Index page' do
          expect(page).to have_content('MMT_2 Bulk Updates')
          expect(page).to have_css('table.bulk-updates-list-table')
        end
      end

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

  # We should test this scenario when the bulk updates response endpoint is functional
  # and does not return a fixed response
  # context 'when no bulk updates exist'
end
