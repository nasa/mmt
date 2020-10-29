describe 'Measurement Identifiers Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'measurement_identifiers')
    end

    it 'does not display required icons for accordions in Measurement Identifiers section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Measurement Identifiers')
      expect(page).to have_content('The measurement information of a variable.')
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
          expect(page).to have_content('Dimensions')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
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
          expect(page).to have_content('c')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sampling_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sampling_identifiers')
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

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Dimensions', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Dimensions')
        end

        within '.umm-form' do
          expect(page).to have_content('Dimensions')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Sampling Identifiers', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Sampling Identifiers')
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
  end

  context 'When viewing the form with stored values' do
    let(:draft) {
      create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    }

    before do
      visit edit_variable_draft_path(draft, 'measurement_identifiers')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_context_medium', with: 'ocean')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_context_medium_uri', with: 'fake.website.gov')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_object', with: 'sea_ice-meltwater')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_object_uri', with: 'fake.website.gov')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_value', with: 'volume')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri', with: 'fake.website.gov')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_value', with: 'volume')

      expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_context_medium', with: 'ocean')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_object', with: 'sea_ice-meltwater')
      expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_value', with: 'volume')
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
          expect(page).to have_content('Dimensions')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('dimensions')
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
          expect(page).to have_content('Measurement Identifiers')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('measurement_identifiers')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_context_medium', with: 'ocean')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_context_medium_uri', with: 'fake.website.gov')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_object', with: 'sea_ice-meltwater')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_object_uri', with: 'fake.website.gov')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_value', with: 'volume')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri', with: 'fake.website.gov')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_value', with: 'volume')

        expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_context_medium', with: 'ocean')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_object', with: 'sea_ice-meltwater')
        expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_value', with: 'volume')
      end
    end
  end

  context 'when filling in the form' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'measurement_identifiers')
    end

    it 'the object and quantity start disabled' do
      expect(page).to have_field('Measurement Object', disabled: true)
      expect(page).to have_field('Value', disabled: true)
    end

    context 'when changing the medium context' do
      before do
        select 'glacier_bed', from: 'Measurement Context Medium'
      end

      it 'lets the user choose an object, but not a quantity' do
        expect(page).to have_field('Measurement Object', with: '')
        expect(page).to have_field('Value', disabled: true)
      end

      context 'when changing the context medium again' do
        before do
          select 'planetary_ice', from: 'Measurement Object'
          select 'ocean', from: 'Measurement Context Medium'
        end

        it 'changes the object back to an empty selection' do
          expect(page).to have_field('Measurement Object', with: '')
        end
      end
    end

    context 'when changing the object' do
      before do
        select 'ocean', from: 'Measurement Context Medium'
        select 'sea_ice', from: 'Measurement Object'
      end

      it 'lets the user choose a quantity' do
        expect(page).to have_field('Value', with: '')
      end

      context 'when changing the object again' do
        before do
          select 'area', from: 'Value'
          select 'sea_ice_radiation_incoming', from: 'Measurement Object'
        end

        it 'changes the quantity back to an empty selection' do
          expect(page).to have_field('Value', with: '')
        end
      end
    end
  end

  context 'when using fake measurement names' do
    before do
      mock_get_controlled_keywords_static
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'measurement_identifiers')
      select 'test_medium', from: 'Measurement Context Medium'
    end

    it 'automatically selects the only option for objects, but not quantities' do
      expect(page).to have_field('Measurement Object', with: 'test_object')
      expect(page).to have_field('Value', with: '')
    end
  end
end
