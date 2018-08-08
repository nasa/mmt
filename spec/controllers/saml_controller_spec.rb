require 'rails_helper'

describe SamlController do
  describe 'GET #sso' do
    before do
      get :sso
    end

    it 'redirects the user to launchpad for authentication' do
      expect(response.redirect_url).to start_with('https://auth.launchpad.nasa.gov/affwebservices/public/saml2sso')
    end
  end

  describe 'POST #acs' do
    context 'when launchpad returns a user with a valid SAMLResponse' do
      context 'when mocking methods in acs' do
        it 'redirects to the manage_collections_path' do
          mock_valid_acs_responses

          post :acs, SAMLResponse: ENV['launchpad_saml_response']

          expect(response).to redirect_to(manage_collections_path)
        end
      end
    end

    context 'when a user returns from launchpad with an invalid SAMLResponse' do
      it 'raises a ValidationError' do
        expect { post :acs, SAMLResponse: 'xxxxx' }.to raise_error(OneLogin::RubySaml::ValidationError)
      end
    end
  end
end
