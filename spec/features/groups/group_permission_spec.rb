describe 'Group permissions', reset_provider: true do
  modal_text = 'requires you change your provider context to MMT_2'

  before :all do
    edit_group_name = 'Test Group For New Invites 1'
    edit_group_description = 'Group to invite users to'
    @provider_id = 'MMT_2'

    @edit_group = create_group(
      name: edit_group_name,
      description: edit_group_description,
      provider_id: @provider_id
    )

    delete_group_name = 'Test Group For New Invites 2'
    delete_group_description = 'Group to invite users to'
    @provider_id = 'MMT_2'

    @delete_group = create_group(
      name: delete_group_name,
      description: delete_group_description,
      provider_id: @provider_id
    )
  end

  context 'when viewing a group' do
    before do
      login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))
    end

    context 'when the groups provider is in the users available providers', js: true do
      context 'when clicking the edit button' do
        before do
          visit group_path(@edit_group['concept_id'])

          click_on 'Edit'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Editing this group #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            # click_on 'Yes'
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'displays the edit group page' do
            expect(page).to have_content("Edit #{@edit_group_name}")
          end
        end
      end

      context 'when clicking the delete button' do
        before do
          visit group_path(@delete_group['concept_id'])

          click_on 'Delete'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Deleting this group #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            # click_on 'Yes'
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context and deletes the record' do
            expect(User.first.provider_id).to eq('MMT_2')
            expect(page).to have_content('Group successfully deleted.')
          end
        end
      end
    end
  end
end
