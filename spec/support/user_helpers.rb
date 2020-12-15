module Helpers
  module UserHelpers
    def profile_body(admin: false)
      body = {
        'uid'           => 'testuser',
        'first_name'    => 'Test',
        'last_name'     => 'User',
        'email_address' => 'testuser@example.com',
        'country'       => 'United States',
        'study_area'    => 'Other',
        'user_type'     => 'Public User',
        'affiliation'   => 'OTHER',
        'organization'  => 'Testing'
      }

      if admin
        body.merge({
          'uid'           => 'adminuser',
          'first_name'    => 'Admin',
          'last_name'     => 'User',
          'email_address' => 'adminuser@example.com'
        })
      end

      body
    end

    def token_body(admin: false, expiring: false)
      body = {
        'access_token'  => 'access_token',
        'token_type'    => 'Bearer',
        'expires_in'    => 3600,
        'refresh_token' => 'refresh_token',
        'endpoint'      => '/api/users/testuser'
      }

      body['access_token'] = 'new_access_token' if expiring
      body['access_token'] = 'access_token_admin' if admin

      body
    end

    def get_user(admin: false)
      if admin
        User.from_urs_uid('adminuser')
      else
        User.from_urs_uid('testuser')
      end
    end

    def login_admin(provider: 'MMT_2', providers: 'MMT_2')
      login(admin: true, provider: provider, providers: providers)
    end

    def real_login(provider: 'MMT_2', providers: 'MMT_2', method: 'env', associated: true, making_association: false)
      if method == 'env' && ENV['launchpad_login_required'] || method == 'launchpad'
        real_launchpad_login(providers: providers, associated: associated)
      else
        login(real_login: true, provider: provider, providers: providers, making_association: making_association)
      end
    end

    def login(real_login: false, admin: false, providers: 'MMT_2', provider: 'MMT_2', making_association: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#login' do

        return mock_login(admin: admin, providers: providers, provider: provider) unless real_login

        # Mock calls to URS and login Test User
        profile_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: profile_body(admin: admin)))
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_profile).and_return(profile_response)

        token_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: token_body(admin: admin)))
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_oauth_tokens).and_return(token_response)

        # Use the provided user or lookup a previously created user by URS UID
        user = User.find_or_create_by(urs_uid: profile_body(admin: admin)['uid'])

        if Array.wrap(providers).any?
          # This is a setter on the User model, because we're only supplying it
          # providers it will assign provider_id for us.
          user.providers = Array.wrap(providers)
          # provider id is only set if providers has only one
          user.provider_id = provider if Array.wrap(providers).count > 1
          user.save
        end

        if making_association
          # after the user authenticates with URS to associate their URS account with their Launchpad account
          visit '/urs_association_callback?code=auth_code_here'
        else
          # this will actually reset the available providers set above
          # after the user authenticates with URS when URS login is required
          visit '/urs_login_callback?code=auth_code_here'
        end
      end
    end

    def mock_login(admin: false, providers:, provider:)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#mock_login' do
        uid = admin ? 'adminuser' : 'testuser'
        token = admin ? 'access_token_admin' : 'access_token'
        user = User.from_urs_uid(uid)
        user.providers = Array.wrap(providers)
        # provider id is only set if providers has only one
        user.provider_id = provider if Array.wrap(providers).count > 1
        user.save

        allow_any_instance_of(ApplicationController).to receive(:ensure_user_is_logged_in).and_return(true)
        allow_any_instance_of(ApplicationController).to receive(:logged_in?).and_return(true)
        allow_any_instance_of(ApplicationController).to receive(:server_session_expires_in).and_return(1)
        allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(token)
      end
    end

    def mock_valid_acs_responses(admin: false, associated: true)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#mock_valid_acs_responses' do
        # We can't actually use a valid SAMLResponse from Launchpad because they are
        # time sensitive, so we need to mock that it is valid and provides the data we need
        allow_any_instance_of(OneLogin::RubySaml::Response).to receive(:is_valid?).and_return(true)
        allow_any_instance_of(SamlController).to receive(:pull_launchpad_cookie).and_return(token_body(admin: admin)['access_token'])

        nams_attributes = {
          auid: 'testuser',
          email: 'testuser@example.com'
        }
        allow_any_instance_of(OneLogin::RubySaml::Response).to receive(:attributes).and_return(nams_attributes)

        if associated
          # UrsClient get_urs_uid_from_nams_auid
          profile_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: profile_body(admin: admin)))
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_urs_uid_from_nams_auid).and_return(profile_response)
        end
      end
    end

    def real_launchpad_login(admin: false, providers: 'MMT_2', associated: true)
      mock_valid_acs_responses(admin: admin, associated: associated)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#mock_login' do
        # Use the provided user or lookup a previously created user by URS UID
        user = User.find_or_create_by(urs_uid: profile_body(admin: admin)['uid'])

        if Array.wrap(providers).any?
          # This is a setter on the User model, because we're only supplying it
          # providers it will assign provider_id for us.
          user.providers = Array.wrap(providers)
          # provider id is only set if providers has only one
          user.provider_id = provider if Array.wrap(providers).count > 1
          user.save
        end

        visit root_path
        # this button sends a post request (which Capybara cannot do) to SAML#acs,
        # the return endpoint after a successful Launchpad authentication.
        click_on 'Launchpad Test Login'
      end
    end

    def make_token_expiring
      token_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: token_body(expiring: true)))
      allow_any_instance_of(Cmr::UrsClient).to receive(:refresh_token).and_return(token_response)

      # Tell the test that the token is expired
      allow_any_instance_of(ApplicationController).to receive(:server_session_expires_in).and_return(-5)
    end

    def make_token_refresh_fail
      refresh_response_body = '{"error": "invalid_grant", "error_description": "Refresh token is invalid."}'
      refresh_response = cmr_fail_response(JSON.parse(refresh_response_body), 401)
      allow_any_instance_of(Cmr::UrsClient).to receive(:refresh_token).and_return(refresh_response)

      # Tell the test that the token is expired
      allow_any_instance_of(ApplicationController).to receive(:server_session_expires_in).and_return(-5)
    end

    def add_provider_context_permission(provider_ids)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#add_provider_context_permission' do

        sys_admin_group_concept = group_concept_from_name('Administrators_2', 'access_token_admin')

        Array.wrap(provider_ids).each do |provider_id|
          provider_group_concept = group_concept_from_name("#{provider_id} Admin Group", 'access_token_admin')

          permission_params = {
            group_permissions: [{
              group_id: provider_group_concept,
              permissions: ['read']
            }, {
              group_id: sys_admin_group_concept,
              permissions: ['read']
            }],
            provider_identity: {
              provider_id: provider_id,
              target: 'PROVIDER_CONTEXT'
            }
          }

          cmr_client.add_group_permissions(permission_params, 'access_token_admin')
        end

        wait_for_cmr
      end
    end

    def delete_provider_context_permission(provider_id)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#delete_provider_context_permission' do
        permission = provider_context_permission_for_provider(provider_id)

        cmr_client.delete_permission(permission['concept_id'], 'access_token') if permission

        wait_for_cmr
      end
    end

    def clear_provider_context_permissions
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#clear_provider_context_permissions' do
        provider_context_permissions.fetch('items', []).each do |permission|
          cmr_client.delete_permission(permission['concept_id'], 'access_token')
        end
      end
    end

    def provider_context_permissions
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#provider_context_permissions' do
        permission_options = {
          permitted_user: 'testuser',
          target: 'PROVIDER_CONTEXT',
          include_full_acl: true,
          page_size: 2000,
          page_num: 1
        }
        cmr_client.get_permissions(permission_options, 'access_token').body
      end
    end

    def provider_context_permission_for_provider(provider_id)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::UserHelpers#provider_context_permission_for_provider' do
        provider_context_permissions.fetch('items', []).each do |permission|
          return permission if permission.fetch('acl', {}).fetch('provider_identity', {})['provider_id'] == provider_id
        end
      end
    end
  end
end
