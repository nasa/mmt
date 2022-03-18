describe 'Variable Drafts Dimensions Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'dimensions')
  end

  context 'When viewing the form with no stored values' do

    it 'does not display required icons for accordions in Dimensions section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title' do
      within '.umm-form' do
        expect(page).to have_content('Dimensions')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Dimensions')
      end
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Dimension')
    end

    it 'displays the correct number of required fields' do
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
        fill_in 'Name', with: 'LatDim'
        fill_in 'Size', with: '36'
        select 'LATITUDE_DIMENSION', from: 'Type'
      end

      click_on 'Add another Dimension'

      within '.multiple > .multiple-item-1' do
        fill_in 'Name', with: 'Lizard Herp Doc Pop'
        fill_in 'Size', with: '2020'
        select 'LONGITUDE_DIMENSION', from: 'Type'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        expect(page).to have_field('variable_draft_draft_dimensions_0_name', with: 'LatDim')
        expect(page).to have_field('variable_draft_draft_dimensions_0_size', with: '36.0')
        expect(page).to have_field('variable_draft_draft_dimensions_0_type', with: 'LATITUDE_DIMENSION')

        expect(page).to have_field('variable_draft_draft_dimensions_1_name', with: 'Lizard Herp Doc Pop')
        expect(page).to have_field('variable_draft_draft_dimensions_1_size', with: '2020.0')
        expect(page).to have_field('variable_draft_draft_dimensions_1_type', with: 'LONGITUDE_DIMENSION')
      end
    end
  end
end
