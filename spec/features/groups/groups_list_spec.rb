require 'rails_helper'

describe 'Groups list page', reset_provider: true do
  context 'when there are system level groups' do
    context 'when logging in as a regular user' do
      before do
        login
      end

      context 'when viewing the groups page' do
        before do
          visit groups_path
        end

        context 'when there are no groups' do
          it 'does not show any groups' do
            expect(page).to have_content('No groups found at this time.')
          end

          context 'when there are groups' do
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
                  expect(page).to have_content('Group 1 MMT_2 0')
                end
                within all('tr')[2] do
                  expect(page).to have_content('Group 2 MMT_2 1')
                end
              end

              within '.groups-table' do
                expect(page).to have_no_content('Administrators_2 CMR 2')
              end
            end

            context 'when clicking on the group name' do
              before do
                click_on 'Group 2'
              end

              it 'displays the group information' do
                within '#main-content header' do
                  expect(page).to have_content('Group 2')
                  expect(page).to have_content('test group 2')
                end

                within '#groups-table' do
                  expect(page).to have_content('Alien Bobcat')
                end
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
                    expect(page).to have_content('Group 1 MMT_2 0')
                    expect(page).to have_content('Group 2 MMT_2 1')

                    # System level groups
                    expect(page).to have_content('Administrators_2 SYS CMR 2')
                  end
                end
              end
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
        click_on 'Manage CMR'
        click_on 'Groups'
      end

      it 'displays the system level groups' do
        # intermittent error, Rspec ExpectationNotMetError
        # added logging comments to verify users and system level groups setup in cmr
        # using #syncrhonize, as used in draft_deletion_spec, ln 25
        # may need different solution
        page.document.synchronize do
          within '.groups-table' do
            expect(page).to have_content('Administrators_2 SYS CMR 2')
            expect(page).to have_content('SEDAC Test Group SEDAC 0')
          end
        end
      end
    end
  end
end
