# MMT-150,

require 'rails_helper'

describe 'Groups' do
  context 'when visiting a group using an invalid concept id' do
    bad_concept_id = 'aabbccddee'

    before do
      login
      visit "/groups/#{bad_concept_id}"
    end

    it 'displays an error message' do
      expect(page).to have_css('div.banner-danger')
      expect(page).to have_content("Concept-id [#{bad_concept_id}] is not valid")
    end

    it 'redirects to groups index page' do
      within 'main header' do
        expect(page).to have_content('Groups') # match groups index.html.erb title
      end
    end
  end

  context 'when deleting a group' do
    # create a new group

    # delete the group

    it 'redirects to ___ page'

    it 'displays group deletion success message'
  end
end
