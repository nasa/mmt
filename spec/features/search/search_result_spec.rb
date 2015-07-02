# MMT-22

require 'rails_helper'

describe 'Search results' do

  before :each do
    login
    visit "/search"
  end

  context 'when performing a collection search by quick find entry id' do
    before do
      fill_in 'entry-id', with: 'doi:10.3334/ORNLDAAC/8_1'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content('1 Result for: Entry Id: doi:10.3334/ORNLDAAC/8_1')
    end
    it 'displays expected Entry ID, Entry Title and Last Modified values' do
      expect(page).to have_content('doi:10.3334/ORNLDAAC/8_1')
      expect(page).to have_content('Aircraft Flux-Filtered: Univ. Col. (FIFE)')
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
        expect(page).to have_field('search-term-type', with: 'entry-id')
        expect(page).to have_field('search-term', with: 'doi:10.3334/ORNLDAAC/8_1')
      end
    end
    # We could add a test to actually examine the results table contents more specifically
  end

  context 'when searching by entry id' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry ID', from: 'search-term-type'
      fill_in 'search-term', with: 'doi:10.3334/ORNLDAAC/8_1'
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content('1 Result for: Entry Id: doi:10.3334/ORNLDAAC/8_1')
    end

    it 'displays expected data' do
      expect(page).to have_content('doi:10.3334/ORNLDAAC/8_1')
      expect(page).to have_content('Aircraft Flux-Filtered: Univ. Col. (FIFE)')
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
        expect(page).to have_field('search-term-type', with: 'entry-id')
        expect(page).to have_field('search-term', with: 'doi:10.3334/ORNLDAAC/8_1')
      end
    end
  end

  context 'when searching by entry title' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry Title', from: 'search-term-type'
      fill_in 'search-term', with: 'Aircraft Flux-Filtered: Univ. Col. (FIFE)'
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content('1 Result for: Entry Title: Aircraft Flux-Filtered: Univ. Col. (FIFE)')
    end

    it 'displays expected data' do
      expect(page).to have_content('doi:10.3334/ORNLDAAC/8_1')
      expect(page).to have_content('Aircraft Flux-Filtered: Univ. Col. (FIFE)')
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
        expect(page).to have_field('search-term-type', with: 'entry-title')
        expect(page).to have_field('search-term', with: 'Aircraft Flux-Filtered: Univ. Col. (FIFE)')
      end
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'Full Metadata Record Search'
      select 'PROV2', from: 'provider-id'
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content('25 Results for: Provider Id: PROV2')
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
        expect(page).to have_field('provider-id', with: 'PROV2')
      end
    end
  end

  context 'when performing a search that has no results' do
    before do
      fill_in 'entry-id', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
    # We could add a test to actually examine the results table contents more specifically
  end

end
