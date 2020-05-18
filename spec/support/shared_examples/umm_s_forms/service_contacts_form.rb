shared_examples_for 'Service Contacts Form' do
  it 'displays the form with values' do
    contact_groups_assertions
    contact_persons_assertions
  end
end

shared_examples_for 'Service Contacts Form with confirmation' do
  it 'displays the form with values along with a confirmation message' do
    expect(page).to have_content('Service Draft Updated Successfully!')

    contact_groups_assertions
    contact_persons_assertions
  end
end
