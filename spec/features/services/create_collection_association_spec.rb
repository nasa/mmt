require 'rails_helper'

describe 'Creating Service Collection Associations', js: true, reset_provider: true do
  before do
    login

    @service_ingest_response, _concept_response = publish_service_draft
  end

  before :all do
    # Make 3 collections, two with unique names so that we can ensure they
    # are returned from search correctly
    @collection_ingest_response1, _concept_response1 = publish_collection_draft(entry_title: 'MODIS-I Water Traveler')
    @collection_ingest_response2, _concept_response2 = publish_collection_draft(entry_title: 'MODIS-I Water Skipper')
    publish_collection_draft(entry_title: 'AQUA Not MODIS-I')
  end

  context 'When viewing a published service' do
    before do
      visit service_path(@service_ingest_response['concept-id'])
    end

    it 'displays a link to get to collection association management' do
      within 'section.action' do
        expect(page).to have_link('Manage Collection Associations')
      end
    end
  end

  context 'When visiting the collection association management page' do
    before do
      visit service_collection_associations_path(@service_ingest_response['concept-id'])
    end

    it 'displays an add collection association button' do
      expect(page).to have_link('Add Collection Association')
    end

    it 'displays an empty collection association table' do
      expect(page).to have_content('No Collection Associations found.')
    end

    context 'When clicking the add collection associations button' do
      before do
        click_on 'Add Collection Association'
      end

      it 'displays the collection search page' do
        expect(page).to have_content('MMT_2 Service Collection Association Search')
      end
    end
  end

  context 'When visiting the collection association search page' do
    before do
      visit new_service_collection_association_path(@service_ingest_response['concept-id'])
    end

    it 'displays the correct number of options for search field' do
      within '#collection-search' do
        expect(page).to have_css('select[name$="[field]"] option', count: BulkUpdatesHelper::SEARCHABLE_KEYS.count)
      end
    end

    it 'displays the correct options for the search field' do
      within '#collection-search' do
        options = BulkUpdatesHelper::SEARCHABLE_KEYS.map { |_key, value| value[:title] }

        expect(page).to have_select(options: options)
      end
    end

    context 'when clicking submit without a search query', js: true do
      before do
        within '#collection-search' do
          click_button 'Submit'
        end
      end

      it 'displays an appropriate error message' do
        expect(page).to have_content('Search Term is required.')
      end
    end

    context 'when searching for collections by Entry Title' do
      before do
        within '#collection-search' do
          select 'Entry Title', from: 'Search Field'
          find(:css, "input[id$='query_text']").set('MODIS-I*')

          click_button 'Submit'
        end
      end

      it 'display the correct search results' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 2)
        end
      end

      context 'When submitting the form without making any selections' do
        before do
          within '#collections-select' do
            click_button 'Submit'
          end
        end

        it 'displays an appropriate error message' do
          expect(page).to have_content('You must select at least 1 collection.')
        end
      end

      context 'When submitting the form with both AMSR-E records selected' do
        before do
          within '#collections-select' do
            find("input[value='#{@collection_ingest_response1['concept-id']}']").set(true)
            find("input[value='#{@collection_ingest_response2['concept-id']}']").set(true)

            click_button 'Submit'

            wait_for_cmr
          end
        end

        it 'shows a success message' do
          expect(page).to have_content('Collection Associations Created Successfully!')
        end

        context 'When viewing the associated collections page' do
          before do
            wait_for_cmr

            click_link 'refresh the page'
          end

          it 'shows the associated collections' do
            within '#collection-associations' do
              expect(page).to have_selector('tbody > tr', count: 2)

              within 'tbody tr:nth-child(1)' do
                expect(page).to have_content('MODIS-I Water Skipper')
              end
              within 'tbody tr:nth-child(2)' do
                expect(page).to have_content('MODIS-I Water Traveler')
              end

              expect(page).to have_no_content('AQUA Not MODIS-I')
            end
          end
        end
      end
    end
  end
end
