# MMT-562

require 'rails_helper'

describe 'Viewing Service Option Assignments', reset_provider: true, js: true do
  context 'when viewing the service option assignments page' do
    before do
      service_entries_by_provider_response = Echo::Response.new(Faraday::Response.new(status: 200, body: File.read('spec/fixtures/service_management/service_entries_by_provider.xml')))
      allow_any_instance_of(Echo::ServiceManagement).to receive(:get_service_entries_by_provider).and_return(service_entries_by_provider_response)

      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

      login

      visit service_option_assignments_path

      wait_for_ajax
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

          context 'when sorting by service implementation' do
            context 'in ascending order' do
              before do
                find('#service-option-assignments thead th:nth-child(2)').click
              end

              it 'sorts has the correct value in the first row' do
                within '#service-option-assignments tbody tr:first-child td:nth-child(2)' do
                  expect(page).to have_content('Deimos')
                end
              end

              it 'sorts has the correct value in the last row' do
                within '#service-option-assignments tbody tr:last-child td:nth-child(2)' do
                  expect(page).to have_content('Polaris')
                end
              end

              context 'in descending order' do
                before do
                  find('#service-option-assignments thead th:nth-child(2)').click
                end

                it 'sorts has the correct value in the first row' do
                  within '#service-option-assignments tbody tr:first-child td:nth-child(2)' do
                    expect(page).to have_content('Polaris')
                  end
                end

                it 'sorts has the correct value in the last row' do
                  within '#service-option-assignments tbody tr:last-child td:nth-child(2)' do
                    expect(page).to have_content('Deimos')
                  end
                end
              end
            end
          end

          context 'when sorting by service collection entry title' do
            context 'in ascending order' do
              before do
                find('#service-option-assignments thead th:nth-child(3)').click
              end

              it 'sorts has the correct value in the first row' do
                within '#service-option-assignments tbody tr:first-child td:nth-child(3)' do
                  expect(page).to have_content('ipsum')
                end
              end

              it 'sorts has the correct value in the last row' do
                within '#service-option-assignments tbody tr:last-child td:nth-child(3)' do
                  expect(page).to have_content('Testy long entry title')
                end
              end

              context 'in descending order' do
                before do
                  find('#service-option-assignments thead th:nth-child(3)').click
                end

                it 'sorts has the correct value in the first row' do
                  within '#service-option-assignments tbody tr:first-child td:nth-child(3)' do
                    expect(page).to have_content('Testy long entry title')
                  end
                end

                it 'sorts has the correct value in the last row' do
                  within '#service-option-assignments tbody tr:last-child td:nth-child(3)' do
                    expect(page).to have_content('ipsum')
                  end
                end
              end
            end
          end

          context 'when sorting by service collection short name' do
            context 'in ascending order' do
              before do
                find('#service-option-assignments thead th:nth-child(4)').click
              end

              it 'sorts has the correct value in the first row' do
                within '#service-option-assignments tbody tr:first-child td:nth-child(4)' do
                  expect(page).to have_content('ID')
                end
              end

              it 'sorts has the correct value in the last row' do
                within '#service-option-assignments tbody tr:last-child td:nth-child(4)' do
                  expect(page).to have_content('New Testy Test')
                end
              end

              context 'in descending order' do
                before do
                  find('#service-option-assignments thead th:nth-child(4)').click
                end

                it 'sorts has the correct value in the first row' do
                  within '#service-option-assignments tbody tr:first-child td:nth-child(4)' do
                    expect(page).to have_content('New Testy Test')
                  end
                end

                it 'sorts has the correct value in the last row' do
                  within '#service-option-assignments tbody tr:last-child td:nth-child(4)' do
                    expect(page).to have_content('ID')
                  end
                end
              end
            end
          end

          context 'when sorting by service collection version id' do
            context 'in ascending order' do
              before do
                find('#service-option-assignments thead th:nth-child(5)').click
              end

              it 'sorts has the correct value in the first row' do
                within '#service-option-assignments tbody tr:first-child td:nth-child(5)' do
                  expect(page).to have_content('02')
                end
              end

              it 'sorts has the correct value in the last row' do
                within '#service-option-assignments tbody tr:last-child td:nth-child(5)' do
                  expect(page).to have_content('223')
                end
              end

              context 'in descending order' do
                before do
                  find('#service-option-assignments thead th:nth-child(5)').click
                end

                it 'sorts has the correct value in the first row' do
                  within '#service-option-assignments tbody tr:first-child td:nth-child(5)' do
                    expect(page).to have_content('223')
                  end
                end

                it 'sorts has the correct value in the last row' do
                  within '#service-option-assignments tbody tr:last-child td:nth-child(5)' do
                    expect(page).to have_content('02')
                  end
                end
              end
            end
          end

          context 'when sorting by service collection granules only' do
            context 'in ascending order' do
              before do
                find('#service-option-assignments thead th:nth-child(6)').click
              end

              it 'sorts has the correct value in the first row' do
                within '#service-option-assignments tbody tr:first-child td:nth-child(6)' do
                  expect(page).to have_content('No')
                end
              end

              it 'sorts has the correct value in the last row' do
                within '#service-option-assignments tbody tr:last-child td:nth-child(6)' do
                  expect(page).to have_content('Yes')
                end
              end

              context 'in descending order' do
                before do
                  find('#service-option-assignments thead th:nth-child(6)').click
                end

                it 'sorts has the correct value in the first row' do
                  within '#service-option-assignments tbody tr:first-child td:nth-child(6)' do
                    expect(page).to have_content('Yes')
                  end
                end

                it 'sorts has the correct value in the last row' do
                  within '#service-option-assignments tbody tr:last-child td:nth-child(6)' do
                    expect(page).to have_content('No')
                  end
                end
              end
            end
          end

          context 'when sorting by service collection service option' do
            context 'in ascending order' do
              before do
                find('#service-option-assignments thead th:nth-child(7)').click
              end

              it 'sorts has the correct value in the first row' do
                within '#service-option-assignments tbody tr:first-child td:nth-child(7)' do
                  expect(page).to have_content('Ligula Vulputate')
                end
              end

              it 'sorts has the correct value in the last row' do
                within '#service-option-assignments tbody tr:last-child td:nth-child(7)' do
                  expect(page).to have_content('Risus Malesuada Sit')
                end
              end

              context 'in descending order' do
                before do
                  find('#service-option-assignments thead th:nth-child(7)').click
                end

                it 'sorts has the correct value in the first row' do
                  within '#service-option-assignments tbody tr:first-child td:nth-child(7)' do
                    expect(page).to have_content('Risus Malesuada Sit')
                  end
                end

                it 'sorts has the correct value in the last row' do
                  within '#service-option-assignments tbody tr:last-child td:nth-child(7)' do
                    expect(page).to have_content('Ligula Vulputate')
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
