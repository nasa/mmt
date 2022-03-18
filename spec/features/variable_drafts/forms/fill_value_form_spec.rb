describe 'Variable Drafts Fill Values Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'fill_values')
  end

  context 'When viewing the form with no stored values' do
    before do
    end

    it 'does not display required icons for accordions in Fill Values section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Fill Values')
        expect(page).to have_content('The fill value of the variable in the data file. It is generally a value which falls outside the valid range. For example, if the valid range is \'0, 360\', the fill value may be \'-1\'.')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Fill Values')
      end
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Fill Value')
    end

    it 'have 0 required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct prompt value for select elements' do
      within '.umm-form' do
        expect(page).to have_select('Type', selected: 'Select a Type')
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '.multiple > .multiple-item-0' do
        fill_in 'Value', with: '-9999.0'
        select 'SCIENCE_FILLVALUE', from: 'Type'
        fill_in 'Description', with: 'Pellentesque Bibendum Commodo Fringilla Nullam'
      end

      click_on 'Add another Fill Value'

      within '.multiple > .multiple-item-1' do
        fill_in 'Value', with: '111.0'
        select 'ANCILLARY_FILLVALUE', from: 'Type'
        fill_in 'Description', with: 'Pellentesque Nullam Ullamcorper Magna'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 4)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        expect(page).to have_select('variable_draft_draft_fill_values_0_type', selected: 'SCIENCE_FILLVALUE')
        expect(page).to have_field('variable_draft_draft_fill_values_0_value', with: '-9999.0')
        expect(page).to have_field('variable_draft_draft_fill_values_0_description', with: 'Pellentesque Bibendum Commodo Fringilla Nullam')

        expect(page).to have_select('variable_draft_draft_fill_values_1_type', selected: 'ANCILLARY_FILLVALUE')
        expect(page).to have_field('variable_draft_draft_fill_values_1_value', with: '111.0')
        expect(page).to have_field('variable_draft_draft_fill_values_1_description', with: 'Pellentesque Nullam Ullamcorper Magna')
      end
    end
  end
end
