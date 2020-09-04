describe 'Valid Variable Draft Index Ranges Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Index Ranges section' do
    it 'has the proper number of containers and edit links' do
      within '.umm-preview-sidebar' do
        within '.umm-preview.variable_information' do
          expect(page).to have_css('.umm-preview-field-container', count: 3)

          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_index_ranges_lat_range'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_information', anchor: 'variable_draft_draft_index_ranges_lon_range'))
        end
      end
    end

    include_examples 'Variable Index Ranges Full Preview'
  end
end
