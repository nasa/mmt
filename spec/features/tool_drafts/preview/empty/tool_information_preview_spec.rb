describe 'Empty Tool Draft Tool Information Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Information sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#tool_information-progress' do
          expect(page).to have_link('Tool Information', href: edit_tool_draft_path(tool_draft, 'tool_information'))
        end
      end

      it 'displays the correct status icon' do
        within '#tool_information-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o', text: 'Tool Information is incomplete')
          end
        end
      end

      it 'displays the correct progress indicators for required fields' do
        within '#tool_information-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.name')
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.long-name')
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.version')
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.type')
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.description')
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.url')
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.version-description')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.last-updated-date')
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.doi')
      end
    end

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
