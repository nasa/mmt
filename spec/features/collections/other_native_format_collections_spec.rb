# MMT-557
require 'rails_helper'

describe 'Viewing Collections with other native formats', js: true do
  context 'when viewing a dif10 record that has a Data Center with Archiver role' do
    let(:short_name) { 'AIRG2SSD' }

    before do
      login

      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
      click_link short_name
    end

    it 'displays the collection and data center with correct role' do
      expect(page).to have_content(short_name)
      expect(page).to have_content('AIRS/Aqua L2G Precipitation Estimate (AIRS+AMSU) V006 (AIRG2SSD) at GES DISC')

      within '.data-centers-cards' do
        within all('li.card')[0] do
          within '.card-header' do
            expect(page).to have_content('NASA/GSFC/SED/ESD/GCDC/GESDISC')
            expect(page).to have_content('ARCHIVER')
          end
          within all('.card-body')[0] do
            within '.card-body-details' do
              expect(page).to have_content('Goddard Earth Sciences Data and Information Services Center (formerly Goddard DAAC), Global Change Data Center, Earth Sciences Division, Science and Exploration Directorate, Goddard Space Flight Center, NASA')
            end
          end
        end
      end
    end
  end
end
