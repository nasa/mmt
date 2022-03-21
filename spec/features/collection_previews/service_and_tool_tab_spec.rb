describe 'Service and Tool Tabs', reset_provider: true do
  before do
    login
    @ingest_response, @concept_response = publish_collection_draft
  end

  context 'when viewing a collection with no associated concepts' do
    before do
      visit collection_path(@ingest_response['concept-id'])
    end

    context 'when examining the services tab' do
      before do
        #find('.tab-label', text: 'Services').click
      end

      it 'has the correct text' do
        expect(page).to have_content('This collection does not have any associated services at this time.')
      end
    end

    context 'when examining the Tools tab' do
      before do
        find('.tab-label', text: 'Tools').click
      end

      it 'has the correct text' do
        expect(page).to have_content('This collection does not have any associated tools at this time.')
      end
    end
  end

  context 'when viewing a collection with a pair of services and tools' do
    before do
      @tool_ingest_response, @tool_concept_response = publish_tool_draft(name: "A Tool #{Faker::Number.number(digits: 6)}")
      create_tool_collection_association(@tool_ingest_response['concept-id'], @ingest_response['concept-id'])
      @tool_ingest_response2, @tool_concept_response2 = publish_tool_draft(name: "B Tool #{Faker::Number.number(digits: 6)}")
      create_tool_collection_association(@tool_ingest_response2['concept-id'], @ingest_response['concept-id'])
      @service_ingest_response, @service_concept_response = publish_service_draft(name: "A Service #{Faker::Number.number(digits: 6)}")
      create_service_collection_association(@service_ingest_response['concept-id'], @ingest_response['concept-id'])
      @service_ingest_response2, @service_concept_response2 = publish_service_draft(name: "B Service #{Faker::Number.number(digits: 6)}")
      create_service_collection_association(@service_ingest_response2['concept-id'], @ingest_response['concept-id'])
      wait_for_cmr

      visit collection_path(@ingest_response['concept-id'])
    end

    context 'when examining the tools' do
      before do
        find('.tab-label', text: 'Tools').click
      end

      it 'has the correct tool metadata' do
        within '#associated-tools-panel' do
          within all('.preview-gem-card')[0] do
            expect(page).to have_content(@tool_concept_response.body['Name'])
            expect(page).to have_content("Type: #{@tool_concept_response.body['Type']}")
            expect(page).to have_content("Description: #{@tool_concept_response.body['Description']}")
          end

          within all('.preview-gem-card')[1] do
            expect(page).to have_content(@tool_concept_response2.body['Name'])
            expect(page).to have_content("Type: #{@tool_concept_response2.body['Type']}")
            expect(page).to have_content("Description: #{@tool_concept_response2.body['Description']}")
          end
        end
      end
    end

    context 'when examining the services' do
      before do
        find('.tab-label', text: 'Services').click
      end

      it 'has the correct service metadata' do
        within '#associated-services-panel' do
          within all('.preview-gem-card')[0] do
            expect(page).to have_content(@service_concept_response.body['Name'])
            expect(page).to have_content("Type: #{@service_concept_response.body['Type']}")
            expect(page).to have_content("Description: #{@service_concept_response.body['Description']}")
          end

          within all('.preview-gem-card')[1] do
            expect(page).to have_content(@service_concept_response2.body['Name'])
            expect(page).to have_content("Type: #{@service_concept_response2.body['Type']}")
            expect(page).to have_content("Description: #{@service_concept_response2.body['Description']}")
          end
        end
      end
    end
  end

  context 'when viewing a collection with many associated tools', js: true do
    before do
      @tool_ingest_response, @tool_concept_response = publish_tool_draft(name: "A Tool #{Faker::Number.number(digits: 6)}")
      create_tool_collection_association(@tool_ingest_response['concept-id'], @ingest_response['concept-id'])
      @tool_ingest_response2, @tool_concept_response2 = publish_tool_draft(name: "B Tool #{Faker::Number.number(digits: 6)}")
      create_tool_collection_association(@tool_ingest_response2['concept-id'], @ingest_response['concept-id'])
      @tool_ingest_response3, @tool_concept_response3 = publish_tool_draft(name: "C Tool #{Faker::Number.number(digits: 6)}")
      create_tool_collection_association(@tool_ingest_response3['concept-id'], @ingest_response['concept-id'])
      @tool_ingest_response4, @tool_concept_response4 = publish_tool_draft(name: "D Tool #{Faker::Number.number(digits: 6)}")
      create_tool_collection_association(@tool_ingest_response4['concept-id'], @ingest_response['concept-id'])
      wait_for_cmr

      visit collection_path(@ingest_response['concept-id'])

      find('.tab-label', text: 'Tools').click
    end

    it 'has a show more link' do
      within '#associated-tools-panel' do
        expect(page).to have_link('Show More')
        expect(page).to have_no_link('Show Less')
      end
    end

    it 'displays the correct records' do
      within '#associated-tools-panel' do
        expect(page).to have_content(@tool_concept_response.body['Name'])
        expect(page).to have_content(@tool_concept_response2.body['Name'])
        expect(page).to have_content(@tool_concept_response3.body['Name'])
        expect(page).to have_no_content(@tool_concept_response4.body['Name'])
      end
    end

    context 'when clicking the show more link' do
      before do
        click_on 'Show More'
      end

      it 'displays all four records' do
        within '#associated-tools-panel' do
          expect(page).to have_content(@tool_concept_response.body['Name'])
          expect(page).to have_content(@tool_concept_response2.body['Name'])
          expect(page).to have_content(@tool_concept_response3.body['Name'])
          expect(page).to have_content(@tool_concept_response4.body['Name'])
        end
      end

      context 'when clicking the show less link' do
        before do
          click_on 'Show Less'
        end

        it 'displays the correct records' do
          within '#associated-tools-panel' do
            expect(page).to have_content(@tool_concept_response.body['Name'])
            expect(page).to have_content(@tool_concept_response2.body['Name'])
            expect(page).to have_content(@tool_concept_response3.body['Name'])
            expect(page).to have_no_content(@tool_concept_response4.body['Name'])
          end
        end
      end
    end
  end

  context 'when viewing a collection with many associated services', js: true do
    before do
      @service_ingest_response, @service_concept_response = publish_service_draft(name: "A service #{Faker::Number.number(digits: 6)}")
      create_service_collection_association(@service_ingest_response['concept-id'], @ingest_response['concept-id'])
      @service_ingest_response2, @service_concept_response2 = publish_service_draft(name: "B service #{Faker::Number.number(digits: 6)}")
      create_service_collection_association(@service_ingest_response2['concept-id'], @ingest_response['concept-id'])
      @service_ingest_response3, @service_concept_response3 = publish_service_draft(name: "C service #{Faker::Number.number(digits: 6)}")
      create_service_collection_association(@service_ingest_response3['concept-id'], @ingest_response['concept-id'])
      @service_ingest_response4, @service_concept_response4 = publish_service_draft(name: "D service #{Faker::Number.number(digits: 6)}")
      create_service_collection_association(@service_ingest_response4['concept-id'], @ingest_response['concept-id'])
      wait_for_cmr

      visit collection_path(@ingest_response['concept-id'])

      find('.tab-label', text: 'Services').click
    end

    it 'has a show more link' do
      within '#associated-services-panel' do
        expect(page).to have_link('Show More')
        expect(page).to have_no_link('Show Less')
      end
    end

    it 'displays the correct records' do
      within '#associated-services-panel' do
        expect(page).to have_content(@service_concept_response.body['Name'])
        expect(page).to have_content(@service_concept_response2.body['Name'])
        expect(page).to have_content(@service_concept_response3.body['Name'])
        expect(page).to have_no_content(@service_concept_response4.body['Name'])
      end
    end

    context 'when clicking the show more link' do
      before do
        click_on 'Show More'
      end

      it 'displays all four records' do
        within '#associated-services-panel' do
          expect(page).to have_content(@service_concept_response.body['Name'])
          expect(page).to have_content(@service_concept_response2.body['Name'])
          expect(page).to have_content(@service_concept_response3.body['Name'])
          expect(page).to have_content(@service_concept_response4.body['Name'])
        end
      end

      context 'when clicking the show less link' do
        before do
          click_on 'Show Less'
        end

        it 'displays the correct records' do
          within '#associated-services-panel' do
            expect(page).to have_content(@service_concept_response.body['Name'])
            expect(page).to have_content(@service_concept_response2.body['Name'])
            expect(page).to have_content(@service_concept_response3.body['Name'])
            expect(page).to have_no_content(@service_concept_response4.body['Name'])
          end
        end
      end
    end
  end
end
