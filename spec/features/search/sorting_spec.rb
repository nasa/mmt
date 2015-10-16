# MMT-23

require 'rails_helper'

describe 'Search sorting', js: true do
  context 'when sorting search results' do
    before do
      login
      click_on 'Find'
    end

    context 'by Entry Id' do
      before do
        click_on 'Sort by Entry Id Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(55, 'Sort Key: Entry Id Asc')
      end

      it 'sorts the results by Entry Id Asc' do
        expect(page).to have_content('aces1cont_1')
        expect(page).to have_no_content('NSIDC-0212_1')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Entry Id Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(55, 'Sort Key: Entry Id Desc')
        end

        it 'sorts the results by Entry Id Desc' do
          expect(page).to have_content('NSIDC-0212_1')
          expect(page).to have_no_content('aces1cont_1')
        end
      end
    end

    context 'by Entry Title' do
      before do
        click_on 'Sort by Entry Title Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(55, 'Sort Key: Entry Title Asc')
      end

      it 'sorts the results by Entry Title Asc' do
        expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
        expect(page).to have_no_content('AIRMISR_SNOW_ICE_2001')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Entry Title Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(55, 'Sort Key: Entry Title Desc')
        end

        it 'sorts the results by Entry Title Desc' do
          expect(page).to have_content('AIRMISR_SNOW_ICE_2001')
          expect(page).to have_no_content('15 Minute Stream Flow Data: USGS (FIFE)')
        end
      end
    end

    context 'by Revision Date' do
      before do
        click_on 'Sort by Revision Date Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(55, 'Sort Key: Revision Date Asc')
      end

      it 'sorts the results by Revision Date Asc' do
        expect(page).to have_content('doi:10.3334/ORNLDAAC/1_1')
        expect(page).to have_no_content('AIRMISR_SNOW_ICE_2001_1')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Revision Date Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(55, 'Sort Key: Revision Date Desc')
        end

        it 'sorts the results by Revision Date Desc' do
          expect(page).to have_content('AIRMISR_SNOW_ICE_2001_1')
          expect(page).to have_no_content('doi:10.3334/ORNLDAAC/1_1')
        end
      end
    end
  end
end
