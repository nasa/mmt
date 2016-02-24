# Quick Find and Full Search behavior

require 'rails_helper'

describe 'Search Form', js: true do
  short_name = 'ACR3L2DM'
  entry_title = 'ACRIM III Level 2 Daily Mean Data V001'

  before do
    login
  end

  # MMT-300
  context 'when pressing enter to submit a search' do
    context 'when using quick find' do
      before do
        fill_in 'Quick Find', with: short_name
        element = find('input#keyword')
        element.native.send_key(:Enter)
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{short_name}")
      end
    end

    context 'when using full search' do
      context 'when searching published collections' do
        before do
          click_on 'Full Metadata Record Search'
          fill_in 'keyword', with: entry_title
          element = find('input#keyword')
          element.trigger('click')
          element.native.send_key(:Enter)
        end

        it 'performs the search' do
          expect(page).to have_search_query(1, "Keyword: #{entry_title}")
        end
      end
    end
  end

  context 'when using quick find' do
    before do
      fill_in 'Quick Find', with: short_name
      click_on 'Find'
    end

    it 'performs the search' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}")
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      it 'populates the search term field' do
        expect(page).to have_field('keyword', with: short_name)
      end
    end
  end

  context 'when using all full search fields to search' do
    context 'when searching collections' do
      before do
        click_on 'Full Metadata Record Search'
        choose 'Collections'
        select 'LARC', from: 'provider_id'
        fill_in 'keyword', with: entry_title
        click_on 'Submit'
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{entry_title}")
      end

      it 'populates the quick find field' do
        expect(page).to have_field('keyword', with: entry_title)
      end

      context 'when viewing the full search form' do
        before do
          click_on 'Full Metadata Record Search'
        end

        it 'remembers the search values' do
          expect(page).to have_checked_field('Collections')
          expect(page).to have_field('provider_id', with: 'LARC')
          expect(page).to have_field('keyword', with: entry_title)
        end
      end
    end

    context 'when searching drafts' do
      draft_short_name = 'Ice Coverage Loss'
      draft_entry_title = '2000 - 2012 Loss of Ice Coverage'
      draft_provider = 'MMT_2'

      before do
        create(:draft, entry_title: draft_entry_title, short_name: draft_short_name, provider_id: draft_provider)

        click_on 'Full Metadata Record Search'
        choose 'Drafts'
        select 'MMT_2', from: 'provider_id'
        fill_in 'keyword', with: draft_short_name
        click_on 'Submit'
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{draft_short_name}")
      end

      it 'populates the quick find field' do
        expect(page).to have_field('keyword', with: draft_short_name)
      end

      context 'when viewing the full search form' do
        before do
          click_on 'Full Metadata Record Search'
        end

        it 'remembers the search values' do
          expect(page).to have_checked_field('Drafts')
          expect(page).to have_field('provider_id', with: 'MMT_2')
          expect(page).to have_field('keyword', with: draft_short_name)
        end
      end
    end
  end
end
