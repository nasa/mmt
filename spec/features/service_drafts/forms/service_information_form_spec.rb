describe 'Service Information Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '#service-information' do
        fill_in 'Name', with: 'Service Name'
        fill_in 'Long Name', with: 'Long Service Name'
        select 'NOT PROVIDED', from: 'Type'
        fill_in 'Version', with: '1.0'
        fill_in 'Version Description', with: 'Description of the Current Version'
        fill_in 'Last Updated Date', with: '2020-05-20T00:00:00.000Z'
        fill_in 'service_draft_draft_description', with: 'Description of the test service'
      end

      within '#url' do
        fill_in 'Description', with: 'Description of primary url'
        fill_in 'URL Value', with: 'httpx://testurl.earthdata.nasa.gov'
      end

      within '.nav-top' do
        click_on 'Save'
      end
    end
    
    it 'displays required icons on the Service Information and URL accordions' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 2)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Service Information')
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'URL')
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Service Information Form'
    end
  end
end
