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

  context 'when viewing a form with a top level help icon' do
    before do
      visit edit_variable_draft_path(@draft, 'services')
    end

    context 'when clicking on the top level help icon' do
      before do
        click_on 'Help modal for Services'
      end

      it 'displays the fieldset name in a modal' do
        expect(page).to have_content('Service')
      end

      it 'displays the description in a modal' do
        expect(page).to have_content('The service information of a variable.')
      end
    end

    context 'when clicking on a lower level help icon' do
      before do
        click_on 'Help modal for Service Types'
      end

      it 'displays the field name in a modal' do
        expect(page).to have_content('Service Types')
      end

      it 'displays the description in a modal' do
        expect(page).to have_content("The service types available for the variable. For example, 'WMS, WCS'.")
      end
    end
  end
end
