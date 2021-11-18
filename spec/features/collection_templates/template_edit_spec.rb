# Tests for verifying the code changes involved in editing a template.
# The sparsity of these tests is because the underlying functionality
# of editing a template is assumed to be valid if the tests for collection draft
# editing are valid.  As such, only the template name changing and validation
# are currently tested.

describe 'While editing a collection template', js: true do
  before do
    login
    create(:full_collection_template, collection_template_name: 'An Example Template')
  end

  context 'when editing a draft' do
    before do
      draft = create(:full_collection_template, collection_template_name: 'An Example Template2')
      visit edit_collection_template_path(draft)
    end

    it 'provides error validation for template names' do
      expect(page).to have_content('An Example Template2')
      fill_in 'Template Name', with: 'An Example Template'
      # Need to do something else to trigger the validation because the fill_in
      # leaves focus in the Template Name field
      fill_in 'Short Name', with: 'Anything'
      find('body').click
      expect(page).to have_content('Template Name must be unique within a provider context')
    end

    it 'can edit a template name' do
      fill_in 'Template Name', with: 'A unique name'
      within '.nav-top' do
        click_on 'Done'
      end

      expect(page).to have_content('A unique name')
      # Add testing to show the rest is unchanged?
    end
  end
end
