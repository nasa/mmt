describe 'Invalid Variable Draft Variable Characteristics Preview' do
  before do
    login
    @draft = create(:invalid_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Variable Characteristics section' do
    it 'displays the form title as an edit link' do
      within '#variable_characteristics-progress' do
        expect(page).to have_link('Variable Characteristics', href: edit_variable_draft_path(@draft, 'variable_characteristics'))
      end
    end

    it 'displays the correct status icon' do
      within '#variable_characteristics-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
        end
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#variable_characteristics-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for invalid fields' do
      within '#variable_characteristics-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.characteristics')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.variable_characteristics' do
        expect(page).to have_css('.umm-preview-field-container', count: 5)

        within '#variable_draft_draft_characteristics_index_ranges_lat_range_preview' do
          expect(page).to have_css('h5', text: 'Lat Range')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_index_ranges_lat_range'))
          expect(page).to have_css('h6', text: 'Lat Range 1')
          expect(page).to have_css('p', text: 'abc')
          expect(page).to have_css('h6', text: 'Lat Range 2')
          expect(page).to have_css('p', text: '90.0')
        end

        within '#variable_draft_draft_characteristics_index_ranges_lon_range_preview' do
          expect(page).to have_css('h5', text: 'Lon Range')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_index_ranges_lon_range'))
          expect(page).to have_css('h6', text: 'Lon Range 1')
          expect(page).to have_css('p', text: '-180.0')
          expect(page).to have_css('h6', text: 'Lon Range 2')
          expect(page).to have_css('p', text: '180.0')
        end

        within '#variable_draft_draft_characteristics_group_path_preview' do
          expect(page).to have_css('h5', text: 'Group Path')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'variable_characteristics', anchor: 'variable_draft_draft_characteristics_group_path'))
          expect(page).to have_css('p', text: 'No value for Group Path provided.')
        end
      end
    end
  end
end
