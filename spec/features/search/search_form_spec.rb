# Search behavior
require 'json'

require 'rails_helper'

describe 'Search Form', js: true do
  let(:short_name)  { 'MIRCCMF' }
  let(:entry_title) { 'MISR FIRSTLOOK radiometric camera-by-camera Cloud Mask V001' }

  let(:cmr_search_response) { {
    "hits": 1,
    "took": 2,
    "items": [
      {
        "meta": {
          "revision-id": 1,
          "deleted": false,
          "format": 'application/vnd.nasa.cmr.umm+json',
          "provider-id": 'MMT_2',
          "user-id": 'testuser',
          "native-id": 'mmt_collection_113',
          "concept-id": 'C1200056652-MMT_2',
          "revision-date": '2016-01-06T21:32:30Z',
          "concept-type": 'collection'
        },
        "umm": {
          "entry-title": entry_title,
          "entry-id": '#{entry_title}_223',
          "short-name": short_name,
          "version-id": '223'
        }
      }
    ]
  }.as_json
  }

  before do
    login

    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: cmr_search_response))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
  end

  # MMT-300
  context 'when pressing enter to submit a search' do
    context 'when using search' do
      before do
        fill_in 'keyword', with: short_name
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
          find_link('Full Metadata Record Search').trigger(:click)
          expect(page).to have_selector('.search-module', visible: true)
          fill_in 'keyword', with: entry_title
          element = find('input#keyword')
          # sleep 1
          element.trigger('click')
          element.native.send_key(:Enter)
        end

        it 'performs the search' do
          expect(page).to have_search_query(1, "Keyword: #{entry_title}")
        end
      end
    end
  end

  context 'when using keyword' do
    before do
      fill_in 'Search Collections', with: short_name
      click_on 'Find'
    end

    it 'performs the search' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}")
    end

    context 'when viewing the full search form' do
      it 'populates the search term field' do
        find_link('Full Metadata Record Search').trigger(:click)
        expect(page).to have_selector('.search-module', visible: true)

        expect(page).to have_field('keyword', with: short_name)
      end
    end
  end

  context 'when using all full search fields to search' do
    context 'when searching collections' do
      before do
        find_link('Full Metadata Record Search').trigger(:click)
        expect(page).to have_selector('.search-module', visible: true)
        choose 'Collections'
        select 'LARC', from: 'provider_id'
        fill_in 'keyword', with: entry_title
        click_on 'Submit'
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{entry_title}")
      end

      it 'populates the search field' do
        expect(page).to have_field('keyword', with: entry_title)
      end

      context 'when viewing the full search form' do
        before do
          find_link('Full Metadata Record Search').trigger(:click)
          expect(page).to have_selector('.search-module', visible: true)
        end

        it 'remembers the search values' do
          # within('.search-module') do
          expect(page).to have_checked_field('Collections')
          expect(page).to have_field('provider_id', with: 'LARC')
          expect(page).to have_field('keyword', with: entry_title)
          # end
        end
      end
    end

    context 'when searching drafts' do
      draft_short_name = 'Ice Coverage Loss'
      draft_entry_title = '2000 - 2012 Loss of Ice Coverage'
      draft_provider = 'MMT_2'

      before do
        create(:collection_draft, entry_title: draft_entry_title, short_name: draft_short_name, provider_id: draft_provider)

        find_link('Full Metadata Record Search').trigger(:click)
        expect(page).to have_selector('.search-module', visible: true)
        choose 'Drafts'
        select 'MMT_2', from: 'provider_id'
        fill_in 'keyword', with: draft_short_name
        click_on 'Submit'
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{draft_short_name}")
      end

      it 'populates the search field' do
        expect(page).to have_field('keyword', with: draft_short_name)
      end

      context 'when viewing the full search form' do
        before do
          find_link('Full Metadata Record Search').trigger(:click)
          expect(page).to have_selector('.search-module', visible: true)
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
