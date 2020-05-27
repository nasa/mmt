describe 'Service Contacts Form Navigation', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'service_contacts')
      click_on 'Expand All'
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Contact Groups')
        expect(page).to have_content('Contact Persons')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Contacts')
      end
    end

    it 'has 0 required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_contacts')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_contacts')
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
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

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Options')
        end

        within '.umm-form' do
          expect(page).to have_content('Options')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('options')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('options')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Options', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Options')
        end

        within '.umm-form' do
          expect(page).to have_content('Options')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('options')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('options')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

    before do
      visit edit_service_draft_path(draft, 'service_contacts')
      click_on 'Expand All'
    end

    context 'when viewing the form' do
      include_examples 'Service Contacts Form'
    end
  end
end
