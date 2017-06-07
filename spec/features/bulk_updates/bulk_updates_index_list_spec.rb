require 'rails_helper'

describe 'Viewing the Bulk Updates Index Page', reset_provider: true do
  before do
    login
  end

  context 'when there are no bulk updates' do
    before do
      visit bulk_updates_path
    end

    it 'displays an appropriate message' do
      expect(page).to have_content('MMT_2 Bulk Updates')

      # we currently cannot test this as bulk updates are never cleared
      # CMR-3973 may allow us to clear bulk updates and test this
      # within '.bulk-updates-list-table' do
      #   expect(page).to have_content('No MMT_2 Bulk Updates found.')
      # end
    end
  end
end
