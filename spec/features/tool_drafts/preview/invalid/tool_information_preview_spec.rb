describe 'Invalid Tool Draft Tool Information Preview' do
  let(:tool_draft) { create(:invalid_tool_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { tool_draft.draft }

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

      it 'displays the correct progress indicators for invalid fields' do
        anchors = [
          'name-label','long-name-label','version-label','version-description-label',
          'type-label','last-updated-date-label','description-label','doi-label','url'
        ]

        within '#tool_information-progress .progress-indicators' do
          anchors.each do |anchor|
            expect(page).to have_css(".eui-icon.eui-fa-minus-circle.icon-red.#{anchor}")
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: anchor))
          end
        end
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

            expect(page).to have_css('p', text: draft['Name'])
          end

          within '#tool_draft_draft_long_name_preview' do
            expect(page).to have_css('h5', text: 'Long Name')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_long_name'))

            expect(page).to have_css('p', text: draft['LongName'])
          end

          within '#tool_draft_draft_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_type'))

            expect(page).to have_css('p', text: draft['Type'])
          end

          within '#tool_draft_draft_version_preview' do
            expect(page).to have_css('h5', text: 'Version')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_version'))

            expect(page).to have_css('p', text: draft['Version'])
          end

          within '#tool_draft_draft_version_description_preview' do
            expect(page).to have_css('h5', text: 'Version Description')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_version_description'))

            expect(page).to have_css('p', text: draft['VersionDescription'])
          end

          within '#tool_draft_draft_last_updated_date_preview' do
            expect(page).to have_css('h5', text: 'Last Updated Date')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_last_updated_date'))

            expect(page).to have_css('p', text: draft['Last Updated Date'])
          end

          within '#tool_draft_draft_description_preview' do
            expect(page).to have_css('h5', text: 'Description')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_description'))

            expect(page).to have_css('p', text: draft['Description'])
          end

          within '#tool_draft_draft_doi_preview' do
            expect(page).to have_css('h5', text: 'DOI')
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_doi'))

            expect(page).to have_css('p', text: draft['DOI'])
          end

          within '#tool_draft_draft_url_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_information', anchor: 'tool_draft_draft_url'))

            within '.card-header' do
              expect(page).to have_css('h5', text: 'INVALID')
            end

            within '.card-body' do
              expect(page).to have_content('Not Provided')
              expect(page).to have_css('li', text: 'INVALID')
            end
          end
        end
      end
    end
  end
end
