describe 'Empty Variable Draft Variable Index Ranges Preview' do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(variable_draft)
  end

  context 'When examining the Variable Index Ranges section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview-sidebar' do
        within '.umm-preview.variable_information' do
          expect(page).to have_css('.umm-preview-field-container', count: 1)

          within '#variable_draft_draft_index_ranges_preview' do
            expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'variable_information', anchor: 'variable_draft_draft_index_ranges'))

            expect(page).to have_css('p', text: 'No value for Index Ranges provided.')
          end
        end
      end
    end
  end
end
