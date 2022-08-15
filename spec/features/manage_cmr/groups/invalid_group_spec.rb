describe 'Invalid Group' do
  context 'when visiting a group using an invalid concept id' do
    bad_concept_id = 'aabbccddee'

    before do
      VCR.use_cassette('edl', record: :new_episodes) do
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
