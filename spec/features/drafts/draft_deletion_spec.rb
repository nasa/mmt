#MMT-58

require 'rails_helper'

describe 'Draft deletion', js: true do
  before do
    login
    create_new_draft
    visit '/dashboard'
    within('.open-drafts') do
      click_on '<Untitled Collection Record>'
    end
  end

  context 'when adding and deleting a single draft' do
    before do
      accept_confirm_from do
        within('.cta') do
          click_on 'Delete Draft'
        end
      end
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
      reject_confirm_from do
        within('.cta') do
          click_on 'Delete Draft'
        end
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
