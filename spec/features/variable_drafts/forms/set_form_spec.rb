describe 'Variable Drafts Set Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'sets')
  end

  context 'When viewing the form with no stored values' do
    it 'does not display required icons for accordions in Sets section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Sets')
        expect(page).to have_content('The set information of a variable.')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Sets')
      end
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Set')
    end

    it 'has no required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end
  end

  context 'when filling out the form' do
    before do
      within '.multiple > .multiple-item-0' do
        fill_in 'Name', with: 'Science'
        fill_in 'Type', with: 'Land'
        fill_in 'Size', with: 50
        fill_in 'Index', with: 1
      end

      click_on 'Add another Set'

      within '.multiple > .multiple-item-1' do
        fill_in 'Name', with: 'Fiction'
        fill_in 'Type', with: 'Water'
        fill_in 'Size', with: 100
        fill_in 'Index', with: 2
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 8)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        expect(page).to have_field('variable_draft_draft_sets_0_name', with: 'Science')
        expect(page).to have_field('variable_draft_draft_sets_0_type', with: 'Land')
        expect(page).to have_field('variable_draft_draft_sets_0_size', with: '50.0')
        expect(page).to have_field('variable_draft_draft_sets_0_index', with: '1.0')

        expect(page).to have_field('variable_draft_draft_sets_1_name', with: 'Fiction')
        expect(page).to have_field('variable_draft_draft_sets_1_type', with: 'Water')
        expect(page).to have_field('variable_draft_draft_sets_1_size', with: '100.0')
        expect(page).to have_field('variable_draft_draft_sets_1_index', with: '2.0')
      end
    end
  end
end
