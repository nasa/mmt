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
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.sampling_identifiers' do
        expect(page).to have_css('.umm-preview-field-container', count: 7)

        within '#variable_draft_draft_sampling_identifiers_preview' do

          expect(page).to have_css('h6', text: 'Sampling Identifier 1')

          within '#variable_draft_draft_sampling_identifiers_0_sampling_method_preview' do
            expect(page).to have_css('h5', text: 'Sampling Method')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_0_sampling_method'))
            expect(page).to have_css('p', text: 'Satellite overpass')
          end

          within '#variable_draft_draft_sampling_identifiers_0_measurement_conditions_preview' do
            expect(page).to have_css('h5', text: 'Measurement Conditions')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_0_measurement_conditions'))
            expect(page).to have_css('p', text:'Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).')
          end

          within '#variable_draft_draft_sampling_identifiers_0_reporting_conditions_preview' do
            expect(page).to have_css('h5', text: 'Reporting Conditions')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_0_reporting_conditions'))
            expect(page).to have_css('p', text: 'At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F.')
          end

          expect(page).to have_css('h6', text: 'Sampling Identifier 2')

          within '#variable_draft_draft_sampling_identifiers_1_sampling_method_preview' do
            expect(page).to have_css('h5', text: 'Sampling Method')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_1_sampling_method'))
            expect(page).to have_css('p', text: 'Satellite overpass 1')
          end

          within '#variable_draft_draft_sampling_identifiers_1_measurement_conditions_preview' do
            expect(page).to have_css('h5', text: 'Measurement Conditions')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_1_measurement_conditions'))
            expect(page).to have_css('p', text:'Measured at bottom of atmosphere')
          end

          within '#variable_draft_draft_sampling_identifiers_1_reporting_conditions_preview' do
            expect(page).to have_css('h5', text: 'Reporting Conditions')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sampling_identifiers', anchor: 'variable_draft_draft_sampling_identifiers_1_reporting_conditions'))
            expect(page).to have_css('p', text: 'At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F.')
          end
        end
      end
    end
  end
end
