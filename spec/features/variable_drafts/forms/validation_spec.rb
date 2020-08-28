describe 'Variable Draft Forms Field Validation', js: true do
  let(:draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
  end

  context 'required fields' do
    before do
      visit edit_variable_draft_path(draft)
    end

    context 'when trying to submit a form with required fields' do
      context 'when the fields are empty' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'displays a modal with a prompt about saving invalid data' do
          expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
        end

        context 'when choosing not to proceed' do
          before do
            within '#invalid-draft-modal' do
              click_on 'No'
            end
          end

          it 'displays the correct error messages at the top of the page' do
            within '.summary-errors' do
              expect(page).to have_content('Name is required')
              expect(page).to have_content('Definition is required')
              expect(page).to have_content('Long Name is required')
            end
          end

          it 'displays the correct error messages under the form elements' do
            within '#variable_draft_draft_name_error' do
              expect(page).to have_content('Name is required')
            end
            within '#variable_draft_draft_definition_error' do
              expect(page).to have_content('Definition is required')
            end
            within '#variable_draft_draft_long_name_error' do
              expect(page).to have_content('Long Name is required')
            end
          end
        end
      end

      context 'when the fields are filled' do
        before do
          fill_in 'Name', with: 'Test Var Short Name'
          fill_in 'Definition', with: 'Definition of test variable'
          fill_in 'Long Name', with: 'Test Var Long Long Name'
          select 'SCIENCE_VARIABLE', from: 'Variable Type'
          select 'byte', from: 'Data Type'
          fill_in 'Scale', with: '2'
          fill_in 'Offset', with: '5'

          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'saves the form without a modal prompt' do
          expect(page).to have_no_content('This page has invalid data. Are you sure you want to save it and proceed?')
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        it 'populates the form with the data' do
          expect(page).to have_field('Name', with: 'Test Var Short Name')
          expect(page).to have_field('Definition', with: 'Definition of test variable')
          expect(page).to have_field('Long Name', with: 'Test Var Long Long Name')
          expect(page).to have_field('Scale', with: '2.0')
          expect(page).to have_field('Offset', with: '5.0')
          expect(page).to have_field('Variable Type', with: 'SCIENCE_VARIABLE')
          expect(page).to have_field('Data Type', with: 'byte')
        end
      end
    end

    context 'when visiting required fields' do
      context 'when no data is entered into the field' do
        before do
          find('#variable_draft_draft_name').click
          find('#variable_draft_draft_long_name').click
          find('#variable_draft_draft_units').click
        end

        it 'displays validation error messages' do
          expect(page).to have_css('.eui-banner--danger', count: 3)

          within '.summary-errors' do
            expect(page).to have_content('This draft has the following errors:')
            expect(page).to have_content('Name is required')
            expect(page).to have_content('Long Name is required')
          end

          expect(page).to have_css('#variable_draft_draft_name_error', text: 'Name is required')
          expect(page).to have_css('#variable_draft_draft_long_name_error', text: 'Long Name is required')

        end
      end

      context 'when data is entered into the field' do
        before do
          fill_in 'Name', with: 'Test Var Short Name'
          fill_in 'Long Name', with: 'Test Var Long Long Name'
          find('body').click
        end

        it 'does not display validation error messages' do
          expect(page).to have_no_css('.eui-banner--danger')
        end
      end
    end

    context 'when only filling out some of the required subfields of a required field' do
      before do
        visit edit_variable_draft_path(draft, 'sets')

        fill_in 'Name', with: 'Set name'

        within '.nav-top' do
          click_on 'Done'
        end
        click_on 'No'
      end

      it 'displays validation errors' do
        expect(page).to have_content('Type is required')
        expect(page).to have_content('Size is required')
        expect(page).to have_content('Index is required')
      end

      context 'when viewing the show page' do
        before do
          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Yes'
        end

        it 'displays an invalid progress circle' do
          expect(page).to have_css('i.icon-red.sets')
        end
      end
    end

    context 'when only filling out some of the required subfields of a required field' do
      before do
        visit edit_variable_draft_path(draft, 'dimensions')

        fill_in 'Name', with: 'dim name'

        within '.nav-top' do
          click_on 'Done'
        end
        click_on 'No'
      end

      it 'displays validation errors' do
        expect(page).to have_content('Size is required')
        expect(page).to have_content('Type is required')
      end

      context 'when viewing the show page' do
        before do
          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Yes'
        end

        it 'displays an invalid progress circle' do
          expect(page).to have_css('i.icon-red.dimensions')
        end
      end
    end
  end

  context 'number fields' do
    before do
      visit edit_variable_draft_path(draft)
    end

    context 'when entering text into a number field' do
      before do
        fill_in 'Min', with: 'abcd'
        fill_in 'Max', with: 'abcd'
        fill_in 'Scale', with: 'abcd'
        fill_in 'Offset', with: 'abcd'
        find('body').click
      end

      it 'displays validation error messages' do
        expect(page).to have_css('.eui-banner--danger', count: 5)

        within '.summary-errors' do
          expect(page).to have_content('Min must be of type number')
          expect(page).to have_content('Max must be of type number')
          expect(page).to have_content('Scale must be of type number')
          expect(page).to have_content('Offset must be of type number')
        end

        expect(page).to have_css('#variable_draft_draft_valid_ranges_0_min_error', text: 'Min must be of type number')
        expect(page).to have_css('#variable_draft_draft_valid_ranges_0_max_error', text: 'Max must be of type number')
        expect(page).to have_css('#variable_draft_draft_scale_error', text: 'Scale must be of type number')
        expect(page).to have_css('#variable_draft_draft_offset_error', text: 'Offset must be of type number')
      end

      context 'when saving the form' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'displays a modal with a prompt about saving invalid data' do
          expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
        end

        context 'when returning to the form with invalid data' do
          before do
            click_on 'Yes'
          end

          it 'displays validation error messages for fields with data' do
            expect(page).to have_css('#variable_draft_draft_valid_ranges_0_min_error', text: 'Min must be of type number')
            expect(page).to have_css('#variable_draft_draft_valid_ranges_0_max_error', text: 'Max must be of type number')
            expect(page).to have_css('#variable_draft_draft_scale_error', text: 'Scale must be of type number')
            expect(page).to have_css('#variable_draft_draft_offset_error', text: 'Offset must be of type number')
          end
        end
      end
    end
  end

  context 'number fields with names that break text transformation conventions' do
    before do
      visit edit_variable_draft_path(draft, 'size_estimation')
    end

    context 'when entering text into a number field' do
      before do
        fill_in 'variable_draft_draft_size_estimation_average_size_of_granules_sampled', with: 'abcd'
        fill_in 'variable_draft_draft_size_estimation_average_compression_information_0_rate', with: 'abcd'
        find('body').click
      end

      it 'displays validation error messages' do
        expect(page).to have_css('.eui-banner--danger', count: 3)

        within '.summary-errors' do
          expect(page).to have_content('Average Size Of Granules Sampled must be of type number')
          expect(page).to have_content('Rate must be of type number')
        end

        expect(page).to have_css('#variable_draft_draft_size_estimation_average_size_of_granules_sampled_error', text: 'Average Size Of Granules Sampled must be of type number')
        expect(page).to have_css('#variable_draft_draft_size_estimation_average_compression_information_0_rate_error', text: 'Rate must be of type number')
      end

      context 'when saving the form' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'displays a modal with a prompt about saving invalid data' do
          expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
        end

        context 'when returning to the form with invalid data' do
          before do
            click_on 'Yes'
          end

          it 'displays validation error messages for fields with data' do
            expect(page).to have_css('#variable_draft_draft_size_estimation_average_size_of_granules_sampled_error', text: 'Average Size Of Granules Sampled must be of type number')
            expect(page).to have_css('#variable_draft_draft_size_estimation_average_compression_information_0_rate_error', text: 'Rate must be of type number')
          end
        end
      end
    end
  end

  context 'multiple fieldsets' do
    before do
      visit edit_variable_draft_path(draft, 'dimensions')
    end

    context 'when adding a new set of multiple fields' do
      before do
        fill_in 'Name', with: 'Dimension Name'
        fill_in 'Size', with: 42

        click_on 'Add another Dimension'
      end

      it 'does not show validation errors for the new fields' do
        expect(page).to have_no_css('.summary-errors')
        expect(page).to have_no_content('Name is required')
      end
    end
  end

  context 'entering multiple simple fields' do
    before do
      visit edit_variable_draft_path(draft, 'variable_characteristics')
    end

    context 'when entering invalid data' do
      before do
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_0', with: 'string'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_1', with: 'string'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_0', with: 'string'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_1', with: 'string'
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays validation error messages' do
        expect(page).to have_css('#variable_draft_draft_characteristics_index_ranges_lat_range_0_error', text: 'Lat Range must be of type number')
        expect(page).to have_css('#variable_draft_draft_characteristics_index_ranges_lat_range_1_error', text: 'Lat Range must be of type number')
        expect(page).to have_css('#variable_draft_draft_characteristics_index_ranges_lon_range_0_error', text: 'Lon Range must be of type number')
        expect(page).to have_css('#variable_draft_draft_characteristics_index_ranges_lon_range_1_error', text: 'Lon Range must be of type number')
      end
    end

    context 'when entering valid data' do
      before do
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_0', with: '1'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_1', with: '2'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_0', with: '1'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_1', with: '2'
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'does not display validation error messages' do
        expect(page).to have_no_css('#variable_draft_draft_characteristics_index_ranges_lat_range_0_error', text: 'Lat Range must be of type number')
        expect(page).to have_no_css('#variable_draft_draft_characteristics_index_ranges_lat_range_1_error', text: 'Lat Range must be of type number')
        expect(page).to have_no_css('#variable_draft_draft_characteristics_index_ranges_lon_range_0_error', text: 'Lon Range must be of type number')
        expect(page).to have_no_css('#variable_draft_draft_characteristics_index_ranges_lon_range_1_error', text: 'Lon Range must be of type number')
      end
    end
  end

  context 'multiple simple fields' do
    before do
      visit edit_variable_draft_path(draft, 'variable_characteristics')
    end

    context 'when entering one field' do
      before do
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_0', with: '1'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_0', with: '1'
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays validation error messages' do
        expect(page).to have_css('#variable_draft_draft_characteristics_index_ranges_lat_range_error', text: 'Lat Range has too few items')
        expect(page).to have_css('#variable_draft_draft_characteristics_index_ranges_lon_range_error', text: 'Lon Range has too few items')
      end
    end

    context 'when entering two fields' do
      before do
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_0', with: '1'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_0', with: '1'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lat_range_1', with: '2'
        fill_in 'variable_draft_draft_characteristics_index_ranges_lon_range_1', with: '2'
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'does not display validation error messages' do
        expect(page).to have_no_css('#variable_draft_draft_characteristics_index_ranges_lat_range_error', text: 'Lat Range has too few items')
        expect(page).to have_no_css('#variable_draft_draft_characteristics_index_ranges_lon_range_error', text: 'Lon Range has too few items')
      end
    end

  end

end
