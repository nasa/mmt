describe 'Characteristics Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'variable_characteristics')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Variable Characteristics')
      expect(page).to have_content('The elements of this section apply to a variable.')
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
          expect(page).to have_content('Size Estimation')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('size_estimation')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('size_estimation')
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
          expect(page).to have_content('Variable Characteristics')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
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
          select 'Size Estimation', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Size Estimation')
        end

        within '.umm-form' do
          expect(page).to have_content('Size Estimation')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('size_estimation')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('size_estimation')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) {
      create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    }

    before do
      visit edit_variable_draft_path(draft, 'variable_characteristics')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lat_range_0', with: '-90.0')
      expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lat_range_1', with: '90.0')
      expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lon_range_0', with: '-180.0')
      expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lon_range_1', with: '180.0')
      expect(page).to have_field('variable_draft_draft_characteristics_group_path', with: '/Data_Fields/')
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
          expect(page).to have_content('Size Estimation')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('size_estimation')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('size_estimation')
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
          expect(page).to have_content('Variable Characteristics')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lat_range_0', with: '-90.0')
        expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lat_range_1', with: '90.0')
        expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lon_range_0', with: '-180.0')
        expect(page).to have_field('variable_draft_draft_characteristics_index_ranges_lon_range_1', with: '180.0')
        expect(page).to have_field('variable_draft_draft_characteristics_group_path', with: '/Data_Fields/')
      end
    end
  end
end
