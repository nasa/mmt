require 'rails_helper'

describe 'Nested item picker', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when selecting items on the science keywords nested item picker' do
    before do
      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      click_on 'Expand All'

      choose_keyword 'EARTH SCIENCE SERVICES'
      choose_keyword 'DATA ANALYSIS AND VISUALIZATION'
      choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
      choose_keyword 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
      click_on 'Add Keyword'
    end

    it 'generates the correct hidden fields' do
      expect(page.find('input[id^="draft_science_keywords_"][id$="_category"]', visible: false).value).to eq('EARTH SCIENCE SERVICES')
      expect(page.find('input[id^="draft_science_keywords_"][id$="_topic"]', visible: false).value).to eq('DATA ANALYSIS AND VISUALIZATION')
      expect(page.find('input[id^="draft_science_keywords_"][id$="_term"]', visible: false).value).to eq('GEOGRAPHIC INFORMATION SYSTEMS')
      expect(page.find('input[id^="draft_science_keywords_"][id$="_variable_level_1"]', visible: false).value).to eq('MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
    end
  end

  context 'when selecting items on the location keywords nested item picker' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      click_on 'Expand All'

      choose_keyword 'OCEAN'
      choose_keyword 'ATLANTIC OCEAN'
      choose_keyword 'NORTH ATLANTIC OCEAN'
      choose_keyword 'BALTIC SEA'
      click_on 'Add Keyword'
    end

    it 'generates the correct hidden fields' do
      expect(page.find('input[id^="draft_location_keywords_"][id$="_category"]', visible: false).value).to eq('OCEAN')
      expect(page.find('input[id^="draft_location_keywords_"][id$="_type"]', visible: false).value).to eq('ATLANTIC OCEAN')
      expect(page.find('input[id^="draft_location_keywords_"][id$="_subregion_1"]', visible: false).value).to eq('NORTH ATLANTIC OCEAN')
      expect(page.find('input[id^="draft_location_keywords_"][id$="_subregion_2"]', visible: false).value).to eq('BALTIC SEA')
    end
  end
end
