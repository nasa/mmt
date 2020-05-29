describe 'Service Operation Metadata Form Navigation', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'operation_metadata')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_operation_metadata_0_operation_name', selected: 'Select a Operation Name')
        expect(page).to have_select('service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_spatial_type', selected: 'Select a Data Resource Spatial Type')
        expect(page).to have_select('service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_temporal_type', selected: 'Select a Data Resource Temporal Type')
        expect(page).to have_select('service_draft_draft_operation_metadata_0_coupled_resource_data_resource_temporal_resolution_unit', selected: 'Select a Temporal Resolution Unit')
        expect(page).to have_select('service_draft_draft_operation_metadata_0_coupled_resource_coupling_type', selected: 'Select a Coupling Type')
      end
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Operation Metadata')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Operation Metadata')
      end
    end

    it 'has 0 required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('operation_metadata')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('operation_metadata')
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
          expect(page).to have_content('Service Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_information')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Service Information', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Information')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_information')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    let(:draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

    before do
      visit edit_service_draft_path(draft, 'operation_metadata')
    end

    context 'when viewing the form' do
      include_examples 'Operation Metadata Form with General Grid'
    end
  end
end
