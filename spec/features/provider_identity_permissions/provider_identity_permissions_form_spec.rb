# MMT-582

require 'rails_helper'

describe 'Provider Identity Permissions pages and form', reset_provider: true do
  before :all do
    @group_name = 'Test Group for Provider Object Permissions'
    @group_description = 'Group for provider object permissions management'

    @group = create_group(
      name: @group_name,
      description: @group_description
    )

    wait_for_cmr
  end

  before do
    login
  end

  context 'when visiting the provider identities index page' do
    before do
      visit provider_identity_permissions_path
    end

    it 'shows the table with the provider group' do
      expect(page).to have_content('Provider Object Permissions')
      expect(page).to have_content('Click on a Group to access provider object permissions for that group.')

      within '.provider-group-table' do
        expect(page).to have_content("#{@group_name} #{@group_description} MMT_2 0")
      end
    end
  end

  context 'when visiting the provider identities form for the group' do
    before do
      visit edit_provider_identity_permission_path(@group['concept_id'])
    end

    it 'displays the page with the form and table of provider targets' do
      expect(page).to have_content("Provider Object Permissions for #{@group_name}")
      expect(page).to have_content("Set permissions for the #{@group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

      within '.provider-permissions-table' do
        expect(page).to have_css('tbody > tr', count: ProviderIdentityPermissionsHelper::PROVIDER_TARGETS.count)
        expect(page).to have_css('input[type=checkbox]', count: 100) # all checkboxes
        expect(page).to have_css('input[type=checkbox][checked]', count: 0)
        expect(page).to have_css('input[type=checkbox][disabled]', count: 54)
        expect(page).to have_css('input[type=checkbox]:not([disabled])', count: 46)
        expect(page).to have_css('input[type=checkbox]:not([checked])', count: 100)
      end
    end

    context 'when clicking on available permissions' do
      before do
        check('provider_permissions_GROUP_', option: 'read')
        check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'update')
        check('provider_permissions_OPTION_DEFINITION_', option: 'create')
        check('provider_permissions_PROVIDER_POLICIES_', option: 'delete')
      end

      it 'checks the permissions' do
        expect(page).to have_checked_field('provider_permissions_GROUP_', with: 'read')
        expect(page).to have_checked_field('provider_permissions_INGEST_MANAGEMENT_ACL_', with: 'update')
        expect(page).to have_checked_field('provider_permissions_OPTION_DEFINITION_', with: 'create')
        expect(page).to have_checked_field('provider_permissions_PROVIDER_POLICIES_', with: 'delete')
      end
    end

    context 'when clicking the Check/Uncheck all box when it is unchecked', js: true do
      before do
        check('provider_acls_select_all')
      end

      it 'checks all the available permissions checkboxes' do
        within '.provider-permissions-table' do
          expect(page).to have_css('input[type=checkbox]:checked', count: 46)
        end
      end

      context 'when clicking the Check/Uncheck all box when it is checked' do
        before do
          uncheck('provider_acls_select_all')
        end

        it 'unchecks all the boxes' do
          within '.provider-permissions-table' do
            expect(page).to have_css('input[type=checkbox]:checked', count: 0)
          end
        end
      end
    end
  end
end
