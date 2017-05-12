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

      within '.bulk-updates-list-table' do
        expect(page).to have_content('No MMT_2 Bulk Updates found.')
      end
    end
  end
end
