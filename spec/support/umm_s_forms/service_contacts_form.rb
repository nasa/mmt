shared_examples_for 'Service Contacts Form' do
  it 'displays the form with values' do
    service_contact_groups_assertions
    service_contact_persons_assertions
  end
end

shared_examples_for 'Service Contacts Form with confirmation' do
  it 'displays the form with values along with a confirmation message' do
    expect(page).to have_content('Service Draft Updated Successfully!')

    service_contact_groups_assertions
    service_contact_persons_assertions
  end
end
