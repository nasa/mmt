require 'rails_helper'

describe 'Service Options Form Navigation', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'options')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Options')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Options')
      end
    end

    it 'has 0 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 0)
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('options')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('options')
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
          expect(page).to have_content('Service Contacts')
        end

        within '.umm-form' do
          # TODO uncomment once the service_contacts form exists!
          # expect(page).to have_content('Service Contacts')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_contacts')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_contacts')
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
          expect(page).to have_content('Coverage')
        end

        within '.umm-form' do
          expect(page).to have_content('Coverage')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('coverage')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('coverage')
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
          select 'Coverage', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Coverage')
        end

        within '.umm-form' do
          expect(page).to have_content('Coverage')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('coverage')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('coverage')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    before do
      draft_service_options = {
        'ServiceOptions': {
          'SubsetTypes': ['Spatial'],
          'SupportedProjections': ['Geographic'],
          'InterpolationTypes': ['Bilinear Interpolation', 'Bicubic Interpolation'],
          'SupportedFormats': ['HDF-EOS4', 'HDF-EOS5']
        }
      }
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first, draft: draft_service_options)
      visit edit_service_draft_path(draft, 'options')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_select('service_draft_draft_service_options_subset_types', selected: ['Spatial'])
      expect(page).to have_select('service_draft_draft_service_options_supported_projections', selected: ['Geographic'])
      expect(page).to have_select('service_draft_draft_service_options_interpolation_types', selected: ['Bilinear Interpolation', 'Bicubic Interpolation'])
      expect(page).to have_select('service_draft_draft_service_options_supported_formats', selected: ['HDF-EOS4', 'HDF-EOS5'])
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
          expect(page).to have_content('Service Contacts')
        end

        within '.umm-form' do
          # TODO uncomment once the service_contacts form exists!
          # expect(page).to have_content('Service Contacts')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_contacts')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_contacts')
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
          expect(page).to have_content('Coverage')
        end

        within '.umm-form' do
          expect(page).to have_content('Coverage')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('coverage')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('coverage')
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

      it 'displays the correct values in the form' do
        expect(page).to have_select('service_draft_draft_service_options_subset_types', selected: ['Spatial'])
        expect(page).to have_select('service_draft_draft_service_options_supported_projections', selected: ['Geographic'])
        expect(page).to have_select('service_draft_draft_service_options_interpolation_types', selected: ['Bilinear Interpolation', 'Bicubic Interpolation'])
        expect(page).to have_select('service_draft_draft_service_options_supported_formats', selected: ['HDF-EOS4', 'HDF-EOS5'])
      end
    end
  end
end
