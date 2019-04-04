describe 'Invalid Variable Draft Acquisition Source Name Preview', :js => true do
  before do
    login
    @draft = create(:invalid_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Acquisition Source Name section' do
    it 'displays the form title as an edit link' do
      within '#acquisition_source_name-progress' do
        expect(page).to have_link('Acquisition Source Name', href: edit_variable_draft_path(@draft, 'acquisition_source_name'))
      end
    end

    it 'displays the current status icon' do
      within '#acquisition_source_name-progress > div.status' do
        expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#acquisition_source_name-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.acquisition_source_name' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_acquisition_source_name_preview' do
          expect(page).to have_css('h5', text: 'Acquisition Source Name')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'acquisition_source_name', anchor: 'variable_draft_draft_acquisition_source_name'))
          expect(page).to have_css('p', text: 'No value for Acquisition Source Name provided.')
        end
      end
    end
  end
end
