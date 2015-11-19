# MMT-58

require 'rails_helper'

describe 'Draft deletion', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
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
      expect(page).to have_content('Draft was successfully deleted')
    end

    it 'leaves the draft table in the database empty' do
      expect(Draft.count).to eq(0)
    end

    it 'returns to the dashboard page' do
      expect(page).to have_content('Your Open Drafts')
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

    it 'leaves the draft in the draft table' do
      expect(Draft.count).to eq(1)
    end

    it 'does NOT return to the dashboard page' do
      expect(page).to_not have_content('Your Open Drafts')
    end
  end
end
