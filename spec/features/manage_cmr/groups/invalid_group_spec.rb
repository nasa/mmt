describe 'Invalid Group', js:true do
  context 'when visiting a group using an invalid concept id' do
    bad_concept_id = 'aabbccddee'

    before do
      @token = 'jwt_access_token'
      allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        login
        visit group_path(bad_concept_id)
      end
    end

    it 'displays an error message' do
      expect(page).to have_css('div.eui-banner--danger')
      expect(page).to have_content("Invalid user group or the group is not created by you")
    end

    it 'redirects to groups index page' do
      within 'main section h2' do
        expect(page).to have_content('Groups')
      end
    end
  end
end
