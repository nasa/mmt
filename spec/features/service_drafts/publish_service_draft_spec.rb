describe 'Publishing service draft records' do
  context 'when publishing a service draft record' do
    let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }
    before do
      login
      visit service_draft_path(service_draft)
      click_on 'Publish Service Draft'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Published Successfully!')
    end
  end

  context 'when publishing an incomplete record', js: true do
    let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }
    let(:incomplete_message) { 'This service draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.' }

    before do
      login
      visit service_draft_path(service_draft)
      click_on 'Publish Service Draft'
    end

    it 'displays a message to the user' do
      expect(page).to have_content(incomplete_message)
    end
  end
end
