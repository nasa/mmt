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
      fill_in 'query_text', with: @concept_with_facets_response.body['EntryTitle']
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      select 'Science Keywords', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
    end

    it 'contains the expected facets options in the select fields' do
      expect(page).to have_select('Category', with_options: ['EARTH SCIENCE', 'EARTH SCIENCE SERVICES'])
      expect(page).to have_select('Topic', with_options: ['DATA ANALYSIS AND VISUALIZATION', 'ATMOSPHERE'])
      expect(page).to have_select('Term', with_options: ['GEOGRAPHIC INFORMATION SYSTEMS', 'AEROSOLS', 'ATMOSPHERIC TEMPERATURE'])
      expect(page).to have_select('VariableLevel1', with_options: ['DESKTOP GEOGRAPHIC INFORMATION SYSTEMS', 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS', 'AEROSOL OPTICAL DEPTH/THICKNESS', 'SURFACE TEMPERATURE'])
      expect(page).to have_select('VariableLevel2', with_options: ['ANGSTROM EXPONENT', 'MAXIMUM/MINIMUM TEMPERATURE'])
      expect(page).to have_select('VariableLevel3', with_options: ['24 HOUR MAXIMUM TEMPERATURE'])
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
        within '#Category' do
          expect(page).to have_css('option[disabled]', text: 'EARTH SCIENCE SERVICES')
        end

        within '#Topic' do
          expect(page).to have_css('option[disabled]', text: 'DATA ANALYSIS AND VISUALIZATION')
        end

        within '#Term' do
          expect(page).to have_css('option[disabled]', text: 'GEOGRAPHIC INFORMATION SYSTEMS')
        end

        within '#VariableLevel1' do
          expect(page).to have_css('option[disabled]', text: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
          expect(page).to have_css('option[disabled]', text: 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
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
          within '#Category' do
            expect(page).to have_css('option[disabled]', text: 'EARTH SCIENCE SERVICES')
          end

          within '#Topic' do
            expect(page).to have_css('option[disabled]', text: 'DATA ANALYSIS AND VISUALIZATION')
          end

          within '#Term' do
            expect(page).to have_css('option[disabled]', text: 'GEOGRAPHIC INFORMATION SYSTEMS')
            expect(page).to have_css('option[disabled]', text: 'AEROSOLS')
          end

          within '#VariableLevel1' do
            expect(page).to have_css('option[disabled]', text: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
            expect(page).to have_css('option[disabled]', text: 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
            expect(page).to have_css('option[disabled]', text: 'AEROSOL OPTICAL DEPTH/THICKNESS')
          end

          within '#VariableLevel2' do
            expect(page).to have_css('option[disabled]', text: 'ANGSTROM EXPONENT')
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
              expect(page).to have_css('option:not([disabled])', text: 'EARTH SCIENCE SERVICES')
            end

            within '#Topic' do
              expect(page).to have_css('option:not([disabled])', text: 'ATMOSPHERE')
              expect(page).to have_css('option:not([disabled])', text: 'DATA ANALYSIS AND VISUALIZATION')
            end

            within '#Term' do
              expect(page).to have_css('option:not([disabled])', text: 'AEROSOLS')
              expect(page).to have_css('option:not([disabled])', text: 'ATMOSPHERIC TEMPERATURE')
              expect(page).to have_css('option:not([disabled])', text: 'GEOGRAPHIC INFORMATION SYSTEMS')
            end

            within '#VariableLevel1' do
              expect(page).to have_css('option:not([disabled])', text: 'AEROSOL OPTICAL DEPTH/THICKNESS')
              expect(page).to have_css('option:not([disabled])', text: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
              expect(page).to have_css('option:not([disabled])', text: 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
              expect(page).to have_css('option:not([disabled])', text: 'SURFACE TEMPERATURE')
            end

            within '#VariableLevel2' do
              expect(page).to have_css('option:not([disabled])', text: 'ANGSTROM EXPONENT')
              expect(page).to have_css('option:not([disabled])', text: 'MAXIMUM/MINIMUM TEMPERATURE')
            end

            within '#VariableLevel3' do
              expect(page).to have_css('option:not([disabled])', text: '24 HOUR MAXIMUM TEMPERATURE')
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
        page.find('.select2-search__field').native.send_keys('ang')
        page.find('ul#select2-VariableLevel2-results li.select2-results__option--highlighted').click
      end

      it 'disables all the facets options unrelated to the selection' do
        within '#Category' do
          expect(page).to have_css('option[disabled]', text: 'EARTH SCIENCE SERVICES')
        end

        within '#Topic' do
          expect(page).to have_css('option[disabled]', text: 'DATA ANALYSIS AND VISUALIZATION')
        end

        within '#Term' do
          expect(page).to have_css('option[disabled]', text: 'GEOGRAPHIC INFORMATION SYSTEMS')
          expect(page).to have_css('option[disabled]', text: 'ATMOSPHERIC TEMPERATURE')
        end

        within '#VariableLevel1' do
          expect(page).to have_css('option[disabled]', text: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
          expect(page).to have_css('option[disabled]', text: 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
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
          page.find('.select2-search__field').native.send_keys('atmo')
          page.find('ul#select2-Topic-results li.select2-results__option--highlighted').click
        end

        it 'has all the same facets options disabled' do
          within '#Category' do
            expect(page).to have_css('option[disabled]', text: 'EARTH SCIENCE SERVICES')
          end

          within '#Topic' do
            expect(page).to have_css('option[disabled]', text: 'DATA ANALYSIS AND VISUALIZATION')
          end

          within '#Term' do
            expect(page).to have_css('option[disabled]', text: 'GEOGRAPHIC INFORMATION SYSTEMS')
            expect(page).to have_css('option[disabled]', text: 'ATMOSPHERIC TEMPERATURE')
          end

          within '#VariableLevel1' do
            expect(page).to have_css('option[disabled]', text: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
            expect(page).to have_css('option[disabled]', text: 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
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
