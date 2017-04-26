require 'rails_helper'

describe 'Viewing the Bulk Updates Index Page', reset_provider: true do
  before do
    login
  end

  context 'when there are bulk updates' do
    before do
    #   when the endpoint accepts and returns real data we will need to create some bulk updates

    visit bulk_updates_path
    end

    it 'displays the page with a list of bulk updates' do
      expect(page).to have_content('MMT_2 Bulk Updates')

      within '.bulk-updates-list-table' do
        expect(page).to have_content('ABCDEF123 IN_PROGRESS')
        expect(page).to have_content('12345678 COMPLETE')
        expect(page).to have_content('XYZ123456 COMPLETE')
      end
    end
  end

  # this can't be tested yet because the endpoint returns dummy data
  # context 'when there are no bulk updates'
end
