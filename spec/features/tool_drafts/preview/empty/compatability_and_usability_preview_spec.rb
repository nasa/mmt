describe 'Empty Tool Draft Compatibility and Usability Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examing the Compatibility and Usability sections' do

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.compatibility_and_usability' do
          expect(page).to have_css('h4', text: 'Compatibility and Usability')

          expect(page).to have_css('.umm-preview-field-container', count: 8)

          within '#tool_draft_draft_supported_input_formats_preview' do
            expect(page).to have_css('h5', text: 'Supported Input Formats')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_input_formats'))

            expect(page).to have_css('p', text: 'No value for Supported Input Formats provided.')
          end

          within '#tool_draft_draft_supported_output_formats_preview' do
            expect(page).to have_css('h5', text: 'Supported Output Formats')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_output_formats'))

            expect(page).to have_css('p', text: 'No value for Supported Output Formats provided.')
          end

          within '#tool_draft_draft_supported_operating_systems_preview' do
            expect(page).to have_css('h5', text: 'Supported Operating Systems')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_operating_systems'))

            expect(page).to have_css('p', text: 'No value for Supported Operating Systems provided.')
          end

          within '#tool_draft_draft_supported_browsers_preview' do
            expect(page).to have_css('h5', text: 'Supported Browsers')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_browsers'))

            expect(page).to have_css('p', text: 'No value for Supported Browsers provided.')
          end

          within '#tool_draft_draft_supported_software_languages_preview' do
            expect(page).to have_css('h5', text: 'Supported Software Languages')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_supported_software_languages'))

            expect(page).to have_css('p', text: 'No value for Supported Software Languages provided.')
          end

          within '#tool_draft_draft_quality_preview' do
            expect(page).to have_css('h5', text: 'Quality')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_quality'))

            expect(page).to have_css('p', text: 'No value for Quality provided.')
          end

          within '#tool_draft_draft_access_constraints_preview' do
            expect(page).to have_css('h5', text: 'Access Constraints')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_access_constraints'))

            expect(page).to have_css('p', text: 'No value for Access Constraints provided.')
          end

          within '#tool_draft_draft_use_constraints_preview' do
            expect(page).to have_css('h5', text: 'Use Constraints')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'compatibility_and_usability', anchor: 'tool_draft_draft_use_constraints'))

            expect(page).to have_css('p', text: 'No value for Use Constraints provided.')
          end
        end
      end
    end
  end
end
