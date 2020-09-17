describe 'Dimensions Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'dimensions')
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

    it 'has 0 required labels' do
      expect(page).to have_selector('label.eui-required-o', count: 0)
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

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Fill Values')
        end

        within '.umm-form' do
          expect(page).to have_content('Fill Values')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_on 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
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

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and reloads the form' do
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

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Fill Values', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Fill Values')
        end

        within '.umm-form' do
          expect(page).to have_content('Fill Values')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Measurement Identifiers', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
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
  end

  context 'When viewing the form with 2 stored values' do
    let(:draft) {
      create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    }

    before do
      visit edit_variable_draft_path(draft, 'dimensions')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 2)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_dimensions_0_name', with: 'LatDim')
      expect(page).to have_field('variable_draft_draft_dimensions_0_size', with: '36')
      expect(page).to have_field('variable_draft_draft_dimensions_0_type', with: 'LATITUDE_DIMENSION')

      expect(page).to have_field('variable_draft_draft_dimensions_1_name', with: 'Lizard Herp Doc Pop')
      expect(page).to have_field('variable_draft_draft_dimensions_1_size', with: '2020')
      expect(page).to have_field('variable_draft_draft_dimensions_1_type', with: 'LONGITUDE_DIMENSION')
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

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Fill Values')
        end

        within '.umm-form' do
          expect(page).to have_content('Fill Values')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('fill_values')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_on 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
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

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft without making any changes' do
        expect(draft.draft).to eq(Draft.last.draft)
      end

      it 'saves the draft and reloads the form' do
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

      it 'displays the correct values in the form' do
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
