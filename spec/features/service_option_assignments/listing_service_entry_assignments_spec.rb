# MMT-562

require 'rails_helper'

describe 'Viewing Service Option Assignments', js: true do
  context 'when viewing the service option assignments page' do
    before do
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

      login

      VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/service_entries_list', record: :none) do
        visit service_option_assignments_path
      end
    end

    it 'displays the service option assignments form' do
      expect(page).to have_content('MMT_2 Service Option Assignments')

      expect(page).to have_selector('#service_entries_fromList option', count: 4)
    end

    context 'when clicking the display selected assignments button' do
      context ' with no service options selected' do
        before do
          click_on 'Display Assignments'
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('You must select at least 1 service entry.')
        end
      end

      context 'with service options selected' do
        before do
          within '#service_entries_fromList' do
            # Deimos
            find('option[value="3E5F3D05-C8F5-C540-4484-F3E67A7D5E62"]').select_option

            # Polaris
            find('option[value="A19EDB8C-2253-3B19-E70D-1AC053DAC384"]').select_option
          end

          within '.button-container' do
            find('.add_button').click
          end
        end

        context 'when the service options have no assignemnts' do
          before do
            VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/empty', record: :none) do
              click_on 'Display Assignments'
            end
          end

          it 'displays no results message' do
            expect(page).to have_content('No assignments found for the selected service entries.')
          end
        end

        context 'when service options have assignments' do
          before do
            within '#service_entries_fromList' do
              # Deimos
              find('option[value="3E5F3D05-C8F5-C540-4484-F3E67A7D5E62"]').select_option

              # Polaris
              find('option[value="A19EDB8C-2253-3B19-E70D-1AC053DAC384"]').select_option
            end

            within '.button-container' do
              find('.add_button').click
            end

            VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/list', record: :none) do
              click_on 'Display Assignments'
            end
          end

          it 'displays the correct list of assignments' do
            expect(page).to have_selector('#service-option-assignments tbody tr', count: 4)
          end
        end
      end
    end
  end
end
