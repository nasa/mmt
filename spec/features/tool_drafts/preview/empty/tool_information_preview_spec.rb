describe 'Empty Tool Draft Tool Information Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Information sections' do

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.tool_information' do
          expect(page).to have_css('h4', text: 'Tool Information')

          expect(page).to have_css('.umm-preview-field-container', count: 9)

          within '#tool_draft_draft_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_name'))

            expect(page).to have_css('p', text: 'No value for Name provided.')
          end

          within '#tool_draft_draft_long_name_preview' do
            expect(page).to have_css('h5', text: 'Long Name')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_long_name'))

            expect(page).to have_css('p', text: 'No value for Long Name provided.')
          end

          within '#tool_draft_draft_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_type'))

            expect(page).to have_css('p', text: 'No value for Type provided.')
          end

          within '#tool_draft_draft_version_preview' do
            expect(page).to have_css('h5', text: 'Version')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_version'))

            expect(page).to have_css('p', text: 'No value for Version provided.')
          end

          within '#tool_draft_draft_version_description_preview' do
            expect(page).to have_css('h5', text: 'Version Description')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_version_description'))

            expect(page).to have_css('p', text: 'No value for Version Description provided.')
          end

          within '#tool_draft_draft_last_updated_date_preview' do
            expect(page).to have_css('h5', text: 'Last Updated Date')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_last_updated_date'))

            expect(page).to have_css('p', text: 'No value for Last Updated Date provided.')
          end

          within '#tool_draft_draft_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_description'))

            expect(page).to have_css('p', text: 'No value for Description provided.')
          end

          within '#tool_draft_draft_doi_preview' do
            expect(page).to have_css('h5', text: 'DOI')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_doi'))

            expect(page).to have_css('p', text: 'No value for DOI provided.')
          end

          within '#tool_draft_draft_url_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_url'))

            expect(page).to have_css('p', text: 'No value for URL provided')
          end
        end
      end
    end
  end
end
