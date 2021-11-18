describe 'Valid Tool Tool Information Preview', js:true, reset_provider: true do
  before :all do
    @ingest_response, @concept_response, @native_id = publish_tool_draft
  end

  before do
    login
    visit tool_path(@ingest_response['concept-id'])
  end

  context 'when examining the Potential Action section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.potential_action' do
        expect(page).to have_css('h4', text: 'Potential Action')

        within '#tool_potential_action_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_css('p', text: 'SearchAction')
        end

        within '#tool_potential_action_target_preview' do
          expect(page).to have_css('h5', text: 'Target')
          within '#tool_potential_action_target_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_css('p', text: 'EntryPoint')
          end
          within '#tool_potential_action_target_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'the description')
          end
          within '#tool_potential_action_target_response_content_type_preview' do
            expect(page).to have_css('h6', text: 'Response Content Type')
            expect(page).to have_css('p', text: 'text/html')
          end
          within '#tool_potential_action_target_url_template_preview' do
            expect(page).to have_css('h5', text: 'Url Template')
            expect(page).to have_css('p', text: 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l={+layers}&ve={+bbox}&d={+date}')
          end
          within '#tool_potential_action_target_http_method_preview' do
            expect(page).to have_css('h6', text: 'Http Method 1')
            expect(page).to have_css('p', text: 'GET')
          end
        end

        within "#tool_potential_action_query_input_preview" do
          expect(page).to have_css('h6', text: 'Query Input 1')
          within '#tool_potential_action_query_input_0_value_type_preview' do
            expect(page).to have_css('h5', text: 'Value Type')
            expect(page).to have_css('p', text: 'the query input value type')
          end
          within '#tool_potential_action_query_input_0_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'query input description for layers')
          end
          within '#tool_potential_action_query_input_0_value_name_preview' do
            expect(page).to have_css('h5', text: 'Value Name')
            expect(page).to have_css('p', text: 'layers')
          end
          within '#tool_potential_action_query_input_0_value_required_preview' do
            expect(page).to have_css('h5', text: 'Value Required')
            expect(page).to have_css('p', text: 'true')
          end

          expect(page).to have_css('h6', text: 'Query Input 2')
          within '#tool_potential_action_query_input_1_value_type_preview' do
            expect(page).to have_css('h5', text: 'Value Type')
            expect(page).to have_css('p', text: 'the query input value type')
          end
          within '#tool_potential_action_query_input_1_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'query input description for date param')
          end
          within '#tool_potential_action_query_input_1_value_name_preview' do
            expect(page).to have_css('h5', text: 'Value Name')
            expect(page).to have_css('p', text: 'date')
          end
          within '#tool_potential_action_query_input_1_value_required_preview' do
            expect(page).to have_css('h5', text: 'Value Required')
            expect(page).to have_css('p', text: 'No value for Value Required provided.')
          end

          expect(page).to have_css('h6', text: 'Query Input 3')
          within '#tool_potential_action_query_input_2_value_type_preview' do
            expect(page).to have_css('h5', text: 'Value Type')
            expect(page).to have_css('p', text: 'the query input value type')
          end
          within '#tool_potential_action_query_input_2_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_css('p', text: 'query input description for bbox param')
          end
          within '#tool_potential_action_query_input_2_value_name_preview' do
            expect(page).to have_css('h5', text: 'Value Name')
            expect(page).to have_css('p', text: 'bbox')
          end
          within '#tool_potential_action_query_input_2_value_required_preview' do
            expect(page).to have_css('h5', text: 'Value Required')
            expect(page).to have_css('p', text: 'No value for Value Required provided.')
          end
        end
      end

    end
  end
end
