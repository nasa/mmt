# MMT-104

require 'rails_helper'

describe 'Preview page validation errors' do
  before do
    login
  end

  context 'when missing all fields' do
    before do
      draft = create(:draft_all_required_fields, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'does not show missing required fields' do
      expect(page).to have_no_css('.errors')
    end
  end

  context 'when missing required fields in a form' do
    before do
      draft = create(:draft_missing_required_fields, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows missing required fields for forms that have some data' do
      expect(page).to have_content('Entry Title is required')
    end
  end

  context 'when nested required fields are missing' do
    before do
      draft = create(:draft_nested_required_field, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows an error' do
      expect(page).to have_content('URLs is required')
    end
  end

  context 'when a field is too long' do
    before do
      draft = create(:draft_field_too_long, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows an error' do
      expect(page).to have_content('Entry Id is too long')
    end
  end

  context 'when a field is too high' do
    before do
      draft = create(:draft_field_too_high, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows an error' do
      expect(page).to have_content('Longitude is too high')
    end
  end

  context 'when a field is an invalid date' do
    before do
      draft = create(:draft_field_invalid_date, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows an error' do
      expect(page).to have_content('Date is an invalid date format')
    end
  end

  context 'when a field is an invalid pattern' do
    before do
      draft = create(:draft_field_invalid_pattern, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows an error' do
      expect(page).to have_content('Uuid is an invalid format')
    end
  end

  context 'when a field is an invalid URI' do
    before do
      draft = create(:draft_field_invalid_uri, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    it 'shows an error' do
      expect(page).to have_content('URLs is an invalid URI')
    end
  end

end
