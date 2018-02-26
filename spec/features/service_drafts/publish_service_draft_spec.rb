require 'rails_helper'

describe 'Publishing service draft records' do
  context 'when publishing a service draft record' do
    before do
      login
      draft = create(:full_service_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: '12345', draft_entry_title: 'Draft Title')
      visit service_draft_path(draft)
      click_on 'Publish Service Draft'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Published Successfully!')
    end
  end

  context 'when publishing an incomplete record', js: true do
    before do
      login
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit service_draft_path(draft)
      click_on 'Publish Service Draft'
    end

    it 'displays a message to the user' do
      message = 'This service draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.'
      expect(page).to have_content(message)
    end
  end
end
