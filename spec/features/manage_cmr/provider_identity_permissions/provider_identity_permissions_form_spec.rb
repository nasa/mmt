describe 'Provider Identity Permissions pages and form' do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')
  end

  before :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      @group_name = 'Test_Group_for_Provider_Object_Permissions_4'
      @group_description = 'Group for provider object permissions management'

      @group = create_group(
        name: @group_name,
        description: @group_description
      )
    end

    wait_for_cmr
  end

  after :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      delete_group(concept_id: @group['group_id'])
    end
  end

  context 'when viewing the provider identities permisisons index page as an administrator' do
    before do
      @token = 'jwt_access_token'
      login_admin
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        allow_any_instance_of(ApplicationController).to receive(:user_has_permission_to).and_return(true)

        visit provider_identity_permissions_path

        click_on 'Last'
      end
    end

    it 'shows the table with system and provider groups' do
      within '.provider-permissions-group-table' do
        expect(page).to have_content(@group_name)
      end
    end
  end

  context 'when visiting the provider identities permissions pages as a regular user' do
    before do
      @token = 'jwt_access_token'
      login
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

    end

    context 'when there are groups' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          visit provider_identity_permissions_path
          click_on 'Last'
        end
      end

      it 'shows the table with the provider group' do
        expect(page).to have_content('Provider Object Permissions')
        expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

        within '.provider-permissions-group-table' do
          expect(page).to have_content("#{@group_name} #{@group_description} MMT_2 0")
        end
      end
    end

    context 'when no groups are returned' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          failure = '{"errors":["An Internal Error has occurred."]}'
          failure_response = Cmr::Response.new(Faraday::Response.new(status: 500, body: JSON.parse(failure), response_headers: {}))
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_edl_groups).and_return(failure_response)
          allow_any_instance_of(ApplicationController).to receive(:user_has_permission_to).and_return(true)

          visit provider_identity_permissions_path
        end
      end

      it 'does not show any groups' do
        expect(page).to have_content('There are no Provider Groups available at this time or you do not have the right permissions.')
      end
    end

    context 'when visiting the provider identities form for the group' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_2_vcr", record: :none) do

          allow_any_instance_of(ApplicationController).to receive(:user_has_system_permission_to).and_return(true)
          # visit edit_provider_identity_permission_path(@group['group_id'])
          visit provider_identity_permissions_path
          click_on 'Last'
          click_on "#{@group_name}"
        end
      end

      it 'displays the page with the form and table of provider targets' do
        expect(page).to have_content("#{@group_name} Provider Object Permissions for MMT_2")
        expect(page).to have_content("Set permissions for the #{@group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

        within '.provider-permissions-table' do
          expect(page).to have_css('tbody > tr', count: ProviderIdentityPermissionsHelper::PROVIDER_TARGETS.count)
          expect(page).to have_css('input[type=checkbox]', count: 116) # all checkboxes
          expect(page).to have_css('input[type=checkbox][checked]', count: 0)
          expect(page).to have_css('input[type=checkbox][disabled]', count: 56)
          expect(page).to have_css('input[type=checkbox]:not([disabled])', count: 60)
          expect(page).to have_css('input[type=checkbox]:not([checked])', count: 116)

          expect(page).to have_no_content('Group Management for')
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
            expect(page).to have_css('input[type=checkbox]:checked', count: 60)
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
end
