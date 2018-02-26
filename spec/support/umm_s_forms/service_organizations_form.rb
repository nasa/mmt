require 'rails_helper'

shared_examples_for 'Service Organizations Form' do
  it 'displays the form with values' do
    within '.multiple.service-organizations > .multiple-item-0' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
      expect(page).to have_field('Uuid', with: '7b1ac64e-8bdd-45db-831b-994b13f60100')

      contact_information_assertions
      contact_groups_assertions
      contact_persons_assertions
    end
  end
end
