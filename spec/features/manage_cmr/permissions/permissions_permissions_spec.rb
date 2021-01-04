describe 'Permissions Permissions', js: true, reset_provider: true do
  let(:permission_name) { "Testing Collection Permission #{Faker::Number.number(digits: 5)}" }
  let(:collection_permission) do
    {
      group_permissions: [{
        user_type: 'guest',
        permissions: ['read']
      }, {
        user_type: 'registered',
        permissions: %w[read order]
      }],
      catalog_item_identity: {
        'name': permission_name,
        'provider_id': 'MMT_2',
        'collection_applicable': true,
        'granule_applicable': true,
        'granule_identifier': {
          'access_value': {
            'min_value': 1.1,
            'max_value': 8.8,
            'include_undefined_value': true
          }
        }
      }
    }
  end
  let(:permission) { add_group_permissions(collection_permission) }

  context 'when viewing a permission' do
    context 'when the permission provider is not in my available providers' do
      before do
        login(provider: 'MMT_1', providers: ['MMT_1'])
        visit permission_path(permission['concept_id'])
      end

      it 'displays the correct message' do
        expect(page).to have_content("You don't have the appropriate permissions to show this permission.")
        expect(page).to have_content('Access Denied')
        expect(page).to have_content('It appears you do not have access to show this content.')
        expect(page).to have_content('If you feel you should have access, please check with your provider manager or ensure you are logged into the correct provider.')
      end
    end

    context 'when the permission provider is within my available providers' do
      before do
        login(provider: 'MMT_1', providers: %w[MMT_1 MMT_2])
        visit permission_path(permission['concept_id'])
      end

      it 'displays the correct message' do
        expect(page).to have_content('You need to change your current provider to show this permission. Click here to change your provider.')
        expect(page).to have_content('Not Current Provider')
        expect(page).to have_content('It appears you need to change your current provider to access to this content.')
        expect(page).to have_content('Please check the message above to access this content.')
      end

      context 'when clicking the link to change providers' do
        before do
          click_on 'Click here to change your provider.'
          wait_for_jQuery
        end

        it 'changes providers and displays the permission' do
          expect(User.first.provider_id).to eq('MMT_2')

          expect(page).to have_content(permission_name)
          within '#permission-groups-table' do
            # Search only groups
            within 'tbody > tr:nth-child(1)' do
              within 'td:nth-child(1)' do
                expect(page).to have_content('All Guest Users')
              end
              within 'td:nth-child(2)' do
                expect(page).to have_css('i.eui-icon.eui-check-o.icon-green')
              end
              within 'td:nth-child(3)' do
                expect(page).to have_no_css('i.eui-icon.eui-check-o.icon-green')
              end
            end
          end
        end
      end
    end
  end

  context 'when editing a permission' do
    context 'when the permission provider is not in my available providers' do
      before do
        login(provider: 'MMT_1', providers: ['MMT_1'])
        visit edit_permission_path(permission['concept_id'])
      end

      it 'displays the correct message' do
        expect(page).to have_content("You don't have the appropriate permissions to edit this permission.")
        expect(page).to have_content('Access Denied')
        expect(page).to have_content('It appears you do not have access to edit this content.')
        expect(page).to have_content('If you feel you should have access, please check with your provider manager or ensure you are logged into the correct provider.')
      end
    end

    context 'when the permission provider is within my available providers' do
      before do
        login(provider: 'MMT_1', providers: %w[MMT_1 MMT_2])
        visit edit_permission_path(permission['concept_id'])
      end

      it 'displays the correct message' do
        expect(page).to have_content('You need to change your current provider to edit this permission. Click here to change your provider.')
        expect(page).to have_content('Not Current Provider')
        expect(page).to have_content('It appears you need to change your current provider to access to this content.')
        expect(page).to have_content('Please check the message above to access this content.')
      end

      context 'when clicking the link to change providers' do
        before do
          click_on 'Click here to change your provider.'
          wait_for_jQuery
        end

        it 'changes providers and displays the permission' do
          expect(User.first.provider_id).to eq('MMT_2')

          expect(page).to have_content("Edit #{permission_name}")
        end
      end
    end
  end
end
