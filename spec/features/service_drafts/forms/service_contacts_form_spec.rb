describe 'Service Contacts Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'service_contacts')
    click_on 'Expand All'
  end

  context 'when submitting the form' do
    before do
      add_service_contact_groups
      add_service_contact_persons

      within '.nav-top' do
        click_on 'Save'
      end

      click_on 'Expand All'
    end

    context 'when viewing the form' do
      include_examples 'Service Contacts Form with confirmation'
    end
  end
end
