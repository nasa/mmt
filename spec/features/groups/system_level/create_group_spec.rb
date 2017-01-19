# MMT-561
require 'rails_helper'

describe 'Creating System Level Groups', reset_provider: true do
  before :all do
    @group_name = 'Generic Provider Initial Management Group for Tests'
    @group = create_group(
      name: @group_name,
      description: 'Group for Initial Managment Group'
    )
  end

  context 'when viewing new groups form as an admin user' do
    before do
      login_admin

      visit new_group_path
    end

    it 'shows the system group checkbox' do
      expect(page).to have_content('System Level Group?')
      expect(page).to have_unchecked_field('system_group')
    end

    it 'shows provider and system level groups in the Inital Management Group select dropdown' do
      expect(page).to have_select('Initial Management Group', with_options: ['Administrators', 'Administrators_2', @group_name])
    end

    context 'when clicking the system group checkbox', js: true do
      before do
        check 'System Level Group?'
      end

      it 'changes the New Group header title' do
        expect(page).to have_content('New CMR Group')
        expect(page).to have_content('SYS')
        expect(page).to have_css('span.eui-badge--sm')
      end

      it 'changes the Initial Management Group options to only have system groups' do
        expect(page).to have_select('Initial Management Group', with_options: ['Administrators', 'Administrators_2'])

        within '#group_initial_management_group' do
          expect(page).to have_no_content(@group_name)
        end
      end
    end

    context 'when creating the system level group', js: true do
      # Because this is a system level group, it never gets cleaned up, we need to ensure
      # that it's as random as possible. A random Superhero name combined with the current
      # timestamp should do.
      let(:group_name) { "#{Faker::Superhero.name} #{Time.now.to_i}" }
      let(:group_description) { Faker::Lorem.paragraph }

      before do
        # fill in group
        fill_in 'Name', with: group_name
        check 'System Level Group?'
        fill_in 'Description', with: group_description
        select('Administrators_2', from: 'Initial Management Group')

        # choose users
        select('Alien Bobcat', from: 'Members Directory')
        select('Quail Racoon', from: 'Members Directory')
        click_on 'Add Member(s)'

        within '.group-form' do
          click_on 'Submit'
        end

        wait_for_cmr
      end

      it 'redirects to the group show page and shows the system level group information' do
        expect(page).to have_content('Group was successfully created.')

        expect(page).to have_content(group_name)
        expect(page).to have_content(group_description)
        expect(page).to have_content('Administrators_2')

        # SYS badge
        expect(page).to have_content('SYS')
        expect(page).to have_css('span.eui-badge--sm')

        within '#group-members' do
          expect(page).to have_content('Alien Bobcat')
          expect(page).to have_content('Quail Racoon')
        end
      end
    end
  end
end
