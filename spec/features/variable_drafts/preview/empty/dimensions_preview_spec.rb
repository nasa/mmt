describe 'Empty Variable Draft Dimensions Preview' do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(variable_draft)
  end

  context 'When examining the Dimensions section' do
    it 'displays the form title as an edit link' do
      within '#dimensions-progress' do
        expect(page).to have_link('Dimensions', href: edit_variable_draft_path(variable_draft, 'dimensions'))
      end
    end

    it 'displays the correct status icon' do
      within '#dimensions-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
        end
      end
    end

    it 'displays the correct progress indicators for non-required fields' do
      within '#dimensions-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.dimensions')
        expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'dimensions'))
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#dimensions-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required-o.icon-green')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.dimensions' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_dimensions_preview' do
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions'))

          expect(page).to have_css('p', text: 'No value for Dimensions provided.')
        end
      end
    end
  end
end
