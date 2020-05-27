describe 'Descriptive Keywords Form Navigation', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'descriptive_keywords')
    end

    it 'displays the correct title' do
      within '.umm-form' do
        expect(page).to have_content('Service Keywords')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Descriptive Keywords')
      end
    end

    it 'has 1 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 1)
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Organizations')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Organizations')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
        end
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Identification')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Quality')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Service Organizations', from: 'Save & Jump To:'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Organizations')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Organizations')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) {
      create(:full_service_draft, user: User.where(urs_uid: 'testuser').first)
    }

    before do
      visit edit_service_draft_path(draft, 'descriptive_keywords')
    end

    context 'when viewing the form' do
      include_examples 'Descriptive Keywords Form'
    end
  end
end
