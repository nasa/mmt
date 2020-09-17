describe 'Empty Variable Draft Measurement Identifiers Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Measurement Identifiers section' do
    it 'displays the form title as an edit link' do
      within '#measurement_identifiers-progress' do
        expect(page).to have_link('Measurement Identifiers', href: edit_variable_draft_path(@draft, 'measurement_identifiers'))
      end
    end

    it 'displays the current status icon' do
      within '#measurement_identifiers-progress .status' do
        expect(page).to have_css('.eui-icon.icon-green.eui-check')
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#measurement_identifiers-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#measurement_identifiers-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.measurement-identifiers')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.measurement_identifiers' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_measurement_identifiers_preview' do

          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers'))

          expect(page).to have_css('p', text: 'No value for Measurement Identifiers provided.')
        end
      end
    end
  end
end
