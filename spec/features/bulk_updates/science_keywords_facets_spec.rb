require 'rails_helper'

describe 'Science Keywords Facets with Bulk Updates' do
  before :all do
    _ingest_response, @concept_with_facets_response = publish_collection_draft
  end

  before do
    login

    visit new_bulk_updates_search_path
  end

  context 'when choosing Science Keywords Find Values using facets responses', js: true do
    before do
      # Search form
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@concept_with_facets_response.body['EntryTitle'])
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      select 'Science Keywords', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
    end

    it 'contains the expected facets options in the select fields' do
      expect(page).to have_select('Category', with_options: ['EARTH SCIENCE'])
      expect(page).to have_select('Topic', with_options: ['ATMOSPHERE', 'SOLID EARTH'])
      expect(page).to have_select('Term', with_options: ['ATMOSPHERIC TEMPERATURE', 'ROCKS/MINERALS/CRYSTALS'])
      expect(page).to have_select('VariableLevel1', with_options: ['SURFACE TEMPERATURE', 'SEDIMENTARY ROCKS'])
      expect(page).to have_select('VariableLevel2', with_options: ['MAXIMUM/MINIMUM TEMPERATURE', 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES'])
      expect(page).to have_select('VariableLevel3', with_options: ['24 HOUR MAXIMUM TEMPERATURE', 'LUMINESCENCE'])
    end

    context 'when first choosing an option at a higher hierarchy level' do
      before do
        # Using the standard Capybara 'select _, from _' method does not trigger the
        # correct select2 event needed for our form event handlers, so we need
        # to find more specific elements of select2 to choose our selection and
        # trigger the appropriate event.
        within '#topic-select' do
          page.find('#select2-Topic-container').click
        end
        page.find('.select2-search__field').native.send_keys('atmo')
        page.find('ul#select2-Topic-results li.select2-results__option--highlighted').click
      end

      it 'disables the facets options not related to the selection' do
        within '#Topic' do
          expect(page).to have_css('option[disabled]', text: 'SOLID EARTH')
        end

        within '#Term' do
          expect(page).to have_css('option[disabled]', text: 'ROCKS/MINERALS/CRYSTALS')
        end

        within '#VariableLevel1' do
          expect(page).to have_css('option[disabled]', text: 'SEDIMENTARY ROCKS')
        end

        within '#VariableLevel2' do
          expect(page).to have_css('option[disabled]', text: 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES')
        end

        within '#VariableLevel3' do
          expect(page).to have_css('option[disabled]', text: 'LUMINESCENCE')
        end
      end

      context 'when then choosing a facets option at a lower hierarchy level' do
        before do
          within '#variable_level_1-select' do
            page.find('#select2-VariableLevel1-container').click
          end
          page.find('.select2-search__field').native.send_keys('surf')
          page.find('ul#select2-VariableLevel1-results li.select2-results__option--highlighted').click
        end

        it 'disables more options unrelated to the new selection' do
          within '#Topic' do
            expect(page).to have_css('option[disabled]', text: 'SOLID EARTH')
          end

          within '#Term' do
            expect(page).to have_css('option[disabled]', text: 'ROCKS/MINERALS/CRYSTAL')
            expect(page).to have_css('option[disabled]', text: 'AEROSOLS')
          end

          within '#VariableLevel1' do
            expect(page).to have_css('option[disabled]', text: 'SEDIMENTARY ROCKS')
          end

          within '#VariableLevel2' do
            expect(page).to have_css('option[disabled]', text: 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES')
          end

          within '#VariableLevel3' do
            expect(page).to have_css('option[disabled]', text: 'LUMINESCENCE')
          end
        end

        context 'when unselecting the facets options' do
          before do
            # unselect VariableLevel1
            within '#variable_level_1-select' do
              page.find('#select2-VariableLevel1-container').click
            end
            page.find('.select2-search__field').native.send_keys('select')
            page.find('ul#select2-VariableLevel1-results li.select2-results__option--highlighted').click

            # unselect Topic
            within '#topic-select' do
              page.find('#select2-Topic-container').click
            end
            page.find('.select2-search__field').native.send_keys('select')
            page.find('ul#select2-Topic-results li.select2-results__option--highlighted').click
          end

          it 'enables all the facets options' do
            within '#Category' do
              expect(page).to have_css('option:not([disabled])', text: 'EARTH SCIENCE')
            end

            within '#Topic' do
              expect(page).to have_css('option:not([disabled])', text: 'ATMOSPHERE')
              expect(page).to have_css('option:not([disabled])', text: 'SOLID EARTH')
            end

            within '#Term' do
              expect(page).to have_css('option:not([disabled])', text: 'ATMOSPHERIC TEMPERATURE')
              expect(page).to have_css('option:not([disabled])', text: 'ROCKS/MINERALS/CRYSTALS')
            end

            within '#VariableLevel1' do
              expect(page).to have_css('option:not([disabled])', text: 'SURFACE TEMPERATURE')
              expect(page).to have_css('option:not([disabled])', text: 'SEDIMENTARY ROCKS')
            end

            within '#VariableLevel2' do
              expect(page).to have_css('option:not([disabled])', text: 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES')
              expect(page).to have_css('option:not([disabled])', text: 'MAXIMUM/MINIMUM TEMPERATURE')
            end

            within '#VariableLevel3' do
              expect(page).to have_css('option:not([disabled])', text: '24 HOUR MAXIMUM TEMPERATURE')
              expect(page).to have_css('option:not([disabled])', text: 'LUMINESCENCE')
            end
          end
        end
      end

    end

    context 'when first choosing a facets option at a lower hierarchy level' do
      before do
        # Using the standard Capybara 'select _, from _' method does not trigger the
        # correct select2 event needed for our form event handlers, so we need
        # to find more specific elements of select2 to choose our selection and
        # trigger the appropriate event.
        within '#variable_level_2-select' do
          page.find('#select2-VariableLevel2-container').click
        end
        page.find('.select2-search__field').native.send_keys('rock')
        page.find('ul#select2-VariableLevel2-results li.select2-results__option--highlighted').click
      end

      it 'disables all the facets options unrelated to the selection' do
        within '#Topic' do
          expect(page).to have_css('option[disabled]', text: 'ATMOSPHERE')
        end

        within '#Term' do
          expect(page).to have_css('option[disabled]', text: 'ATMOSPHERIC TEMPERATURE')
        end

        within '#VariableLevel1' do
          expect(page).to have_css('option[disabled]', text: 'SURFACE TEMPERATURE')
        end

        within '#VariableLevel2' do
          expect(page).to have_css('option[disabled]', text: 'MAXIMUM/MINIMUM TEMPERATURE')
        end

        within '#VariableLevel3' do
          expect(page).to have_css('option[disabled]', text: '24 HOUR MAXIMUM TEMPERATURE')
        end
      end

      context 'when then choosing a facets option at a higher hierarchy level' do
        before do
          within '#topic-select' do
            page.find('#select2-Topic-container').click
          end
          page.find('.select2-search__field').native.send_keys('solid')
          page.find('ul#select2-Topic-results li.select2-results__option--highlighted').click
        end

        it 'has all the same facets options disabled' do
          within '#Topic' do
            expect(page).to have_css('option[disabled]', text: 'ATMOSPHERE')
          end

          within '#Term' do
            expect(page).to have_css('option[disabled]', text: 'ATMOSPHERIC TEMPERATURE')
          end

          within '#VariableLevel1' do
            expect(page).to have_css('option[disabled]', text: 'SURFACE TEMPERATURE')
          end

          within '#VariableLevel2' do
            expect(page).to have_css('option[disabled]', text: 'MAXIMUM/MINIMUM TEMPERATURE')
          end

          within '#VariableLevel3' do
            expect(page).to have_css('option[disabled]', text: '24 HOUR MAXIMUM TEMPERATURE')
          end
        end
      end
    end
  end
end
