require 'rails_helper'

describe 'Viewing Provider Order Information' do
  before do
    login(provider: 'DEV07', providers: %w(MMT_2 DEV07))
  end

  after do
    login
  end

  context 'when viewing provider order information' do
    let(:order_guid) { 'test_order_guid' }

    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_order_information', record: :none) do
        visit provider_order_path(order_guid)
      end
    end

    it 'displays order information' do
      expect(page).to have_content('Order Guid: test_order_guid')
      expect(page).to have_content('Provider ID: MMT_2')
      expect(page).to have_content('Tracking ID: 0600030372')
      expect(page).to have_content('Provider Order State: PROCESSING')
      expect(page).to have_content('Closed Date: Not Closed')

      # Catalog Items
      within '#catalog-items-table tbody' do
        within first('tr') do
          expect(page).to have_content('G1000012741-MMT_2 NOT_SET SC:MOD10CM.005:93887 MOD10CM.A2003032.005.2009025021051.hdf MOD10CM.5 Order')
        end
      end

      # Status Messages
      expect(page).to have_content('Friday, February 03, 2017 at 10:20 am: ECHO: Transitioning from state [null] to state [NOT_VALIDATED]')
      expect(page).to have_content('Friday, February 03, 2017 at 10:20 am: ECHO: Transitioning from state [NOT_VALIDATED] to state [VALIDATED]')
      expect(page).to have_content('Friday, February 03, 2017 at 10:20 am: ECHO: Transitioning from state [VALIDATED] to state [SUBMITTING]')
      expect(page).to have_content('Friday, February 03, 2017 at 10:20 am: Order received')
      expect(page).to have_content('Friday, February 03, 2017 at 10:20 am: ECHO: Transitioning from state [SUBMITTING] to state [PROCESSING]')

      expect(page).to have_link('Manage Order Items')
    end

    context 'when clicking show for a catalog item', js: true do
      before do
        click_on 'Show'
      end

      it 'shows the Option Selection' do
        expect(page).to have_selector('pre', text: '<ecs:options xmlns:ecs="http://ecs.nasa.gov/options"><ecs:distribution xmlns="http://ecs.nasa.gov/options"><ecs:mediatype><ecs:value>FtpPull</ecs:value></ecs:mediatype><ecs:mediaformat><ecs:ftppull-format><ecs:value>FILEFORMAT</ecs:value></ecs:ftppull-format><ecs:ftppush-format><ecs:value>FILEFORMAT</ecs:value></ecs:ftppush-format></ecs:mediaformat></ecs:distribution><ecs:ancillary xmlns="http://ecs.nasa.gov/options"><ecs:orderPH>false</ecs:orderPH><ecs:orderQA>false</ecs:orderQA><ecs:orderHDF_MAP>false</ecs:orderHDF_MAP><ecs:orderBrowse>false</ecs:orderBrowse></ecs:ancillary><ecs:esi-xml><!--NOTE: elements in caps losely match the ESI API, those in lowercase are helper elements --><ecs:requestInfo><ecs:email>Alien.Bobcat@nasa.gov</ecs:email></ecs:requestInfo><!--Dataset ID will be injected by Reverb--><ecs:CLIENT>ESI</ecs:CLIENT><!--First SubsetAgent in the input capabilities XML is used as the default.--><ecs:SUBAGENT_ID><ecs:value>HEG</ecs:value></ecs:SUBAGENT_ID><!-- hardcode to async for Reverb services --><ecs:REQUEST_MODE>async</ecs:REQUEST_MODE><ecs:SPATIAL_MSG>Click the checkbox to enable spatial subsetting.</ecs:SPATIAL_MSG><ecs:ADVANCED_OPT_MSG>No resampling or interpolation options available with current selection.</ecs:ADVANCED_OPT_MSG><ecs:PROJ_MSG_1>CAUTION: Re-projection parameters may alter results.</ecs:PROJ_MSG_1><ecs:PROJ_MSG_2>Leave blank to choose default values for each re-projected granule.</ecs:PROJ_MSG_2><ecs:HEG-request><!--Need to populate BBOX in final ESI request as follows: "&BBOX=ullon,lrlat,lrlon,ullat"--><ecs:band_subsetting><ecs:SUBSET_DATA_LAYERS style="tree"><ecs:MOD10CM><ecs:dataset>/MOD10CM</ecs:dataset></ecs:MOD10CM></ecs:SUBSET_DATA_LAYERS></ecs:band_subsetting><!--First Format in the input XML is used as the default.--><ecs:FORMAT><ecs:value>GeoTIFF</ecs:value></ecs:FORMAT><!-- OUTPUT_GRID is never used in ESI (but should be enabled for SSW)--><!-- FILE_IDS must be injected by Reverb --><!-- FILE_URLS is not used in requests from ECHO, Use FILE_IDS instead --><ecs:projection_options><ecs:PROJECTION><ecs:value>&amp;</ecs:value></ecs:PROJECTION><!--In final ESI request, projection parameters should be included as follows: "&PROJECTION_PARAMETERS=param1:value1,param2:value2,...paramn:valuen"--></ecs:projection_options><ecs:advanced_file_options><!--In final ESI request, resample options should be formatted like: "&RESAMPLE=dimension:value"--><!--INCLUDE_META needs to be converted from true/false here to Y/N in the request.--><ecs:INCLUDE_META>false</ecs:INCLUDE_META></ecs:advanced_file_options><ecs:spatial_subset_flag>false</ecs:spatial_subset_flag><ecs:band_subset_flag>true</ecs:band_subset_flag><ecs:temporal_subset_flag>false</ecs:temporal_subset_flag></ecs:HEG-request></ecs:esi-xml></ecs:options>')
      end
    end
  end

  context 'when viewing a closed order' do
    let(:order_guid) { 'closed_order_guid' }

    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_orders/closed', record: :none) do
        visit provider_order_path(order_guid)
      end
    end

    it 'does not display a cancel button' do
      expect(page).to_not have_link('Manage Order Items')
    end
  end

  context 'when viewing a cancelled order' do
    let(:order_guid) { 'cancelled_order_guid' }

    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_orders/cancelled', record: :none) do
        visit provider_order_path(order_guid)
      end
    end

    it 'does not display a cancel button' do
      expect(page).to_not have_link('Manage Order Items')
    end
  end
end
