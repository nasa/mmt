shared_examples_for 'Service Organizations Full Form' do
  it 'displays the form with values' do
    within '.multiple.service-organizations > .multiple-item-0' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
    end
    within '.multiple.service-organizations > .multiple-item-1' do
      expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
      expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
      expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
      within '.online-resource' do
        expect(page).to have_field('Name', with: 'ORN Text')
        expect(page).to have_field('Protocol', with: 'ORP Text')
        expect(page).to have_field('Linkage', with: 'ORL Text')
        expect(page).to have_field('Description', with: 'ORD Text')
        expect(page).to have_field('Application Profile', with: 'ORAP Text')
        expect(page).to have_field('Function', with: 'ORF Text')
      end
    end
  end
end
