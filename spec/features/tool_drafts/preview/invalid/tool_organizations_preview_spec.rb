describe 'Invalid Tool Draft Tool Organizations Preview' do
  let(:tool_draft) { create(:invalid_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Organizations sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#tool_organizations-progress' do
          expect(page).to have_link('Tool Organizations', href: edit_tool_draft_path(tool_draft, 'tool_organizations'))
        end
      end

      it 'displays the correct status icon' do
        within '#tool_organizations-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o', text: 'Tool Organizations is incomplete')
          end
        end
      end

      it 'displays the correct progress indicators for invalid fields' do
        within '#tool_organizations-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.organizations')
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.tool_organizations' do
          expect(page).to have_css('h4', text: 'Tool Organizations')

          expect(page).to have_css('.umm-preview-field-container', count: 1)

          within '#tool_draft_draft_organizations_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_organizations', anchor: 'tool_draft_draft_organizations'))

            within 'ul.tool-organizations-cards' do
              within 'li.card:nth-child(1)' do
                within '.card-header' do
                  expect(page).to have_content('DOI/USGS/CMG/WHSC')
                end

                within '.card-body' do
                  within '.card-body-details' do
                    expect(page).to have_content('Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior')
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
