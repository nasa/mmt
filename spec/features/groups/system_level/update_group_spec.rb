# MMT-561
require 'rails_helper'

describe 'Updating System Level Groups', js: true do
  context 'when editing a system level group as an admin' do
    before :all do
      @group_name = random_group_name
      @group_description = random_group_description

      @group = create_group(
        name: @group_name,
        description: @group_description,
        provider_id: nil, # System Level groups do not have a provider_id
        admin: true,
        members: %w(abcd mnop qrst uvw)
      )
      # default management group for create_group is 'Administrators_2'
    end

    after :all do
      # System level groups need to be cleaned up to avoid attempting to create
      # a group with the same name in a nother test (Random names don't seem to be reliable)
      delete_group(concept_id: @group['concept_id'], admin: true)
    end

    before do
      login_admin

      visit edit_group_path(@group['concept_id'])
    end

    it 'displays the page and populated fields on the form' do
      expect(page).to have_content("Edit #{@group_name}")
      # SYS badge
      expect(page).to have_content('SYS')
      expect(page).to have_css('span.eui-badge--sm')

      # expect(page).to have_content("Edit #{@group_name}")
      expect(page).to have_field('Name', with: @group_name)
      expect(page).to have_checked_field('System Level Group?')
      expect(page).to have_field('Description', with: @group_description)

      expect(page).to have_select('Initial Management Group', disabled: true)
      # since Initial Management Group is disabled, cannot match value using 'selected' or 'with'
      within '#group_initial_management_group' do
        have_css('option', value: 'AG1200000001-CMR', selected: true)
      end
    end

    it 'has the approprate fields disabled' do
      expect(page).to have_field('Name', readonly: true)

      # clicking checkbox should not change anything
      uncheck 'System Level Group?'

      expect(page).to have_checked_field('System Level Group?')

      expect(page).to have_select('Initial Management Group', disabled: true)
    end

    context 'when updating the system level group' do
      let(:new_group_description) { 'New system group description' }

      before do
        fill_in 'Description', with: new_group_description

        within '.group-form' do
          click_on 'Submit'
        end

        wait_for_cmr
      end

      it 'displays the original and new group information' do
        expect(page).to have_content('Group was successfully updated.')

        expect(page).to have_content(@group_name)
        expect(page).to have_content(new_group_description)
        expect(page).to have_content('Administrators_2')

        # SYS badge
        expect(page).to have_content('SYS')
        expect(page).to have_css('span.eui-badge--sm')

        within '#group-members' do
          expect(page).to have_content('Alien Bobcat')
          expect(page).to have_content('Marsupial Narwal')
          expect(page).to have_content('Quail Racoon')
          expect(page).to have_content('Ukulele Vulcan')
        end
      end
    end
  end
end
