describe 'Invalid Tool Draft Compatibility and Usability Preview' do
  let(:tool_draft) { create(:invalid_tool_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { tool_draft.draft }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examing the Compatibility and Usability sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#compatibility_and_usability-progress' do
          expect(page).to have_link('Compatibility and Usability', href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability'))
        end
      end

      it 'displays the corrent status icon' do
        within '#compatibility_and_usability-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o', text: 'Compatibility and Usability is incomplete')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#compatibility_and_usability-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.supported-input-formats')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.supported-output-formats')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.supported-operating-systems')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.supported-browsers')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.supported-software-languages')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.quality')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.access-constraints')
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.use-constraints')
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.compatibility_and_usability' do
          expect(page).to have_css('h4', text: 'Compatibility and Usability')

          expect(page).to have_css('.umm-preview-field-container', count: 19)

          within '#tool_draft_draft_supported_input_formats_preview' do
            expect(page).to have_css('h5', text: 'Supported Input Formats')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_input_formats'))

            expect(page).to have_css('h6', text: 'Supported Input Format 1')
            expect(page).to have_css('p', text: draft['SupportedInputFormats'].first)
          end

          within '#tool_draft_draft_supported_output_formats_preview' do
            expect(page).to have_css('h5', text: 'Supported Output Formats')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_output_formats'))

            expect(page).to have_css('h6', text: 'Supported Output Format 1')
            expect(page).to have_css('p', text: draft['SupportedOutputFormats'].first)
          end

          within '#tool_draft_draft_supported_operating_systems_preview' do
            expect(page).to have_css('h5', text: 'Supported Operating Systems')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_operating_systems'))


            expect(page).to have_css('h6', text: 'Supported Operating System 1')
            expect(page).to have_css('h5', text: 'Operating System Name')
            expect(page).to have_css('p', text: 'No value for Operating System Name provided.')
            expect(page).to have_css('h5', text: 'Operating System Version')
            expect(page).to have_css('p', text: draft['SupportedOperatingSystems'].first['OperatingSystemVersion'])
          end

          within '#tool_draft_draft_supported_browsers_preview' do
            expect(page).to have_css('h5', text: 'Supported Browsers')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_browsers'))

            expect(page).to have_css('h6', text: 'Supported Browser 1')
            expect(page).to have_css('h5', text: 'Browser Name')
            expect(page).to have_css('p', text: 'No value for Browser Name provided.')
            expect(page).to have_css('h5', text: 'Browser Version')
            expect(page).to have_css('p', text: draft['SupportedBrowsers'].first['BrowserVersion'])
          end

          within '#tool_draft_draft_supported_software_languages_preview' do
            expect(page).to have_css('h5', text: 'Supported Software Languages')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_software_languages'))

            expect(page).to have_css('h6', text: 'Supported Software Language 1')
            expect(page).to have_css('h5', text: 'Software Language Name')
            expect(page).to have_css('p', text: 'No value for Software Language Name provided.')
            expect(page).to have_css('h5', text: 'Software Language Version')
            expect(page).to have_css('p', text: draft['SupportedSoftwareLanguages'].first['SoftwareLanguageVersion'])
          end

          within '#tool_draft_draft_quality_preview' do
            expect(page).to have_css('h5', text: 'Quality')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_quality'))

            expect(page).to have_css('h5', text: 'Quality Flag')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_quality_quality_flag'))
            expect(page).to have_css('p', text: 'No value for Quality Flag provided.')

            expect(page).to have_css('h5', text: 'Traceability')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_quality_traceability'))
            expect(page).to have_css('p', text: draft['Quality']['Traceability'])

            expect(page).to have_css('h5', text: 'Lineage')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_quality_lineage'))
            expect(page).to have_css('p', text: 'No value for Lineage provided.')
          end

          within '#tool_draft_draft_access_constraints_preview' do
            expect(page).to have_css('h5', text: 'Access Constraints')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_access_constraints'))

            expect(page).to have_css('p', text: draft['AccessConstraints'])
          end

          within '#tool_draft_draft_use_constraints_preview' do
            expect(page).to have_css('h5', text: 'Use Constraints')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_use_constraints'))

            expect(page).to have_css('h5', text: 'License Url')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_use_constraints_license_url'))
            expect(page).to have_css('p', text: draft['UseConstraints']['LicenseUrl'])

            expect(page).to have_css('h5', text: 'License Text')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_use_constraints_license_text'))
            expect(page).to have_css('p', text: 'No value for License Text provided.')
          end
        end
      end
    end
  end
end
