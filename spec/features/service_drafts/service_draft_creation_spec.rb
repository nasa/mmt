describe 'Service Draft creation' do
  before do
    login
  end

  context 'when creating a brand new service draft' do
    before do
      visit new_service_draft_path
    end

    it 'creates a new blank service draft' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('New')
      end
    end

    it 'renders the "Service Information" form' do
      within first('.umm-form fieldset h3') do
        expect(page).to have_content('Service Information')
      end
    end

    context 'when saving data into the service draft', js: true do
      before do
        fill_in 'service_draft_draft_name', with: 'test service draft'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Created Successfully!')
      end

      context "when accessing a service draft's json" do
        before do
          visit service_draft_path(ServiceDraft.first, format: 'json')
        end

        it 'displays json' do
          expect(page).to have_content("{\n  \"Name\": \"test service draft\",\n  \"MetadataSpecification\": {\n    \"URL\": \"https://cdn.earthdata.nasa.gov/umm/service/v1.4\",\n    \"Name\": \"UMM-S\",\n    \"Version\": \"1.4\"\n  }\n}")
        end
      end
    end
  end
end
