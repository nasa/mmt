require 'rails_helper'

describe 'Groups list page', js: true, reset_provider: true do
  context 'when there are system level groups' do
    context 'when logging in as a regular user' do
      before do
        login
      end

      context 'when viewing the groups page' do
        before do
          click_on 'Manage CMR'
          click_on 'Groups'
        end

        context 'when there are groups' do
          before do
            # Add some groups
            click_on 'New Group'
            fill_in 'Group Name', with: 'Group 1'
            fill_in 'Group Description', with: 'test group'
            click_on 'Save'

            within '.eui-breadcrumbs' do
              click_on 'Groups'
            end

            click_on 'New Group'
            fill_in 'Group Name', with: 'Group 2'
            fill_in 'Group Description', with: 'test group 2'
            select('Alien Bobcat', from: 'Members directory')
            click_on 'Add Member(s)'
            click_on 'Save'
            sleep 1

            within '.eui-breadcrumbs' do
              click_on 'Groups'
            end
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
          end

          it 'does not display the system level group' do
            within '.groups-table' do
              expect(page).to have_no_content('Administrators CMR 3')
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
            end

            it 'displays the group members' do
              within '#groups-table' do
                expect(page).to have_content('Alien Bobcat')
              end
            end
          end

          context 'when logging out and logging in as admin user' do
            before do
              visit '/logout'
              login_admin
            end

            context 'when visiting the group page again' do
              before do
                click_on 'Manage CMR'
                click_on 'Groups'
              end

              it 'displays the system level group' do
                # intermittent error, Rspec ExpectationNotMetError
                # added logging comments to verify users and system level groups setup in cmr
                # using #syncrhonize, as used in draft_deletion_spec, ln 25
                # may need different solution
                page.document.synchronize do
                  within '.groups-table' do
                    expect(page).to have_content('Administrators CMR 3')
                  end
                end
              end

              it 'displays the newly added groups' do
                within '.groups-table' do
                  within all('tr')[1] do
                    expect(page).to have_content('Group 1 MMT_2 0')
                  end
                  within all('tr')[2] do
                    expect(page).to have_content('Group 2 MMT_2 1')
                  end
                end
              end
            end
          end
        end

        context 'when there are no groups' do
          it 'does not show any groups' do
            expect(page).to have_content('No groups found at this time.')
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
            expect(page).to have_content('Administrators CMR 3')
            expect(page).to have_content('SEDAC Test Group SEDAC 0')
          end
        end
      end
    end
  end
end
