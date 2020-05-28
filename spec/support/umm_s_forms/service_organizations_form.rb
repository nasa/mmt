shared_examples_for 'Service Organizations Full Form' do
  it 'displays the form with values' do
    within '.multiple.service-organizations > .multiple-item-0' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)

      service_contact_information_assertions
      service_contact_groups_assertions
      service_contact_persons_assertions
    end
  end
end

shared_examples_for 'Service Organizations Form with Contact Information and confirmation' do
  it 'displays the form with values along with a confirmation message' do
    expect(page).to have_content('Service Draft Updated Successfully!')

    within '.multiple.service-organizations > .multiple-item-0' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)

      service_contact_information_assertions
    end
  end
end

shared_examples_for 'Service Organizations Form with Contact Groups and confirmation' do
  it 'displays the form with values along with a confirmation message' do
    expect(page).to have_content('Service Draft Updated Successfully!')

    within '.multiple.service-organizations > .multiple-item-0' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)

      service_contact_groups_assertions
    end
  end
end

shared_examples_for 'Service Organizations Form with Contact Persons and confirmation' do
  it 'displays the form with values along with a confirmation message' do
    expect(page).to have_content('Service Draft Updated Successfully!')

    within '.multiple.service-organizations > .multiple-item-0' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)

      service_contact_persons_assertions
    end
  end
end
