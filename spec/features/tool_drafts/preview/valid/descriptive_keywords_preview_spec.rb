describe 'Valid Tool Draft Descriptive Keywords Preview' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Descriptive Keywords sections' do

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.descriptive_keywords' do
          expect(page).to have_css('h4', text: 'Descriptive Keywords')

          expect(page).to have_css('.umm-preview-field-container', count: 2)

          within '#tool_draft_draft_tool_keywords_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'descriptive_keywords', anchor: 'tool_draft_draft_tool_keywords'))

            keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
            expect(keyword_parts[0]).to have_content('EARTH SCIENCE SERVICES')
            expect(keyword_parts[1]).to have_content('DATA ANALYSIS AND VISUALIZATION')
            expect(keyword_parts[2]).to have_content('GEOGRAPHIC INFORMATION SYSTEMS')
            expect(keyword_parts[3]).to have_content('DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')

            keyword_parts = page.all('ul.arrow-tag-group-list')[1].all('li.arrow-tag-group-item')
            expect(keyword_parts[0]).to have_content('EARTH SCIENCE SERVICES')
            expect(keyword_parts[1]).to have_content('DATA ANALYSIS AND VISUALIZATION')
            expect(keyword_parts[2]).to have_content('GEOGRAPHIC INFORMATION SYSTEMS')
            expect(keyword_parts[3]).to have_content('MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
          end

          within '#tool_draft_draft_ancillary_keywords_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'descriptive_keywords', anchor: 'tool_draft_draft_ancillary_keywords'))

            expect(page).to have_css('h6', text: 'Ancillary Keyword 1')
            expect(page).to have_css('p', text: 'Ancillary keyword 1')
            expect(page).to have_css('h6', text: 'Ancillary Keyword 2')
            expect(page).to have_css('p', text: 'Ancillary keyword 2')
          end
        end
      end
    end
  end
end
