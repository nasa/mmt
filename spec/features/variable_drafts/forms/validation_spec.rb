require 'rails_helper'

describe 'Variable Drafts Forms Field Validations', js: true do
  before do
    login

    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
  end

  context 'required fields' do
    before do
      visit edit_variable_draft_path(@draft)
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
            within '#umm-form-errors' do
              expect(page).to have_content('Name is required')
              expect(page).to have_content('Definition is required')
              expect(page).to have_content('Long Name is required')
              expect(page).to have_content('Data Type is required')
              expect(page).to have_content('Scale is required')
              expect(page).to have_content('Offset is required')
            end
          end

          it 'displays the correct error messages under the form elements' do
            within '#variable_draft_draft_name-error' do
              expect(page).to have_content('Name is required')
            end
            within '#variable_draft_draft_definition-error' do
              expect(page).to have_content('Definition is required')
            end
            within '#variable_draft_draft_long_name-error' do
              expect(page).to have_content('Long Name is required')
            end
            within '#variable_draft_draft_data_type-error' do
              expect(page).to have_content('Data Type is required')
            end
            within '#variable_draft_draft_scale-error' do
              expect(page).to have_content('Scale is required')
            end
            within '#variable_draft_draft_offset-error' do
              expect(page).to have_content('Offset is required')
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

          expect(page).to have_css('#umm-form-errors')
          within '#umm-form-errors' do
            expect(page).to have_content('This draft has the following errors:')
            expect(page).to have_content('Name is required')
            expect(page).to have_content('Long Name is required')
          end

          expect(page).to have_css('#variable_draft_draft_name-error', text: 'Name is required')
          expect(page).to have_css('#variable_draft_draft_long_name-error', text: 'Long Name is required')
        end
      end

      context 'when data is entered into the field' do
        before do
          fill_in 'Name', with: 'Test Var Short Name'
          fill_in 'Long Name', with: 'Test Var Long Long Name'
          find('#variable_draft_draft_units').click
        end

        it 'does not display validation error messages' do
          expect(page).to have_no_css('.eui-banner--danger')
        end
      end
    end

    context 'when only filling out some of the required subfields of a required field' do
      before do
        visit edit_variable_draft_path(@draft, 'sets')

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
          expect(page).to have_css('i.icon-red.variable_draft_draft_sets')
        end
      end
    end
  end

  context 'number fields' do
    before do
      visit edit_variable_draft_path(@draft)
    end

    context 'when entering text into a number field' do
      before do
        fill_in 'Min', with: 'abcd'
        fill_in 'Max', with: 'abcd'
        fill_in 'Scale', with: 'abcd'
        fill_in 'Offset', with: 'abcd'

        find('#variable_draft_draft_units').click
      end

      it 'displays validation error messages' do
        expect(page).to have_css('.eui-banner--danger', count: 5)

        expect(page).to have_css('#umm-form-errors')
        within '#umm-form-errors' do
          expect(page).to have_content('Min must be a number')
          expect(page).to have_content('Max must be a number')
          expect(page).to have_content('Scale must be a number')
          expect(page).to have_content('Offset must be a number')
        end

        expect(page).to have_css('#variable_draft_draft_valid_ranges_0_min-error', text: 'Min must be a number')
        expect(page).to have_css('#variable_draft_draft_valid_ranges_0_max-error', text: 'Max must be a number')
        expect(page).to have_css('#variable_draft_draft_scale-error', text: 'Scale must be a number')
        expect(page).to have_css('#variable_draft_draft_offset-error', text: 'Offset must be a number')
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
            expect(page).to have_css('#variable_draft_draft_valid_ranges_0_min-error', text: 'Min must be a number')
            expect(page).to have_css('#variable_draft_draft_valid_ranges_0_max-error', text: 'Max must be a number')
            expect(page).to have_css('#variable_draft_draft_scale-error', text: 'Scale must be a number')
            expect(page).to have_css('#variable_draft_draft_offset-error', text: 'Offset must be a number')
          end
        end
      end
    end
  end

  context 'multiple fields' do
    before do
      visit edit_variable_draft_path(@draft, 'dimensions')
    end

    context 'when adding a new set of multiple fields' do
      before do
        fill_in 'Name', with: 'Dimension Name'
        fill_in 'Size', with: 42

        click_on 'Add another Dimension'
      end

      it 'does not show validation errors for the new fields' do
        expect(page).to have_no_css('#umm-form-errors')
        expect(page).to have_no_content('Name is required')
      end
    end
  end
end
