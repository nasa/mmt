require 'rails_helper'

describe 'Groups list page', reset_provider: true do
  context 'when there are system level groups' do
    context 'when logging in as a regular user' do
      before do
        login
      end

      context 'when viewing the groups page' do

        context 'when there are no groups' do
          before do
            visit groups_path
          end

          it 'does not show any groups' do
            expect(page).to have_content('No groups found at this time.')
          end

          context 'when there are groups under the pagination limit' do
            before :all do
              # TODO: We could mock this response as we're only testing that they list properly
              # Create a few groups to list
              create_group(
                name: 'Group 1',
                description: 'test group',
                provider_id: 'MMT_2'
              )

              create_group(
                name: 'Group 2',
                description: 'test group 2',
                provider_id: 'MMT_2',
                members: %w(abcd)
              )
            end

            before do
              wait_for_cmr

              visit groups_path
            end

            it 'displays a list of groups' do
              within '.groups-table' do
                within all('tr')[1] do
                  expect(page).to have_content('Group 1 test group MMT_2 0')
                end
                within all('tr')[2] do
                  expect(page).to have_content('Group 2 test group 2 MMT_2 1')
                end
              end

              within '.groups-table' do
                expect(page).to have_no_content('Administrators_2 The group of users that manages the CMR. CMR 2')
              end
            end

            context 'when logging out and logging in as admin user' do
              before do
                visit logout_path

                login_admin
              end

              context 'when visiting the group page again' do
                before do
                  visit groups_path
                end

                it 'displays the provider and system level groups' do
                  within '.groups-table' do
                    # Provider level groups
                    expect(page).to have_content('Group 1 test group MMT_2 0')
                    expect(page).to have_content('Group 2 test group 2 MMT_2 1')

                    # System level groups
                    expect(page).to have_content('Administrators_2 SYS The group of users that manages the CMR. CMR 2')
                  end
                end
              end
            end
          end
        end

        context 'when there are paginated groups' do
          before do
            # mock for group list page 1
            groups_page_1_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/groups/groups_index_page_1.json'))))
            page_1_options = { page_size: 25, page_num: 1 }
            allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).with(page_1_options, 'access_token').and_return(groups_page_1_response)

            # mock for group list page 2
            groups_page_2_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/groups/groups_index_page_2.json'))))
            page_2_options = { page_size: 25, page_num: 2 }
            allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).with(page_2_options, 'access_token').and_return(groups_page_2_response)

            visit groups_path
          end

          it 'lists the first page of groups' do
            within '.groups-table' do
              expect(page).to have_selector('tbody tr', count: 25)
              # cmr controls the order so we should not test specific groups
            end
          end

          it 'displays the pagination information for page 1' do
            expect(page).to have_content('Showing groups 1 - 25 of 31')
            within '.eui-pagination' do
              # first, 1, 2, next, last
              expect(page).to have_selector('li', count: 5)
            end
            expect(page).to have_css('.active-page', text: '1')
          end

          context 'when clicking to the second page' do
            before do
              click_link '2'
            end

            it 'lists the second page of groups' do
              within '.groups-table' do
                expect(page).to have_selector('tbody tr', count: 6)
                # cmr controls the order so we should not test specific groups
              end
            end

            it 'displays the pagination information for page 2' do
              expect(page).to have_content('Showing groups 26 - 31 of 31')
              within '.eui-pagination' do
                # first, previous, 1, 2, last
                expect(page).to have_selector('li', count: 5)
              end
              expect(page).to have_css('.active-page', text: '2')
            end
          end
        end
      end
    end
  end

  context 'when logging in as a cmr admin user' do
    before do
      login_admin
    end

    context 'when viewing the groups index page' do
      before do
        visit groups_path
      end

      it 'displays the system level groups' do
        # intermittent error, Rspec ExpectationNotMetError
        # added logging comments to verify users and system level groups setup in cmr
        # using #syncrhonize, as used in draft_deletion_spec, ln 25
        # may need different solution
        page.document.synchronize do
          within '.groups-table' do
            expect(page).to have_content('Administrators_2 SYS The group of users that manages the CMR. CMR 2')
            expect(page).to have_content('SEDAC Test Group Test group for provider SEDAC 0')
          end
        end
      end
    end
  end
end
