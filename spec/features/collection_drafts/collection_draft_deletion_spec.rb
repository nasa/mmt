# MMT-58

require 'rails_helper'

describe 'Draft deletion', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when adding and deleting a single draft' do
    before do
      within('.cta') do
        click_on 'Delete Draft'
        # Accept
        click_on 'Yes'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Deleted Successfully!')

      expect(page).to have_content('MMT_2 Collection Drafts')
    end
  end

  context 'when cancelling the deletion of a single draft' do
    before do
      within('.cta') do
        click_on 'Delete Draft'
        # Reject
        click_on 'No'
      end
    end

    it 'does NOT return to the manage collections page' do
      expect(page).to_not have_content('MMT_2 Collection Drafts')
    end
  end
end
