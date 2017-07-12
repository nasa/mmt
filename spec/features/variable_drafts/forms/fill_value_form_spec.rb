require 'rails_helper'

describe 'Fill Value Form', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'fill_value')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Fill Value')
      expect(page).to have_content('The elements of this section apply to the fill value of a variable.')
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Fill Value')
    end

    it 'have one required label' do
      expect(page).to have_selector('label.eui-required-o', count: 1)
    end
  end

  context 'When viewing the form with 1 stored value' do
    before do
      draft_fill_values = [{
        'Type': 'Science',
        'Value': -9999.0,
        'Description': 'Pellentesque Bibendum Commodo Fringilla Nullam'
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'FillValue': draft_fill_values })
      visit edit_variable_draft_path(draft, 'fill_value')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 1)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_fill_value_0_type', with: 'Science')
      expect(page).to have_field('variable_draft_draft_fill_value_0_value', with: '-9999.0')
      expect(page).to have_field('variable_draft_draft_fill_value_0_description', with: 'Pellentesque Bibendum Commodo Fringilla Nullam')
    end
  end

  context 'When viewing the form with 2 stored values' do
    before do
      draft_fill_values = [{
        'Type': 'Science',
        'Value': -9999.0,
        'Description': 'Pellentesque Bibendum Commodo Fringilla Nullam'
      }, {
        'Type': 'Fiction',
        'Value': 111.0,
        'Description': 'Pellentesque Nullam Ullamcorper Magna'
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'FillValue': draft_fill_values })
      visit edit_variable_draft_path(draft, 'fill_value')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 2)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_fill_value_0_type', with: 'Science')
      expect(page).to have_field('variable_draft_draft_fill_value_0_value', with: '-9999.0')
      expect(page).to have_field('variable_draft_draft_fill_value_0_description', with: 'Pellentesque Bibendum Commodo Fringilla Nullam')

      expect(page).to have_field('variable_draft_draft_fill_value_1_type', with: 'Fiction')
      expect(page).to have_field('variable_draft_draft_fill_value_1_value', with: '111.0')
      expect(page).to have_field('variable_draft_draft_fill_value_1_description', with: 'Pellentesque Nullam Ullamcorper Magna')
    end
  end
end
