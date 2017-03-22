module Helpers
  module UserHelpers
    def login_admin
      login(admin: true)
    end

    def login(admin: false)
      # Mock calls to URS and login Test User
      if admin
        token_body = {
          'access_token'  => 'access_token_admin',
          'token_type'    => 'Bearer',
          'expires_in'    => 3600,
          'refresh_token' => 'refresh_token',
          'endpoint'      => '/api/users/adminuser'
        }

        profile_body = {
          'uid'           => 'adminuser',
          'first_name'    => 'Admin',
          'last_name'     => 'User',
          'email_address' => 'adminuser@example.com',
          'country'       => 'United States',
          'study_area'    => 'Other',
          'user_type'     => 'Public User',
          'affiliation'   => 'OTHER',
          'organization'  => 'Testing'
        }

        current_user_body = {
          'user' => {
            'addresses' => [{
              'country'   => 'United States',
              'id'        => 'admin-user-guid',
              'us_format' => false
            }],
            'creation_date'      => '2016-05-05T18:58:54Z',
            'email'              => 'admin@example.com',
            'first_name'         => 'Admin',
            'id'                 => 'user-echo-token',
            'last_name'          => 'User',
            'opt_in'             => false,
            'primary_study_area' => 'UNSPECIFIED',
            'user_domain'        => 'OTHER',
            'user_region'        => 'USA',
            'user_type'          => 'UNSPECIFIED',
            'username'           => 'adminuser'
          }
        }
      else
        token_body = {
          'access_token'  => 'access_token',
          'token_type'    => 'Bearer',
          'expires_in'    => 3600,
          'refresh_token' => 'refresh_token',
          'endpoint'      => '/api/users/testuser'
        }

        profile_body = {
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

        current_user_body = {
          'user' => {
            'addresses' => [{
              'country'   => 'United States',
              'id'        => 'test-user-guid',
              'us_format' => false
            }],
            'creation_date'      => '2016-05-05T18:58:54Z',
            'email'              => 'test@example.com',
            'first_name'         => 'Test',
            'id'                 => 'user-echo-token',
            'last_name'          => 'User',
            'opt_in'             => false,
            'primary_study_area' => 'UNSPECIFIED',
            'user_domain'        => 'OTHER',
            'user_region'        => 'USA',
            'user_type'          => 'UNSPECIFIED',
            'username'           => 'testuser'
          }
        }
      end

      profile_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: profile_body))
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_profile).and_return(profile_response)

      token_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: token_body))
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_oauth_tokens).and_return(token_response)

      current_user_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: current_user_body))
      allow_any_instance_of(Cmr::EchoClient).to receive(:get_current_user).and_return(current_user_response)

      # after the user authenticates with URS
      visit '/urs_callback?code=auth_code_here'
    end

    def visit_with_expiring_token(path)
      # Mock calls to URS and login Test User
      token_body = {
        'access_token'  => 'new_access_token',
        'token_type'    => 'Bearer',
        'expires_in'    => 3600,
        'refresh_token' => 'refresh_token',
        'endpoint'      => '/api/users/testuser'
      }
      token_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: token_body))
      allow_any_instance_of(Cmr::UrsClient).to receive(:refresh_token).and_return(token_response)

      # Tell the test that the token is expired
      allow_any_instance_of(ApplicationController).to receive(:server_session_expires_in).and_return(-5)

      visit path
    end

    def add_provider_context_permission(provider_ids)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#add_provider_context_permission' do
        Array.wrap(provider_ids).each do |provider_id|
          permission_params = {
            group_permissions: [{
              group_id: 'guidMMTUser',
              permissions: ['read']
            }, {
              group_id: 'guidMMTAdmin',
              permissions: ['read']
            }],
            provider_identity: {
              provider_id: provider_id,
              target: 'PROVIDER_CONTEXT'
            }
          }

          cmr_client.add_group_permissions(permission_params, 'access_token')
        end

        wait_for_cmr
      end
    end

    def delete_provider_context_permission(provider_id)
      permission = provider_context_permission_for_provider(provider_id)

      cmr_client.delete_permission(permission['concept_id'], 'access_token') if permission

      wait_for_cmr
    end

    def clear_provider_context_permissions
      provider_context_permissions.fetch('items', []).each do |permission|
        cmr_client.delete_permission(permission['concept_id'], 'access_token')
      end
    end

    def provider_context_permissions
      permission_options = {
        permitted_user: 'testuser',
        target: 'PROVIDER_CONTEXT',
        include_full_acl: true,
        page_size: 2000,
        page_num: 1
      }
      cmr_client.get_permissions(permission_options, 'access_token').body
    end

    def provider_context_permission_for_provider(provider_id)
      provider_context_permissions.fetch('items', []).each do |permission|
        return permission if permission.fetch('acl', {}).fetch('provider_identity', {})['provider_id'] == provider_id
      end
    end
  end
end
