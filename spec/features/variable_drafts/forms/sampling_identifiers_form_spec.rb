describe 'Sampling Identifiers Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'sampling_identifiers')
    end

    it 'does not display required icons for accordions in Sampling Identifiers section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Sampling Identifiers')
      expect(page).to have_content('The sampling information of a variable.')
    end

    it 'has no required fields' do
      expect(page).not_to have_selector('label.eui-required-o')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Measurement Identifiers')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Sampling Identifiers')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sampling_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sampling_identifiers')
        end
      end
    end

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Measurement Identifiers', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Measurement Identifiers')
        end

        within '.umm-form' do
          expect(page).to have_content('Measurement Identifiers')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Science Keywords', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Science Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) {
      create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    }

    before do
      visit edit_variable_draft_path(draft, 'sampling_identifiers')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_sampling_identifiers_0_sampling_method', with: 'Satellite overpass')
      expect(page).to have_field('variable_draft_draft_sampling_identifiers_0_measurement_conditions', with: 'Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).')
      expect(page).to have_field('variable_draft_draft_sampling_identifiers_0_reporting_conditions', with: 'At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F.')
      expect(page).to have_field('variable_draft_draft_sampling_identifiers_1_sampling_method', with: 'Satellite overpass 1')
      expect(page).to have_field('variable_draft_draft_sampling_identifiers_1_measurement_conditions', with: 'Measured at bottom of atmosphere')
      expect(page).to have_field('variable_draft_draft_sampling_identifiers_1_reporting_conditions', with: 'At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F.')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Measurement Identifiers')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft without making any changes' do
        expect(draft.draft).to eq(Draft.last.draft)
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Sampling Identifiers')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sampling_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sampling_identifiers')
        end
      end

      it 'displays the correct values in the form' do
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
