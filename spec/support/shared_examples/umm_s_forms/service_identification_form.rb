shared_examples_for 'Service Identification Form' do
  it 'displays the form with values' do
    expect(page).to have_field('Quality Flag', with: 'Reviewed')
    expect(page).to have_field('Traceability', with: 'traceability')
    expect(page).to have_field('Lineage', with: 'lineage')

    expect(page).to have_field('service_draft_draft_access_constraints', with: 'access constraint 1')

    expect(page).to have_field('service_draft_draft_use_constraints_license_url', with: 'LicenseUrl Text')
    expect(page).to have_field('service_draft_draft_use_constraints_license_text', with: 'LicenseText Text')
  end
end
