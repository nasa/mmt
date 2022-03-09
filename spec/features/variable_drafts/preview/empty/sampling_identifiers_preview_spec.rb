describe 'Empty Variable Draft Sampling Identifiers Preview' do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(variable_draft)
  end

  context 'When examining the Sampling Identifiers section' do
    it 'displays the form title as an edit link' do
      within '#sampling_identifiers-progress' do
        expect(page).to have_link('Sampling Identifiers', href: edit_variable_draft_path(variable_draft, 'sampling_identifiers'))
      end
    end

    it 'displays the current status icon' do
      within '#sampling_identifiers-progress .status' do
        expect(page).to have_css('.eui-icon.icon-green.eui-check')
      end
    end

    it 'displays no progress indicators for required fields' do
      within '#sampling_identifiers-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#sampling_identifiers-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.sampling-identifiers')
        expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sampling_identifiers', anchor: 'sampling-identifiers'))
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.sampling_identifiers' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_sampling_identifiers_preview' do

          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers'))

          expect(page).to have_css('p', text: 'No value for Sampling Identifiers provided.')
        end
      end
    end
  end
end
