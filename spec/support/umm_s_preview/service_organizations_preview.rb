shared_examples_for 'Service Organizations Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.service-organizations-cards' do
      within all('li.card')[0] do
        within '.card-header' do
          expect(page).to have_content('AARHUS-HYDRO')
          expect(page).to have_content('Multiple Roles')
          expect(page).to have_content('DEVELOPER')
          expect(page).to have_content('PUBLISHER')
        end

        within '.card-body' do
          within '.card-body-details-full' do
            expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
          end
        end
      end

      # Second organization
      within all('li.card')[1] do
        within '.card-header' do
          expect(page).to have_content('AARHUS-HYDRO')
          expect(page).to have_content('Multiple Roles')
          expect(page).to have_content('DEVELOPER')
          expect(page).to have_content('PUBLISHER')
        end

        within all('.card-body')[0] do
          within '.card-body-details-full' do
            expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
          end
        end

        # Second organization's online resource
        within all('.card-body')[1] do
          expect(page).to have_content('ORN Text')
          expect(page).to have_content('ORD Text')
          expect(page).to have_link('ORL Text')
          expect(page).to have_content('Protocol: ORP Text')
          expect(page).to have_content('Application Profile: ORAP Text')
          expect(page).to have_content('Function: ORF Text')
        end
      end
    end
  end
end