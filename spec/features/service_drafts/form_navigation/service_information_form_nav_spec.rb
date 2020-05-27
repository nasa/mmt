require 'rails_helper'

describe 'Service Information Form Navigation', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft)
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_type', selected: 'Select a Type')
      end
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Service Information')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Information')
      end
    end

    it 'has 5 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 5)
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_information')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_information')
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Operation Metadata')
        end

        within '.umm-form' do
          expect(page).to have_content('Operation Metadata')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('operation_metadata')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('operation_metadata')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
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
          expect(page).to have_content('Access Constraints')
          expect(page).to have_content('Use Constraints')
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
          select 'Service Identification', from: 'Save & Jump To:'
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
          expect(page).to have_content('Access Constraints')
          expect(page).to have_content('Use Constraints')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: 'Service Name', draft_entry_title: 'Long Service Name') }

    before do
      visit edit_service_draft_path(draft, 'service_information')
    end

    context 'when viewing the form' do
      include_examples 'Service Information Form'
    end
  end
end
