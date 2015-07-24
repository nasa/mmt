# MMT-22, MMT-10, MMT-8

# TODO Create helper method for results_query_label assertions

require 'rails_helper'

describe 'Search published results' do
  entry_id = 'doi:10.3334/ORNLDAAC/8_1'
  entry_title = 'Aircraft Flux-Filtered: Univ. Col. (FIFE)'
  concept_id = 'C1200000036-SEDAC'

  before :each do
    login
    visit "/search"
  end

  context 'when performing a collection search by quick find entry id' do
    before do
      fill_in 'entry_id', with: entry_id
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content('1 Result for: Entry Id: doi:10.3334/ORNLDAAC/8_1 | Record State: Published Records')
    end
    it 'displays expected Entry ID, Entry Title and Last Modified values' do
      expect(page).to have_content(entry_id)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'entry_id')
        expect(page).to have_field('search_term', with: entry_id)
      end
    end
    # We could add a test to actually examine the results table contents more specifically
  end

  context 'when searching by entry id' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry ID', from: 'search_term_type'
      fill_in 'search_term', with: entry_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: Published Records | Entry Id: #{entry_id}")
    end

    it 'displays expected data' do
      expect(page).to have_content(entry_id)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'entry_id')
        expect(page).to have_field('search_term', with: entry_id)
      end
    end
  end

  context 'when searching published records by entry id' do # Is actually searching published and drafts for a published by entry id
    before do
      click_on 'Full Metadata Record Search'
      select 'Published & Draft Records', from: 'record_state'
      select 'Entry ID', from: 'search_term_type'
      fill_in 'search_term', with: entry_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: Published And Draft Records | Entry Id: #{entry_id}")
    end

    it 'displays expected data' do
      expect(page).to have_content(entry_id)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end

  end

  context 'when searching by entry title' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry Title', from: 'search_term_type'
      fill_in 'search_term', with: entry_title
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: Published Records | Entry Title: #{entry_title}")
    end

    it 'displays expected data' do
      expect(page).to have_content(entry_id)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'entry_title')
        expect(page).to have_field('search_term', with: entry_title)
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
      expect(page).to have_content('25 Results for: Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('aces1efm_1')
      expect(page).to have_content('ACES ELECTRIC FIELD MILL V1')
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('provider_id', with: 'LARC')
      end
    end
  end

  context 'when searching by CMR Concept Id' do
    before do
      click_on 'Full Metadata Record Search'
      select 'CMR Concept ID', from: 'search_term_type'
      fill_in 'search_term', with: concept_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content("1 Result for: Record State: Published Records | Concept Id: #{concept_id}")
    end

    it 'displays expected data' do
      expect(page).to have_content(entry_id)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(Date.today.strftime("%Y-%m-%d"))
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'concept_id')
        expect(page).to have_field('search_term', with: concept_id)
      end
    end
  end


  context 'when performing a search that has no results' do
    before do
      fill_in 'entry_id', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
    # We could add a test to actually examine the results table contents more specifically
  end

end
