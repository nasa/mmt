describe 'Empty Tool Draft Tool Organizations Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

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

      it 'displays the correct progress indicators for required fields' do
        within '#tool_organizations-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.organizations')
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

            expect(page).to have_css('p', text: 'No value for Organizations provided.')
          end
        end
      end
    end
  end
end
