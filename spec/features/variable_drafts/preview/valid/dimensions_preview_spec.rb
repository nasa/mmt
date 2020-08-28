describe 'Valid Variable Draft Dimensions Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Dimensions section' do
    it 'displays the form title as an edit link' do
      within '#dimensions-progress' do
        expect(page).to have_link('Dimensions', href: edit_variable_draft_path(@draft, 'dimensions'))
      end
    end

    it 'displays the correct status icon' do
      within '#dimensions-progress' do
        within '.status' do
          expect(page).to have_content('Dimensions is valid')
        end
      end
    end

    it 'displays the correct progress indicators for non-required fields' do
      within '#dimensions-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.dimensions')
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#dimensions-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.dimensions' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        within '#variable_draft_draft_dimensions_preview' do
          expect(page).to have_css('h6', text: 'Dimension 1')

          within '#variable_draft_draft_dimensions_0_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_0_name'))
            expect(page).to have_css('p', text: 'LatDim')
          end

          within '#variable_draft_draft_dimensions_0_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_0_size'))
            expect(page).to have_css('p', text: '36')
          end

          within '#variable_draft_draft_dimensions_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_0_type'))
            expect(page).to have_css('p', text: 'LATITUDE_DIMENSION')
          end

          expect(page).to have_css('h6', text: 'Dimension 2')

          within '#variable_draft_draft_dimensions_1_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_1_name'))
            expect(page).to have_css('p', text: 'Lizard Herp Doc Pop')
          end

          within '#variable_draft_draft_dimensions_1_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_1_size'))
            expect(page).to have_css('p', text: '2020')
          end

          within '#variable_draft_draft_dimensions_1_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_1_type'))
            expect(page).to have_css('p', text: 'LONGITUDE_DIMENSION')
          end
        end
      end
    end
  end
end
