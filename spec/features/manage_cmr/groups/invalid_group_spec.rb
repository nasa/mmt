describe 'Invalid Group' do
  context 'when visiting a group using an invalid concept id' do
    bad_concept_id = 'aabbccddee'

    before do
      login
      visit group_path(bad_concept_id)
    end

    it 'displays an error message' do
      expect(page).to have_css('div.eui-banner--danger')
      expect(page).to have_content("Concept-id [#{bad_concept_id}] is not valid")
    end

    it 'redirects to groups index page' do
      within 'main section h2' do
        expect(page).to have_content('Groups')
      end
    end
  end
end
