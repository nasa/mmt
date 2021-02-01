describe 'Valid Tool Draft Tool Information Preview' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }
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
            expect(page).to have_css('.eui-icon.icon-green.eui-check', text: 'Tool Information is valid')
          end
        end
      end

      it 'displays the correct progress indicators for required fields' do
        within '#tool_information-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required.icon-green.name-label')
          expect(page).to have_css('.eui-icon.eui-required.icon-green.long-name-label')
          expect(page).to have_css('.eui-icon.eui-required.icon-green.type-label')
          expect(page).to have_css('.eui-icon.eui-required.icon-green.version-label')
          expect(page).to have_css('.eui-icon.eui-required.icon-green.description-label')
          expect(page).to have_css('.eui-icon.eui-required.icon-green.url')
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.version-description-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.last-updated-date-label')
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.doi-label')
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
              expect(page).to have_css('h5', text: 'DistributionURL')
            end

            within '.card-body' do
              expect(page).to have_css('p', text: 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.')
              expect(page).to have_link(nil, href: 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html')
              expect(page).to have_css('li.arrow-tag-group-item', text: 'DOWNLOAD SOFTWARE')
              expect(page).to have_css('li.arrow-tag-group-item', text: 'MOBILE APP')
             end
          end
        end
      end
    end
  end
end
