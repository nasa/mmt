# MMT-154

require 'rails_helper'

describe 'Remove group members', reset_provider: true, js: true do
  group_name = 'Ocean Explorers'
  group_description = 'Group for Ocean Monitoring Scientists'

  before :all do
    @group = create_group(
      name: group_name,
      description: group_description,
      provider_id: 'MMT_2',
      members: %w(mnop qrst uvw)
    )
  end

  context 'when visiting add members page' do
    before do
      login

      visit group_path(@group['concept_id'])
    end

    context 'when selecting the select all checkbox' do
      before do
        find('#select_all_members').click
      end

      it 'selects all the checkboxes' do
        expect(page).to have_selector('input[value="mnop"]:checked')
        expect(page).to have_selector('input[value="qrst"]:checked')
        expect(page).to have_selector('input[value="uvw"]:checked')
      end

      context 'when unselecting the select all checkbox' do
        before do
          find('#select_all_members').click
        end

        it 'unselects all the checkboxes' do
          expect(page).to have_selector('input[value="mnop"]:not(:checked)')
          expect(page).to have_selector('input[value="qrst"]:not(:checked)')
          expect(page).to have_selector('input[value="uvw"]:not(:checked)')
        end

        context 'when removing a member from the group' do
          before do
            all('.remove-member-checkbox')[0].click
            click_on 'Remove Selected'
          end

          it 'removes the member from the group' do
            expect(page).to have_no_content('Marsupial Narwal')
          end
        end
      end
    end
  end
end
