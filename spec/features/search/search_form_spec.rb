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
  end

  context 'when using keyword' do
    before do
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'performs the search' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}")
    end
  end
end
