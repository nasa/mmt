# MMT-293

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

describe 'drafts/previews/_data_identification.html.erb', type: :view do
  context 'when the data identification data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render
      end

      it 'does not crash or have data identification data' do
        expect(rendered).to have_content('Data Identification')
        expect(rendered).to_not have_content('Processing Level')
        expect(rendered).to_not have_content('Abstract')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['TemporalExtent'] = [
            {"TemporalRangeType"=>"SingleDateTime", "PrecisionOfSeconds"=>"1", "EndsAtPresentFlag"=>"false", "SingleDateTime"=>["2015-07-01", "2015-12-25"]},

            {"TemporalRangeType"=>"RangeDateTime", "PrecisionOfSeconds"=>"10", "EndsAtPresentFlag"=>"false", "RangeDateTime"=>[
                {"BeginningDateTime"=>"2014-07-01", "EndingDateTime"=>"2014-08-01"},
                {"BeginningDateTime"=>"2015-07-01", "EndingDateTime"=>"2015-08-01"}
            ]},

            {"TemporalRangeType"=>"PeriodicDateTime", "PrecisionOfSeconds"=>"30", "EndsAtPresentFlag"=>"false",
             "PeriodicDateTime"=>[
                 {"Name"=>"test 1 Periodic Extent", "StartDate"=>"2015-07-01", "EndDate"=>"2015-08-01", "DurationUnit"=>"DAY", "DurationValue"=>"5", "PeriodCycleDurationUnit"=>"DAY", "PeriodCycleDurationValue"=>"1"},
                 {"Name"=>"test 2 Periodic Extent", "StartDate"=>"2016-07-01", "EndDate"=>"2016-08-01", "DurationUnit"=>"MONTH", "DurationValue"=>"4", "PeriodCycleDurationUnit"=>"MONTH", "PeriodCycleDurationValue"=>"2"},
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
        render
      end


      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
#puts rendered.gsub(/\s+/, " ").strip
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('EntryId')}"), draft_json['EntryId'], 'EntryId')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('EntryTitle')}"), draft_json['EntryTitle'], 'EntryTitle')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('Abstract')}"), draft_json['Abstract'], 'Abstract')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('Purpose')}"), draft_json['Purpose'], 'Purpose')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('DataLanguage')}"), draft_json['DataLanguage'], 'DataLanguage')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('DataLineage')}"), draft_json['DataLineage'], 'DataLineage')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ResponsibleOrganization')}"), draft_json['ResponsibleOrganization'], 'ResponsibleOrganization')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ResponsiblePersonnel')}"), draft_json['ResponsiblePersonnel'], 'ResponsiblePersonnel')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('CollectionDataType')}"), draft_json['CollectionDataType'], 'CollectionDataType')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ProcessingLevel')}"), draft_json['ProcessingLevel'], 'ProcessingLevel')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ResourceCitation')}"), draft_json['ResourceCitation'], 'ResourceCitation')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('CollectionProgress')}"), draft_json['CollectionProgress'], 'CollectionProgress')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('Quality')}"), draft_json['Quality'], 'Quality')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('UseConstraints')}"), draft_json['UseConstraints'], 'UseConstraints')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('AccessConstraints')}"), draft_json['AccessConstraints'], 'AccessConstraints')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('MetadataAssociation')}"), draft_json['MetadataAssociation'], 'MetadataAssociation')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('PublicationReference')}"), draft_json['PublicationReference'], 'PublicationReference')
      end

    end

  end

end


