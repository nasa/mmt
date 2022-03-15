describe 'Variable Drafts Measurement Identifiers Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'measurement_identifiers')
  end

  context 'When viewing the form with no stored values' do
    it 'does not display required icons for accordions in Measurement Identifiers section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Measurement Identifiers')
      expect(page).to have_content('The measurement information of a variable.')
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Measurement Identifiers')
      end
    end

    it 'displays buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Measurement Quantity')
      expect(page).to have_selector(:link_or_button, 'Add another Measurement Identifier')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct prompt value for select elements' do
      within '.umm-form' do
        expect(page).to have_select('Measurement Context Medium', selected: 'Select a Measurement Context Medium')
        expect(page).to have_select('Measurement Object', selected: 'Select Measurement Object', disabled: true)
        expect(page).to have_select('Value', selected: 'Select Value', disabled: true)
      end
    end
  end

  context 'when filling out the form' do
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

    context 'when fully filling out the form' do
      before do
        within '.multiple.measurement-identifiers > .multiple-item-0' do
          select 'ocean', from: 'Measurement Context Medium'
          fill_in 'Measurement Context Medium Uri', with: 'ocean.gov'

          select 'sea_ice', from: 'Measurement Object'
          fill_in 'Measurement Object Uri', with: 'sea-ice.ocean.gov'

          within '.multiple.measurement-quantities' do
            within '.multiple-item-0' do
              select 'albedo', from: 'Value'
              fill_in 'Measurement Quantity Uri', with: 'sea-ice.ocean.gov/albedo'
            end

            click_on 'Add another Measurement Quantity'

            within '.multiple-item-1' do
              select 'bottom_depth', from: 'Value'
            end
          end
        end

        click_on 'Add another Measurement Identifier'

        within '.multiple.measurement-identifiers > .multiple-item-1' do
          select 'ocean', from: 'Measurement Context Medium'
          select 'sea_ice-meltwater', from: 'Measurement Object'
          select 'volume', from: 'Value'
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

          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_context_medium', with: 'ocean')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_context_medium_uri', with: 'ocean.gov')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_object', with: 'sea_ice')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_object_uri', with: 'sea-ice.ocean.gov')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_value', with: 'albedo')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri', with: 'sea-ice.ocean.gov/albedo')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_value', with: 'bottom_depth')

          expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_context_medium', with: 'ocean')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_object', with: 'sea_ice-meltwater')
          expect(page).to have_field('variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_value', with: 'volume')
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
