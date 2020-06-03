describe 'Valid Service Draft Operation Metadata Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Operation Metadata section' do
    it 'displays the form title as an edit link' do
      within '#operation_metadata-progress' do
        expect(page).to have_link('Operation Metadata', href: edit_service_draft_path(service_draft, 'operation_metadata'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#operation_metadata-progress' do
      within '.status' do
        expect(page).to have_content('Operation Metadata is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#operation_metadata-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.operation-metadata')
    end
  end
end
