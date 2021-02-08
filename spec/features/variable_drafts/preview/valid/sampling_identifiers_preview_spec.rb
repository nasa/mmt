describe 'Valid Variable Draft Sampling Identifiers Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Sampling Identifiers section' do
    it 'displays the form title as an edit link' do
      within '#sampling_identifiers-progress' do
        expect(page).to have_link('Sampling Identifiers', href: edit_variable_draft_path(@draft, 'sampling_identifiers'))
      end
    end

    it 'displays the current status icon' do
      within '#sampling_identifiers-progress .status' do
        expect(page).to have_css('.eui-icon.icon-green.eui-check')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#sampling_identifiers-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.sampling-identifiers')
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'sampling-identifiers'))
      end
    end

    it 'displays links to edit/update the data' do
      within '.umm-preview.sampling_identifiers' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_0_sampling_method'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_0_measurement_conditions'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_0_reporting_conditions'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_1_sampling_method'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_1_measurement_conditions'))
        expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_1_reporting_conditions'))
      end
    end

    include_examples 'Variable Sampling Identifiers Full Preview'
  end
end
