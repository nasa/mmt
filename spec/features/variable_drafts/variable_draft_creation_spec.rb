require 'rails_helper'

describe 'Variable Draft creation', reset_provider: true, js: true do
  before do
    login
  end

  context 'when creating a new variable draft from scratch' do
    before do
      visit new_variable_draft_path

      # visit manage_metadata_path
      # TODO: edit with pathway to create new variable draft from manage metadata page
    end

    it 'creates a new blank variable draft' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('New')
      end
    end

    context 'when saving data into the variable draft' do
      before do
        fill_in 'Name', with: 'test var draft'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Variable Draft Created Successfully!')
      end

      context 'when viewing the manage metadata page' do # page/view to see variable drafts
        it 'displays the new variable draft'

        context 'when clicking on the variable drafts title' do

          it 'displays the variable draft preview page'
        end
      end
    end

    context 'when viewing the manage metadata page' do # page/view to see variable drafts

      it 'does not show any open variable drafts'
    end
  end
end
