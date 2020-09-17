describe 'Search bar and dropdown behavior', js: true do
  let(:short_name)  { 'MIRCCMF' }
  let(:entry_title) { 'MISR FIRSTLOOK radiometric camera-by-camera Cloud Mask V001' }

  let(:collection_search_response) do
    {
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
            "revision-date": '2020-01-06T21:32:30Z',
            "concept-type": 'collection'
          },
          "umm": {
            "entry-title": entry_title,
            "entry-id": "#{entry_title}_223",
            "short-name": short_name,
            "version-id": '223'
          }
        }
      ]
    }.to_json
  end

  # TODO: this was added because we need a second .json search for tags
  # when CMR-6655 is worked and we have only one search, this can be removed
  let(:collection_search_json_response) do
    {
      "feed": {
        "updated": "2020-01-06T21:32:30Z",
        "id": "http://localhost:3003/collections.json?concept_id=C1200000015-SEDAC&include_tags=%2A&revision_id",
        "title": "ECHO dataset metadata",
        "entry": [
          {
            "granule_count": 0,
            "time_start": "1970-01-01T00:00:00.000Z",
            "boxes": [ "-90 -180 90 180" ],
            "online_access_flag": false,
            "has_transforms": false,
            "id": "C1200056652-MMT_2",
            "browse_flag": false,
            "has_temporal_subsetting": false,
            "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "coordinate_system": "CARTESIAN",
            "original_format": "application/vnd.nasa.cmr.umm+json",
            "data_center": "MMT_2",
            "has_spatial_subsetting": false,
            "archive_center": "WDC/PALEOCLIMATOLOGY, BOULDER",
            "links": [ {
              "rel": "http://esipfed.org/ns/fedsearch/1.1/documentation#",
              "hreflang": "en-US",
              "href": "http://www.example.com/example.html"
            } ],
            "dataset_id": "11,000 Year Sunspot Number Reconstruction",
            "title": entry_title,
            "has_variables": false,
            "organizations": [ "WDC/PALEOCLIMATOLOGY, BOULDER" ],
            "short_name": short_name,
            "has_formats": false,
            "version_id": "223"
          }
        ]
      }
    }.to_json
  end

  let(:variable_name) { 'Mocked Test Search Var' }
  let(:long_name) { 'Descriptive Name for Mocked Test Search Var' }

  let(:variable_search_response) do
    {
      "hits": 1,
      "took": 14,
      "items": [
        {
          "meta": {
            "revision-id": 2,
            "deleted": false,
            "format": 'application/vnd.nasa.cmr.umm+json',
            "provider-id": 'PROV1',
            "native-id": 'var1',
            "concept-id": 'V1200000009-PROV1',
            "revision-date": '2017-08-14T20:12:43Z',
            "concept-type": 'variable'
          },
          "umm": {
            "VariableType": 'SCIENCE_VARIABLE',
            "DataType": 'float32',
            "Offset": 0.0,
            "ScienceKeywords": [{
              "Category": 'sk-A',
              "Topic": 'sk-B',
              "Term": 'sk-C'
            }],
            "Scale": 1.0,
            "FillValues": [{
              "Value": -9999.0,
              "Type": 'Science'
            }],
            "Sets": [{
              "Name": 'Data_Fields',
              "Type": 'Science',
              "Size": 2,
              "Index": 2
            }],
            "Dimensions": [{
              "Name": 'Solution_3_Land',
              "Size": 3
            }],
            "Definition": 'Defines the variable',
            "Name": variable_name,
            "Units": 'm',
            "LongName": long_name
          },
          "associations": {
            "collections": [{
              "concept-id": 'C1200000007-PROV1'
            }]
          }
        }
      ]
    }.to_json
  end

  before do
    login

    collections_response = cmr_success_response(collection_search_response)
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    # TODO: this was added because we need a second .json search for tags
    # when CMR-6655 is worked and we have only one search, this can be removed
    collections_json_response = cmr_success_response(collection_search_json_response)
    allow_any_instance_of(Cmr::CmrClient).to receive(:search_collections).and_return(collections_json_response)

    variables_response = cmr_success_response(variable_search_response)
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_variables).and_return(variables_response)
  end

  context 'when viewing the search bar' do
    context 'from a page relating to Collections' do
      context 'from the Manage Collections page' do
        before do
          visit manage_collections_path
        end

        it 'displays search options for collections' do
          within '.quick-search' do
            expect(page).to have_button('Search Collections')

            click_on 'search-drop'
            within '.search-dropdown' do
              expect(page).to have_checked_field('Collections')
            end
          end
        end

        context 'when pressing enter to submit a collections search with short_name' do
          before do
            fill_in 'keyword', with: short_name
            find('input#keyword').send_keys(:enter)
          end

          it 'performs the search' do
            expect(page).to have_collection_search_query(1, "Keyword: #{short_name}")
          end

          it 'remembers the search value' do
            expect(page).to have_field('keyword', with: short_name)
          end

          it 'displays search options for collections' do
            within '.quick-search' do
              expect(page).to have_button('Search Collections')

              expect(page).to have_checked_field('Collections', visible: false)
            end
          end
        end

        context 'when clicking the "Search Collections" button to submit a collections search with short_name' do
          before do
            fill_in 'keyword', with: short_name
            click_on 'Search Collections'
          end

          it 'performs the search' do
            expect(page).to have_collection_search_query(1, "Keyword: #{short_name}")
          end

          it 'remembers the search value' do
            expect(page).to have_field('keyword', with: short_name)
          end

          it 'displays search options for collections' do
            within '.quick-search' do
              expect(page).to have_button('Search Collections')

              expect(page).to have_checked_field('Collections', visible: false)
            end
          end

          it 'has "Manage Collections" as the underlined current header link' do
            within 'main header' do
              # requires the text in all caps here, maybe because js enabled
              expect(page).to have_css('h2.current', text: 'MANAGE COLLECTIONS')
            end
          end

          it 'has a visible search dropdown in normal mmt mode' do
            within '.quick-search' do
              click_on 'search-drop'
              expect(page).to have_css('.search-enabled-radio-buttons')
              expect(page).not_to have_css('.search-dropdown-short')
            end
          end
        end

        context 'when submitting a variables search by variable name' do
          before do
            within '.quick-search' do
              click_on 'search-drop'
              choose 'Variables'
            end

            fill_in 'keyword', with: variable_name
            click_on 'Search Variables'
          end

          it 'performs the search' do
            expect(page).to have_variable_search_query(1, "Keyword: #{variable_name}")
          end

          it 'remembers the search value' do
            expect(page).to have_field('keyword', with: variable_name)
          end

          it 'displays search options for variables' do
            within '.quick-search' do
              expect(page).to have_button('Search Variables')

              expect(page).to have_checked_field('Variables', visible: false)
            end
          end
        end
      end

      context 'from a Collection Draft page' do
        before do
          visit collection_drafts_path
        end

        it 'displays search options for collections' do
          within '.quick-search' do
            expect(page).to have_button('Search Collections')

            click_on 'search-drop'
            within '.search-dropdown' do
              expect(page).to have_checked_field('Collections')
            end
          end
        end
      end

      context 'from a Collection page' do
        before do
          visit collection_path('C1200000015-SEDAC')
        end

        it 'displays search options for collections' do
          within '.quick-search' do
            expect(page).to have_button('Search Collections')

            click_on 'search-drop'
            within '.search-dropdown' do
              expect(page).to have_checked_field('Collections')
            end
          end
        end
      end
    end

    context 'from a page relating to Variables' do
      context 'from the Manage Variables page' do
        before do
          visit manage_variables_path
        end

        it 'displays search options for variables' do
          within '.quick-search' do
            expect(page).to have_button('Search Variables')

            click_on 'search-drop'
            within '.search-dropdown' do
              expect(page).to have_checked_field('Variables')
            end
          end
        end

        context 'when pressing enter to submit a variables search with variable name' do
          before do
            fill_in 'keyword', with: variable_name
            find('input#keyword').send_keys(:enter)
          end

          it 'performs the search' do
            expect(page).to have_variable_search_query(1, "Keyword: #{variable_name}")
          end

          it 'remembers the search value' do
            expect(page).to have_field('keyword', with: variable_name)
          end

          it 'displays search options for variables' do
            within '.quick-search' do
              expect(page).to have_button('Search Variables')

              expect(page).to have_checked_field('Variables', visible: false)
            end
          end
        end

        context 'when clicking the "Search Variables" button to submit a variables search with variable name' do
          before do
            fill_in 'keyword', with: variable_name
            click_on 'Search Variables'
          end

          it 'performs the search' do
            expect(page).to have_variable_search_query(1, "Keyword: #{variable_name}")
          end

          it 'remembers the search value' do
            expect(page).to have_field('keyword', with: variable_name)
          end

          it 'displays search options for variables' do
            within '.quick-search' do
              expect(page).to have_button('Search Variables')

              expect(page).to have_checked_field('Variables', visible: false)
            end
          end

          it 'has "Manage Variables" as the underlined current header link' do
            within 'main header' do
              # requires the text in all caps here, maybe because js enabled
              expect(page).to have_css('h2.current', text: 'MANAGE VARIABLES')
            end
          end
        end

        context 'when submitting a collections search by short_name' do
          before do
            within '.quick-search' do
              click_on 'search-drop'
              choose 'Collections'
            end

            fill_in 'keyword', with: short_name
            click_on 'Search Collections'
          end

          it 'performs the search' do
            expect(page).to have_collection_search_query(1, "Keyword: #{short_name}")
          end

          it 'remembers the search value' do
            expect(page).to have_field('keyword', with: short_name)
          end

          it 'displays search options for collections' do
            within '.quick-search' do
              expect(page).to have_button('Search Collections')

              expect(page).to have_checked_field('Collections', visible: false)
            end
          end
        end
      end

      context 'from a Variable Draft page' do
        before do
          visit variable_drafts_path
        end

        it 'displays search options for variables' do
          within '.quick-search' do
            expect(page).to have_button('Search Variables')

            click_on 'search-drop'
            within '.search-dropdown' do
              expect(page).to have_checked_field('Variables')
            end
          end
        end
      end

      context 'from a Variable page' do
        before do
          visit variable_path('V1234')
        end

        it 'displays search options for variables' do
          within '.quick-search' do
            expect(page).to have_button('Search Variables')

            click_on 'search-drop'
            within '.search-dropdown' do
              expect(page).to have_checked_field('Variables')
            end
          end
        end
      end
    end

    context 'from the Manage CMR page' do
      before do
        visit manage_cmr_path
      end

      it 'displays search options for collections' do
        within '.quick-search' do
          expect(page).to have_button('Search Collections')

          click_on 'search-drop'
          within '.search-dropdown' do
            expect(page).to have_checked_field('Collections')
          end
        end
      end
    end
  end

  context 'When on the home page' do
    before do
      visit root_url
    end

    it 'there is no search option' do
      expect(page).to have_no_button('search-submit-button')
      expect(page).to have_no_css('.quick-search #keyword')
    end
  end
end
