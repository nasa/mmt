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
        expect(page).to have_search_query(nil, 'Sort Key: Entry Id Asc')
      end

      it 'sorts the results by Entry Id Asc' do
        expect(page).to have_content('ACR3L2DM_1')
        expect(page).to have_no_content('SAMMIGEO_2')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Entry Id Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Entry Id Desc')
        end

        it 'sorts the results by Entry Id Desc' do
          expect(page).to have_content('SAMMIGEO_2')
          expect(page).to have_no_content('ACR3L2DM_1')
        end
      end
    end

    context 'by Entry Title' do
      before do
        click_on 'Sort by Entry Title Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(nil, 'Sort Key: Entry Title Asc')
      end

      it 'sorts the results by Entry Title Asc' do
        expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
        expect(page).to have_no_content('MISR Level 1B1 Radiance Data V002')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Entry Title Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Entry Title Desc')
        end

        it 'sorts the results by Entry Title Desc' do
          expect(page).to have_content('MISR Level 1B1 Radiance Data V002')
          expect(page).to have_no_content('2000 Pilot Environmental Sustainability Index (ESI)')
        end
      end
    end

    context 'by Last Modified' do
      before do
        click_on 'Sort by Last Modified Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(nil, 'Sort Key: Last Modified Asc')
      end

      it 'sorts the results by Last Modified Asc' do
        expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
        expect(page).to have_no_content('MISR Level 1B1 Radiance Data V002')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Last Modified Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Last Modified Desc')
        end

        it 'sorts the results by Last Modified Desc' do
          expect(page).to have_content('MISR Level 1B1 Radiance Data V002')
          expect(page).to have_no_content('2000 Pilot Environmental Sustainability Index (ESI)')
        end
      end
    end
  end
end
