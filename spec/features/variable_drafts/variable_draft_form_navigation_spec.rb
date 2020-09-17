describe 'Variable Draft form navigation' do
  let(:form_titles) { ['Variable Information', 'Fill Values', 'Dimensions', 'Measurement Identifiers', 'Sampling Identifiers', 'Science Keywords', 'Sets'] }

  context 'when visiting the edit page for a new variable draft' do
    before do
      login

      visit new_variable_draft_path
    end

    it 'renders the Variable Information form' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('New')
      end

      within '.umm-form fieldset h3' do
        expect(page).to have_content('Variable Information')
      end
    end

    it 'displays the forms in the navigation bar(s) dropdown' do
      within '.nav-top' do
        expect(page).to have_select('Save & Jump To:', options: form_titles)
      end
      within '.nav-bottom' do
        expect(page).to have_select('Save & Jump To:', options: form_titles)
      end
    end

    it 'displays the buttons in navigation bar(s)' do
      within '.nav-top' do
        expect(page).to have_button('Previous')
        expect(page).to have_button('Next')
        expect(page).to have_button('Save')
        expect(page).to have_button('Done')
      end
      within '.nav-bottom' do
        expect(page).to have_button('Previous')
        expect(page).to have_button('Next')
        expect(page).to have_button('Save')
        expect(page).to have_button('Done')
      end
    end
  end
end
