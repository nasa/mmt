describe 'Variable Drafts Form Submission with Enter Key', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft)
  end

  context 'when pressing enter on a form' do
    before do
      fill_in 'Name', with: 'Name'

      page.find('#variable_draft_draft_name').native.send_keys(:enter)
    end

    it 'does not submit the form' do
      expect(page).to have_no_content('This page has invalid data. Are you sure you want to save it and proceed?')
    end
  end
end
