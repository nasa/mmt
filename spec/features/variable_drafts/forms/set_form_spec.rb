
require 'rails_helper'

describe 'Set Form', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'set')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Set')
      expect(page).to have_content('The set information of a variable.')
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Set')
    end

    it 'have one required label' do
      expect(page).not_to have_selector('label.eui-required-o')
    end
  end

  context 'When viewing the form with 1 stored value' do
    before do
      draft_sets = [{
        'Name': 'Science',
        'Type': 'Air',
        'Size': 25,
        'Index': 1
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'Set': draft_sets })
      visit edit_variable_draft_path(draft, 'set')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 1)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_set_0_name', with: 'Science')
      expect(page).to have_field('variable_draft_draft_set_0_type', with: 'Air')
      expect(page).to have_field('variable_draft_draft_set_0_size', with: '25')
      expect(page).to have_field('variable_draft_draft_set_0_index', with: '1')
    end
  end

  context 'When viewing the form with 2 stored values' do
    before do
      draft_sets = [{
        'Name': 'Science',
        'Type': 'Land',
        'Size': 50,
        'Index': 1
      }, {
        'Name': 'Fiction',
        'Type': 'Water',
        'Size': 100,
        'Index': 2
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'Set': draft_sets })
      visit edit_variable_draft_path(draft, 'set')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 2)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_set_0_name', with: 'Science')
      expect(page).to have_field('variable_draft_draft_set_0_type', with: 'Land')
      expect(page).to have_field('variable_draft_draft_set_0_size', with: '50')
      expect(page).to have_field('variable_draft_draft_set_0_index', with: '1')

      expect(page).to have_field('variable_draft_draft_set_1_name', with: 'Fiction')
      expect(page).to have_field('variable_draft_draft_set_1_type', with: 'Water')
      expect(page).to have_field('variable_draft_draft_set_1_size', with: '100')
      expect(page).to have_field('variable_draft_draft_set_1_index', with: '2')
    end
  end
end
