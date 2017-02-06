# test for index page, created in MMT-507
# when ready, can include tests for guest users and registered users permissions page(s)

require 'rails_helper'

describe 'Viewing Collection Permissions' do
  before do
    login
  end

  context 'when viewing the permissions index page' do
    before do
      all_permissions_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/permissions/get_permissions_full.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_permissions).and_return(all_permissions_response)

      visit permissions_path
    end

    it 'displays the table of permissions' do
      within '#custom-permissions-table' do
        within 'tbody > tr:nth-child(1)' do
          expect(page).to have_content('perm 01')
          expect(page).to have_content('Search & Order')
        end

        within 'tbody > tr:nth-child(2)' do
          expect(page).to have_content('perm 02')
          expect(page).to have_content('Search & Order')
        end

        within 'tbody > tr:nth-child(3)' do
          expect(page).to have_content('perm 03')
          expect(page).to have_content('Search & Order')
        end

        within 'tbody > tr:nth-child(4)' do
          expect(page).to have_content('perm 04')
          expect(page).to have_content('Search')
        end

        within 'tbody > tr:nth-child(5)' do
          expect(page).to have_content('perm 05')
          expect(page).to have_content('Search & Order')
        end

        within 'tbody > tr:nth-child(6)' do
          expect(page).to have_content('perm 06')
          expect(page).to have_content('Search & Order')
        end

        within 'tbody > tr:nth-child(7)' do
          expect(page).to have_content('perm 07')
          expect(page).to have_content('Search & Order')
        end
      end
    end
  end
end
