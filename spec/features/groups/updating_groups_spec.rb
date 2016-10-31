require 'rails_helper'

describe 'Updating groups', reset_provider: true do
  context 'when editing a group' do
    before :all do
      @group_name = 'Test Group For New Invites'
      @group_description = 'Group to invite users to'
      @provider_id = 'MMT_2'

      @group = create_group(
        name: @group_name,
        description: @group_description,
        provider_id: @provider_id
      )
    end

    before do
      login

      visit edit_group_path(@group['concept_id'], edit_group: true)
    end

    context 'when the user updates the description' do
      before do
        fill_in 'Group Description', with: 'New description'
        click_on 'Save'
      end

      it 'displays the new group information' do
        within '#main-content header' do
          expect(page).to have_content(@group_name)
          expect(page).to have_content('New description')

          # does not have SYS badge
          expect(page).to have_no_content('SYS')
          expect(page).to have_no_css('span.eui-badge--sm')
        end
      end
    end

    context 'when the user removes the description' do
      before do
        fill_in 'Group Description', with: ''

        click_on 'Save'
      end

      it 'displays an error message' do
        expect(page).to have_content('Group Description is required.')
      end
    end
  end
end
