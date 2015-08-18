# MMT-296

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'drafts/previews/_temporal_extent.html.erb'

describe template_path, type: :view do
  context 'when the temporal extent data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render :template => template_path, :locals=>{draft: {}}
      end

      it 'does not crash or have temporal extent data' do
        expect(rendered).to have_content('Temporal Extent')
        expect(rendered).to_not have_content('Temporal Keyword')
        expect(rendered).to_not have_content('Paleo Temporal Coverage')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['TemporalExtent'] = [
            {"TemporalRangeType"=>"SingleDateTime", "PrecisionOfSeconds"=>1, "EndsAtPresentFlag"=>false, "SingleDateTime"=>["2015-07-01", "2015-12-25"]},

            {"TemporalRangeType"=>"RangeDateTime", "PrecisionOfSeconds"=>10, "EndsAtPresentFlag"=>false, "RangeDateTime"=>[
                {"BeginningDateTime"=>"2014-07-01", "EndingDateTime"=>"2014-08-01"},
                {"BeginningDateTime"=>"2015-07-01", "EndingDateTime"=>"2015-08-01"}
            ]},

            {"TemporalRangeType"=>"PeriodicDateTime", "PrecisionOfSeconds"=>30, "EndsAtPresentFlag"=>false,
                "PeriodicDateTime"=>[
                    {"Name"=>"test 1 Periodic Extent", "StartDate"=>"2015-07-01", "EndDate"=>"2015-08-01", "DurationUnit"=>"DAY", "DurationValue"=>5, "PeriodCycleDurationUnit"=>"DAY", "PeriodCycleDurationValue"=>1},
                    {"Name"=>"test 2 Periodic Extent", "StartDate"=>"2016-07-01", "EndDate"=>"2016-08-01", "DurationUnit"=>"MONTH", "DurationValue"=>4, "PeriodCycleDurationUnit"=>"MONTH", "PeriodCycleDurationValue"=>2},
                ]}
        ]

        draft_json['TemporalKeyword'] = ["test 1 Keyword", "test 2 Keyword"]

        draft_json['PaleoTemporalCoverage'] = {"StartDate"=>"2015-07-01", "EndDate"=>"2015-08-01",
           "ChronostratigraphicUnit"=>[
               {"Eon"=>"test 1 Eon", "Era"=>"test 1 Era", "Epoch"=>"test 1 Epoch", "Stage"=>"test 1 Stage",
                "DetailedClassification"=>"test 1 Detailed Classification", "Period"=>"test 1 Period"},
               {"Eon"=>"test 2 Eon", "Era"=>"test 2 Era", "Epoch"=>"test 2 Epoch", "Stage"=>"test 2 Stage",
                "DetailedClassification"=>"test 2 Detailed Classification", "Period"=>"test 2 Period"},
               {"Eon"=>"test 3 Eon text 1"}
           ]
        }

        assign(:draft, build(:draft, draft: draft_json))
        render :template => template_path, :locals=>{draft: draft_json}
      end


      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('TemporalExtent')}"), draft_json['TemporalExtent'], 'TemporalExtent',
                                            {DurationUnit: :handle_as_duration, PeriodCycleDurationUnit: :handle_as_duration, TemporalRangeType: :handle_as_not_shown })
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('TemporalKeyword')}"), draft_json['TemporalKeyword'], 'TemporalKeyword')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('PaleoTemporalCoverage')}"), draft_json['PaleoTemporalCoverage'], 'PaleoTemporalCoverage')
      end

    end

  end

end


