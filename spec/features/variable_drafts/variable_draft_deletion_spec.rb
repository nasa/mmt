require 'rails_helper'

describe 'Variable draft deletion', js: true do
  before do
    login
    draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(draft)
  end

  context 'when adding and deleting a single draft' do
    before do
      within('.cta') do
        click_on 'Delete Variable Draft'
        # Accept
        click_on 'Yes'
      end
    end

    it 'displays a confirmation message and returns to the drafts index page' do
      expect(page).to have_content('Variable Draft Deleted Successfully!')

      expect(page).to have_content('MMT_2 Variable Drafts')
    end
  end

  context 'when cancelling the deletion of a single draft' do
    before do
      within('.cta') do
        click_on 'Delete Variable Draft'
        # Reject
        click_on 'No'
      end
    end

    it 'does NOT return to the drafts index page' do
      expect(page).to_not have_content('MMT_2 Variable Drafts')
    end
  end
end
