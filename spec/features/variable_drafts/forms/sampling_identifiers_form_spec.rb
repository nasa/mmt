describe 'Variable Drafts Sampling Identifiers Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'sampling_identifiers')
  end

  context 'When viewing the form with no stored values' do
    it 'does not display required icons for accordions in Sampling Identifiers section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Sampling Identifiers')
      expect(page).to have_content('The sampling information of a variable.')
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Sampling Identifiers')
      end
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Sampling Identifier')
    end

    it 'has no required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end
  end

  context 'when filling out the form' do
    before do
      within '.multiple.sampling-identifiers' do
        within '.multiple-item-0' do
          fill_in 'Sampling Method', with: 'Satellite overpass'
          fill_in 'Measurement Conditions', with: 'Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).'
          fill_in 'Reporting Conditions', with: 'At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F.'
        end

        click_on 'Add another Sampling Identifier'

        within '.multiple > .multiple-item-1' do
          fill_in 'Sampling Method', with: 'Satellite overpass 1'
          fill_in 'Measurement Conditions', with: 'Measured at bottom of atmosphere'
          fill_in 'Reporting Conditions', with: 'At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F.'
        end
      end
    end

    context 'When clicking `Save` to save the form' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 4)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        expect(page).to have_field('variable_draft_draft_sampling_identifiers_0_sampling_method', with: 'Satellite overpass')
        expect(page).to have_field('variable_draft_draft_sampling_identifiers_0_measurement_conditions', with: 'Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).')
        expect(page).to have_field('variable_draft_draft_sampling_identifiers_0_reporting_conditions', with: 'At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F.')
        expect(page).to have_field('variable_draft_draft_sampling_identifiers_1_sampling_method', with: 'Satellite overpass 1')
        expect(page).to have_field('variable_draft_draft_sampling_identifiers_1_measurement_conditions', with: 'Measured at bottom of atmosphere')
        expect(page).to have_field('variable_draft_draft_sampling_identifiers_1_reporting_conditions', with: 'At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F.')
      end
    end
  end
end
