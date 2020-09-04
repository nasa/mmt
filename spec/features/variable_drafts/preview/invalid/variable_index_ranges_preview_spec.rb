describe 'Invalid Variable Draft Variable Characteristics Preview' do
  before do
    login
    @draft = create(:invalid_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Variable Characteristics section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview-sidebar' do
        within '.umm-preview.variable_information' do
          expect(page).to have_css('.umm-preview-field-container', count: 3)

          within '#variable_draft_draft_index_ranges_lat_range_preview' do
            expect(page).to have_css('h5', text: 'Lat Range')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_index_ranges_lat_range'))
            expect(page).to have_css('h6', text: 'Lat Range 1')
            expect(page).to have_css('p', text: 'string')
            expect(page).to have_css('h6', text: 'Lat Range 2')
            expect(page).to have_css('p', text: '90.0')
          end

          within '#variable_draft_draft_index_ranges_lon_range_preview' do
            expect(page).to have_css('h5', text: 'Lon Range')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_index_ranges_lon_range'))
            expect(page).to have_css('h6', text: 'Lon Range 1')
            expect(page).to have_css('p', text: '-180.0')
            expect(page).to have_css('h6', text: 'Lon Range 2')
            expect(page).to have_css('p', text: '180.0')
          end
        end
      end
    end
  end
end
