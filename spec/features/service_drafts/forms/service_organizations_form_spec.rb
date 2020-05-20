describe 'Service Organizations Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'service_organizations')
  end

  context 'when submitting the form with contact information' do
    before do
      add_service_organizations

      within '.nav-top' do
        click_on 'Save'
      end
    end

    context 'when viewing the form' do
      include_examples 'Service Organizations Full Form'
    end
  end
end
