require 'rails_helper'

describe 'Special sorting in select fields', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing a country select field' do
    before do
      within '.metadata' do
        click_on 'Data Centers', match: :first
      end
    end

    it 'displys United States first' do
      expect(page).to have_xpath "//select[contains(@class, 'country-select')]/option[2][@value='United States']"
    end
  end

  context 'when viewing a language select field' do
    before do
      within '.metadata' do
        click_on 'Metadata Information', match: :first
      end
      open_accordions
    end

    it 'displays English first' do
      expect(page).to have_xpath "//select[@id='draft_metadata_language']/option[2][@value='eng']"
    end
  end
end
