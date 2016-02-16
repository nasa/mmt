# MMT-22, MMT-10, MMT-8

require 'rails_helper'

describe 'Search published results', js: true do
  short_name = 'CIESIN_SEDAC_ESI_2000'
  version = '2000.00'
  entry_title = '2000 Pilot Environmental Sustainability Index (ESI)'
  provider = 'SEDAC'
  concept_id = 'C1200000000-SEDAC'

  before :each do
    login
    visit '/search'
  end

  context 'when performing a collection search by short name with quick find' do
    before do
      fill_in 'Quick Find', with: short_name
      click_on 'Find'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end
  end

  context 'when performing a collection search by partial entry title with quick find' do
    before do
      fill_in 'Quick Find', with: entry_title[0..9]
      click_on 'Find'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(2, "Keyword: #{entry_title[0..9]}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end
  end

  context 'when performing a collection search by short name with concept id' do
    before do
      fill_in 'Quick Find', with: concept_id
      click_on 'Find'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{concept_id}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end
  end

  context 'when performing a collection search by short name with provider' do
    before do
      fill_in 'Quick Find', with: provider
      click_on 'Find'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(25, "Keyword: #{provider}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching by short name' do
    before do
      click_on 'Full Metadata Record Search'
      fill_in 'search_term', with: short_name
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the short name in the full search form' do
        expect(page).to have_field('search_term', with: short_name)
      end
    end
  end

  context 'when searching published records by short name' do
    before do
      click_on 'Full Metadata Record Search'
      within '.full-search-form' do
        choose 'Collections'
        fill_in 'search_term', with: short_name
        click_on 'Submit'
      end
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching by entry title' do
    before do
      click_on 'Full Metadata Record Search'
      within '.full-search-form' do
        choose 'Collections'
        fill_in 'search_term', with: entry_title
        click_on 'Submit'
      end
    end

    it 'displays collection results' do
      expect(page).to have_search_query(2, "Keyword: #{entry_title}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry title in the full search form' do
        expect(page).to have_field('search_term', with: entry_title)
      end
    end
  end

  context 'when searching by partial entry title' do
    before do
      click_on 'Full Metadata Record Search'
      fill_in 'search_term', with: entry_title[5..25]
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(3, "Keyword: #{entry_title[5..25]}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry title in the full search form' do
        expect(page).to have_field('search_term', with: entry_title[5..25])
      end
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'Full Metadata Record Search'
      select 'LARC', from: 'provider_id'
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(30, 'Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('ACR3L2DM')
      expect(page).to have_content('1')
      expect(page).to have_content('ACRIM III Level 2 Daily Mean Data V001')
      expect(page).to have_content('LARC')
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the provider in the full search form' do
        expect(page).to have_field('provider_id', with: 'LARC')
      end
    end
  end

  context 'when searching by CMR Concept Id' do
    before do
      click_on 'Full Metadata Record Search'
      fill_in 'search_term', with: concept_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{concept_id}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the concept id in the full search form' do
        expect(page).to have_field('search_term', with: concept_id)
      end
    end
  end

  context 'when performing a search that has no results' do
    before do
      fill_in 'Quick Find', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
  end
end
