describe 'Variable Draft Collection Association' do # , reset_provider: true
  before :all do
    @ingest_collection_response, @collection_concept_response = publish_collection_draft
  end

  before do
    login

    # we need a new draft with a unique native id in case the publish test runs
    # before others and might disable the Collection Association link
    @draft = create(:full_variable_draft, collection_concept_id: nil, native_id: "test_var_draft_collection_association_#{Faker::Number.number(digits: 25)}")
  end

  context 'when viewing a full variable draft with no collection association selected' do
    before do
      visit variable_draft_path(@draft)
    end

    it 'displays the correct progress icons' do
      within '#collection-association-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
        end

        within '.progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection_association')
        end
      end
    end

    context 'when attempting to publish the draft', js: true do
      before do
        click_on 'Publish Variable Draft'
      end

      it 'displays a modal indicating that the draft cannot be published' do
        message = 'This variable draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.'
        expect(page).to have_content(message)
      end
    end

    context 'when clicking the help icon', js: true do
      before do
        within '.collection-association' do
          click_link 'Progress Legend'
        end
      end

      it 'displays a modal with help information on the collection association' do
        expect(page).to have_content('Collection Association')
        expect(page).to have_content('The collection associated with the variable.')
        expect(page).to have_content('Validation')
        expect(page).to have_content('A variable must be associated with a collection to be published. A variable can only be associated with a single collection. A variable can only be associated with a collection in the same Provider.', normalize_ws: true)
      end
    end

    context 'when viewing the collection association form' do
      before do
        # visit variable_draft_path(draft) # necessary in case the publishing test runs before the tests nested under here
        click_on 'Collection Association'
        # visit collection_search_variable_draft_path(draft)
      end

      it 'displays the form' do
        expect(page).to have_selector('label.eui-required-o', count: 2)
        expect(page).to have_select('Search Field')
        expect(page).to have_css("input[id$='query_text']")
      end

      it 'displays the table with no collection assocaition selected' do
        within '#variable-draft-collection-association-table tbody tr:nth-child(1)' do
          expect(page).to have_content('No Collection Association found. A Collection must be selected in order to publish this Variable Draft.')
        end
      end

      it 'does not have the "Clear Collection Association" button' do
        expect(page).to have_no_button('Clear Collection Association')
      end

      context 'when clicking cancel for the collection search' do
        before do
          within '#collection-search' do
            click_on 'Cancel'
          end
        end

        it 'returns to the preview page with the correct icons' do
          expect(page).to have_content('Collection Association')
          expect(page).to have_content('Metadata Fields')

          within '#collection-association-progress' do
            within '.status' do
              expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
            end

            within '.progress-indicators' do
              expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection_association')
            end
          end
        end

        it 'does not display a flash message indicating the collection association was updated' do
          expect(page).to have_no_content('Collection Association was Updated Successfully!')
        end
      end

      context 'when searching for a collection' do
        before do
          within '#collection-search' do
            select 'Short Name', from: 'Search Field'
            find(:css, "input[id$='query_text']").set('*')

            click_button 'Submit'
          end
        end

        it 'displays the search results' do
          within '#collection-search-results' do
            expect(page).to have_content(@collection_concept_response.body['EntryTitle'])
            expect(page).to have_content(@collection_concept_response.body['ShortName'])
          end
        end

        context 'when clicking cancel for the collection selection' do
          before do
            within '#collections-select' do
              click_on 'Cancel'
            end
          end

          it 'returns to the preview page with the correct icons' do
            expect(page).to have_content('Collection Association')
            expect(page).to have_content('Metadata Fields')

            within '#collection-association-progress' do
              within '.status' do
                expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
              end

              within '.progress-indicators' do
                expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection_association')
              end
            end
          end

          it 'does not display a flash message indicating the collection association was updated' do
            expect(page).to have_no_content('Collection Association was Updated Successfully!')
          end
        end

        context 'when selecting a collection association' do
          before do
            within '#collections-select' do
              find("input[value='#{@ingest_collection_response['concept-id']}']").set(true)

              click_button 'Submit'

              wait_for_cmr
            end
          end

          it 'displays a flash message that the collection association was updated' do
            expect(page).to have_content('Collection Association was Updated Successfully!')
          end

          it 'returns to the preview page and shows the correct icons' do
            expect(page).to have_content('Collection Association')
            expect(page).to have_content('Metadata Fields')

            within '#collection-association-progress' do
              within '.status' do
                expect(page).to have_css('.eui-icon.icon-green.eui-check')
              end

              within '.progress-indicators' do
                expect(page).to have_css('.eui-icon.eui-required.icon-green.collection_association')
              end
            end
          end

          context 'when returning to the collection association page' do
            before do
              click_on 'Collection Association'
            end

            it 'displays the collection association in the table' do
              within '#variable-draft-collection-association-table tbody tr:nth-child(1)' do
                expect(page).to have_content(@collection_concept_response.body['EntryTitle'])
                expect(page).to have_content(@collection_concept_response.body['ShortName'])
              end
            end

            it 'displays the "Clear Collection Association" button' do
              expect(page).to have_button('Clear Collection Association')
            end

            context 'when clearing the collection association' do
              before do
                click_on 'Clear Collection Association'
              end

              it 'displays a flash message that the collection association was updated' do
                expect(page).to have_content('Collection Association was Updated Successfully!')
              end

              it 'returns to the preview page and shows the correct icons' do
                expect(page).to have_content('Collection Association')
                expect(page).to have_content('Metadata Fields')

                within '#collection-association-progress' do
                  within '.status' do
                    expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
                  end

                  within '.progress-indicators' do
                    expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection_association')
                  end
                end
              end
            end
          end

          context 'when publishing the variable draft' do
            before do
              click_on 'Publish Variable Draft'
            end

            it 'displays a confirmation message' do
              expect(page).to have_content('Variable Draft Published Successfully!')
            end
          end
        end
      end
    end
  end
end
