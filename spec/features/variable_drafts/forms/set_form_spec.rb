describe 'Set Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'sets')
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
          expect(page).to have_content('Science Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
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

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Variable Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
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
          expect(page).to have_content('Set')
        end

        within '.umm-form' do
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end
      end
    end

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Science Keywords', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Science Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end
  end

  context 'When viewing the form with 1 stored value' do
    before do
      draft_sets = [{
        'Name': 'Science',
        'Type': 'Air',
        'Size': 25,
        'Index': 1
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'Sets': draft_sets })
      visit edit_variable_draft_path(draft, 'sets')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 1)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_sets_0_name', with: 'Science')
      expect(page).to have_field('variable_draft_draft_sets_0_type', with: 'Air')
      expect(page).to have_field('variable_draft_draft_sets_0_size', with: '25')
      expect(page).to have_field('variable_draft_draft_sets_0_index', with: '1')
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
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
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
          expect(page).to have_content('Variable Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
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
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end
      end
    end
  end

  context 'When viewing the form with 2 stored values' do
    let(:draft) {
      create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    }

    before do
      visit edit_variable_draft_path(draft, 'sets')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('variable_draft_draft_sets_0_name', with: 'Science')
      expect(page).to have_field('variable_draft_draft_sets_0_type', with: 'Land')
      expect(page).to have_field('variable_draft_draft_sets_0_size', with: '50')
      expect(page).to have_field('variable_draft_draft_sets_0_index', with: '1')

      expect(page).to have_field('variable_draft_draft_sets_1_name', with: 'Fiction')
      expect(page).to have_field('variable_draft_draft_sets_1_type', with: 'Water')
      expect(page).to have_field('variable_draft_draft_sets_1_size', with: '100')
      expect(page).to have_field('variable_draft_draft_sets_1_index', with: '2')
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
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
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
          expect(page).to have_content('Variable Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_information')
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
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('sets')
        end
      end

      it 'displays the correct values in the form' do
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
