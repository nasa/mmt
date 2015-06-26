module Helpers
  module UserHelpers
    def login
      # Mock calls to URS and login Test User
      token_body = {"access_token"=>"access_token", "token_type"=>"Bearer", "expires_in"=>3600, "refresh_token"=>"refresh_token", "endpoint"=>"/api/users/testuser"}
      token_response = Cmr::Response.new(Faraday::Response.new({status: 200, body: token_body}))
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_oauth_tokens).and_return(token_response)

      profile_body = {"uid"=>"testuser", "first_name"=>"Test", "last_name"=>"User", "email_address"=>"testuser@example.com", "country"=>"United States", "study_area"=>"Other", "user_type"=>"Public User", "affiliation"=>"OTHER", "organization"=>"Testing"}
      profile_response = Cmr::Response.new(Faraday::Response.new({status: 200, body: profile_body}))
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_profile).and_return(profile_response)

      # after the user authenticates with URS
      visit '/urs_callback?code=auth_code_here'
    end
  end
end
