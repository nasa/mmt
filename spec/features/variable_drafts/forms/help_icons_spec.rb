require 'rails_helper'

describe 'Variable Drafts Forms Help Icons', js: true do
  before do
    login

    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
  end

  context 'when viewing a form with help icons with validation requirements' do
    before do
      visit edit_variable_draft_path(@draft, 'dimensions')
    end

    context 'when clicking on a help icon with minItems' do
      before do
        click_on 'Help modal for Dimensions'
      end

      it 'displays the validation requirement in the modal' do
        expect(page).to have_content('Validation')
        expect(page).to have_content('Minimum Items: 1')
      end
    end

    context 'when clicking on a help icon with min and max Lengths' do
      before do
        click_on 'Help modal for Name'
      end

      it 'displays the validation requirements in the modal' do
        expect(page).to have_content('Validation')
        expect(page).to have_content('Minimum Length: 1')
        expect(page).to have_content('Maximum Length: 80')
      end
    end
  end
end
