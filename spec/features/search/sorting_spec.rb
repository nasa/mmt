# MMT-23

require 'rails_helper'

describe 'Search sorting', js: true do
  context 'when sorting search collections results' do
    before do
      login
      click_on 'Find'
    end

    # Waiting for CMR-2111
    # context 'by Short Name' do
    #   before do
    #     click_on 'Sort by Short Name Asc'
    #   end
    #
    #   it 'displays the correct search param' do
    #     expect(page).to have_search_query(nil, 'Sort Key: Short Name Asc')
    #   end
    #
    #   it 'sorts the results by Short Name Asc' do
    #     expect(page).to have_content('ACR3L2DM')
    #     expect(page).to have_no_content('SAMMIGEO_2')
    #   end
    #
    #   context 'when sorting again' do
    #     before do
    #       click_on 'Sort by Short Name Desc'
    #     end
    #
    #     it 'displays the correct search param' do
    #       expect(page).to have_search_query(nil, 'Sort Key: Short Name Desc')
    #     end
    #
    #     it 'sorts the results by Short Name Desc' do
    #       expect(page).to have_content('SAMMIGEO_2')
    #       expect(page).to have_no_content('ACR3L2DM')
    #     end
    #   end
    # end

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

    context 'by Provider' do
      before do
        click_on 'Sort by Provider Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(nil, 'Sort Key: Provider Id Asc')
      end

      it 'sorts the results by Provider Id Asc' do
        expect(page).to have_content('ACRIM III Level 2 Daily Mean Data V001')
        expect(page).to have_no_content('2000 Pilot Environmental Sustainability Index (ESI)')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Provider Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Provider Id Desc')
        end

        it 'sorts the results by Provider Id Desc' do
          expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
          expect(page).to have_no_content('ACRIM III Level 2 Daily Mean Data V001')
        end
      end
    end
  end

  context 'when sorting search drafts results' do
    before do
      login

      a, c, z = {}, {}, {}
      a[:title] = 'Arctic Cooling Heating Vectors'
      a[:date] = 5.days.ago
      a[:provider] = 'LARC'
      c[:title] = 'Charles Satellite Earth Monitoring'
      c[:date] = 3.days.ago
      c[:provider] = 'MMT_2'
      z[:title] = 'Zimbabwe Evapotranspiration'
      z[:date] = 1.day.ago
      z[:provider] = 'SEDAC'

      [a, c, z].each do |draft|
        20.times do |i|
          create(:draft, entry_title: draft[:title], provider_id: draft[:provider], updated_at: draft[:date])
        end
      end

      user = User.first
      user.available_providers = %w(LARC MMT_1 MMT_2 SEDAC)
      user.save

      full_search(record_type: 'Drafts')
    end

    context 'by Entry Title' do
      before do
        click_on 'Sort by Entry Title Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(nil, 'Sort Key: Entry Title Asc')
      end

      it 'sorts the results by Entry Title Asc' do
        expect(page).to have_content('Arctic Cooling Heating Vectors')
        expect(page).to have_no_content('Zimbabwe Evapotranspiration')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Entry Title Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Entry Title Desc')
        end

        it 'sorts the results by Entry Title Desc' do
          expect(page).to have_content('Zimbabwe Evapotranspiration')
          expect(page).to have_no_content('Arctic Cooling Heating Vectors')
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
        expect(page).to have_content('Arctic Cooling Heating Vectors')
        expect(page).to have_no_content('Zimbabwe Evapotranspiration')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Last Modified Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Last Modified Desc')
        end

        it 'sorts the results by Last Modified Desc' do
          expect(page).to have_content('Zimbabwe Evapotranspiration')
          expect(page).to have_no_content('Arctic Cooling Heating Vectors')
        end
      end
    end

    context 'by Provider' do
      before do
        click_on 'Sort by Provider Asc'
      end

      it 'displays the correct search param' do
        expect(page).to have_search_query(nil, 'Sort Key: Provider Id Asc')
      end

      it 'sorts the results by Provider Id Asc' do
        expect(page).to have_content('Arctic Cooling Heating Vectors')
        expect(page).to have_no_content('Zimbabwe Evapotranspiration')
      end

      context 'when sorting again' do
        before do
          click_on 'Sort by Provider Desc'
        end

        it 'displays the correct search param' do
          expect(page).to have_search_query(nil, 'Sort Key: Provider Id Desc')
        end

        it 'sorts the results by Provider Id Desc' do
          expect(page).to have_content('Zimbabwe Evapotranspiration')
          expect(page).to have_no_content('Arctic Cooling Heating Vectors')
        end
      end
    end
  end
end
