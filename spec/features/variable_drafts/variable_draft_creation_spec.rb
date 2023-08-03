describe 'Variable Draft creation' do
  before do
    login
  end

  context 'when creating a new variable draft from scratch' do
    before do
      visit new_variable_draft_path
    end

    it 'creates a new blank variable draft' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('New')
      end
    end

    it 'renders the "Variable Information" form' do
      within '.umm-form fieldset h3' do
        expect(page).to have_content('Variable Information')
      end
    end

    context 'when saving data into the variable draft', js: true do
      before do
        fill_in 'Name', with: 'test var draft'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Variable Draft Created Successfully!')
      end

      context 'when accessing a variable draft\'s json' do
        before do
          visit variable_draft_path(VariableDraft.first, format: 'json')
        end

        it 'displays json' do
          expect(page).to have_content("{\n  \"Name\": \"test var draft\",\n  \"MetadataSpecification\": {\n    \"URL\": \"https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0\",\n    \"Name\": \"UMM-Var\",\n    \"Version\": \"1.9.0\"\n  }\n}")
        end
      end
    end
  end
end
