require 'rails_helper'

describe 'Creating a variable draft from cloning a variable', js: true do
  before :all do
    @ingest_response = publish_variable_draft
  end

  context 'when cloning a published variable' do
    before do
      login

      visit variable_path(@ingest_response['concept-id'])

      click_on 'Clone Variable Record'
    end

    it 'displays the draft preview page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
      end

      expect(page).to have_content('Publish Variable Draft')
      expect(page).to have_content('Delete Variable Draft')
      expect(page).to have_content('Metadata Fields')
      expect(page).to have_content('Variable Information')
    end

    it 'removes the Name and Long Name from the metadata' do
      within '#variable_draft_draft_name_preview' do
        expect(page).to have_css('p', text: 'No value for Name provided.')
      end

      within '#variable_draft_draft_long_name_preview' do
        expect(page).to have_css('p', text: 'No value for Long Name provided.')
      end
    end

    it 'displays a message that the draft needs a unique Name' do
      expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
    end

    context 'when clicking the banner message to enter a new Name' do
      before do
        click_on 'Click here to enter a new Name and Long Name.'
      end

      it 'displays the empty Name and Long Name fields' do
        expect(page).to have_field('Name', with: '')
        expect(page).to have_field('Long Name', with: '')
      end
    end
  end
end
