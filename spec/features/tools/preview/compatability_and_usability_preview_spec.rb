describe 'Valid Tool Draft Compatibility and Usability Preview', reset_provider: true do
  before :all do
    @ingest_response, @concept_response, @native_id = publish_tool_draft
  end

  before do
    login
    visit tool_path(@ingest_response['concept-id'])
  end

  context 'when examining the Compatibility and Usability sections' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.compatibility_and_usability' do
        expect(page).to have_css('h4', text: 'Compatibility and Usability')

        expect(page).to have_css('.umm-preview-field-container', count: 25)

        within '#tool_supported_input_formats_preview' do
          expect(page).to have_css('h5', text: 'Supported Input Formats')

          expect(page).to have_css('h6', text: 'Supported Input Format 1')
          expect(page).to have_css('p', text: @concept_response.body['SupportedInputFormats'].first)
          expect(page).to have_css('h6', text: 'Supported Input Format 2')
          expect(page).to have_css('p', text: @concept_response.body['SupportedInputFormats'].second)
        end

        within '#tool_supported_output_formats_preview' do
          expect(page).to have_css('h5', text: 'Supported Output Formats')

          expect(page).to have_css('h6', text: 'Supported Output Format 1')
          expect(page).to have_css('p', text: @concept_response.body['SupportedOutputFormats'].first)
          expect(page).to have_css('h6', text: 'Supported Output Format 2')
          expect(page).to have_css('p', text: @concept_response.body['SupportedOutputFormats'].second)
        end

        within '#tool_supported_operating_systems_preview' do
          expect(page).to have_css('h5', text: 'Supported Operating Systems')


          expect(page).to have_css('h6', text: 'Supported Operating System 1')
          expect(page).to have_css('h5', text: 'Operating System Name', count: 2)
          expect(page).to have_css('h5', text: 'Operating System Version', count: 2)
          expect(page).to have_css('p', text: @concept_response.body['SupportedOperatingSystems'].first['OperatingSystemName'])
          expect(page).to have_css('p', text: @concept_response.body['SupportedOperatingSystems'].first['OperatingSystemVersion'])
          expect(page).to have_css('h6', text: 'Supported Operating System 2')
          expect(page).to have_css('p', text: @concept_response.body['SupportedOperatingSystems'].second['OperatingSystemName'])
          expect(page).to have_css('p', text: @concept_response.body['SupportedOperatingSystems'].second['OperatingSystemVersion'])
        end

        within '#tool_supported_browsers_preview' do
          expect(page).to have_css('h5', text: 'Supported Browsers')

          expect(page).to have_css('h6', text: 'Supported Browser 1')
          expect(page).to have_css('h5', text: 'Browser Name', count: 2)
          expect(page).to have_css('h5', text: 'Browser Version', count: 2)
          expect(page).to have_css('p', text: @concept_response.body['SupportedBrowsers'].first['BrowserName'])
          expect(page).to have_css('p', text: @concept_response.body['SupportedBrowsers'].first['BrowserVersion'])
          expect(page).to have_css('h6', text: 'Supported Browser 2')
          expect(page).to have_css('p', text: @concept_response.body['SupportedBrowsers'].second['BrowserName'])
          expect(page).to have_css('p', text: @concept_response.body['SupportedBrowsers'].second['BrowserVersion'])
        end

        within '#tool_supported_software_languages_preview' do
          expect(page).to have_css('h5', text: 'Supported Software Languages')

          expect(page).to have_css('h6', text: 'Supported Software Language 1')
          expect(page).to have_css('h5', text: 'Software Language Name', count: 2)
          expect(page).to have_css('h5', text: 'Software Language Version', count: 2)
          expect(page).to have_css('p', text: @concept_response.body['SupportedSoftwareLanguages'].first['SoftwareLanguageName'])
          expect(page).to have_css('p', text: @concept_response.body['SupportedSoftwareLanguages'].first['SoftwareLanguageVersion'])
          expect(page).to have_css('h6', text: 'Supported Software Language 2')
          expect(page).to have_css('p', text: @concept_response.body['SupportedSoftwareLanguages'].second['SoftwareLanguageName'])
          expect(page).to have_css('p', text: @concept_response.body['SupportedSoftwareLanguages'].second['SoftwareLanguageVersion'])
        end

        within '#tool_quality_preview' do
          expect(page).to have_css('h5', text: 'Quality')

          expect(page).to have_css('h5', text: 'Quality Flag')
          expect(page).to have_css('p', text: @concept_response.body['Quality']['QualityFlag'])

          expect(page).to have_css('h5', text: 'Traceability')
          expect(page).to have_css('p', text: @concept_response.body['Quality']['Traceability'])

          expect(page).to have_css('h5', text: 'Lineage')
          expect(page).to have_css('p', text: @concept_response.body['Quality']['Lineage'])
        end

        within '#tool_access_constraints_preview' do
          expect(page).to have_css('h5', text: 'Access Constraints')

          expect(page).to have_css('p', text: @concept_response.body['AccessConstraints'])
        end

        within '#tool_use_constraints_preview' do
          expect(page).to have_css('h5', text: 'Use Constraints')

          expect(page).to have_css('h5', text: 'License Url')
          expect(page).to have_css('p', text: @concept_response.body['UseConstraints']['LicenseUrl'])

          expect(page).to have_css('h5', text: 'License Text')
          expect(page).to have_css('p', text: @concept_response.body['UseConstraints']['LicenseText'])
        end
      end
    end
  end
end
