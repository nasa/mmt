shared_examples_for 'Service Information Form' do
  it 'displays the form with values' do
    within '#service-information' do
      expect(page).to have_field('Name', with: 'Service Name')
      expect(page).to have_field('Long Name', with: 'Long Service Name')
      expect(page).to have_field('Type', with: 'NOT PROVIDED')
      expect(page).to have_field('Version', with: '1.0')
      expect(page).to have_field('Version Description', with: 'Description of the Current Version')
      expect(page).to have_field('Last Updated Date', with: '2020-05-20T00:00:00.000Z')
      expect(page).to have_field('Description', with: 'Description of the test service')
    end

    within '#url' do
      expect(page).to have_field('Description', with: 'Description of primary url')
      expect(page).to have_field('Url Content Type', with: 'DistributionURL')
      expect(page).to have_field('service_draft_draft_url_type', with: 'GET SERVICE')
      expect(page).to have_field('Subtype', with: 'SUBSETTER')
      expect(page).to have_field('Url Value', with: 'httpx://testurl.earthdata.nasa.gov')
    end
  end
end
