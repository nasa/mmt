
describe 'Displaying the loss report in browser' do
  context 'when accessing the loss report' do
    
    let(:echo_concept_id) { echo_concept_id = cmr_client.get_collections({'EntryTitle': 'Anthropogenic Biomes of the World, Version 2: 1700'}).body.dig('items',0,'meta','concept-id') }
    let(:dif_concept_id) { dif_concept_id = cmr_client.get_collections({'EntryTitle': '2000 Pilot Environmental Sustainability Index (ESI)'}).body.dig('items',0,'meta','concept-id') }
    let(:iso_concept_id) { iso_concept_id = cmr_client.get_collections({'EntryTitle': 'SMAP L4 Global 3-hourly 9 km Surface and Rootzone Soil Moisture Analysis Update V002'}).body.dig('items',0,'meta','concept-id') }

    before do
      login
    end

    context 'when displaying json' do
      it 'properly displays the echo json report' do
        visit loss_report_collections_path(echo_concept_id, format:'json')
        expect(page.text.gsub(/\s+/, "")).to have_text(File.read('/Users/ctrummer/mmt/spec/fixtures/loss_report_samples/loss_report_echo_sample.json').gsub(/\s+/, ""))
      end
      it 'properly displays the dif json report' do
        visit loss_report_collections_path(dif_concept_id, format:'json')
        expect(page.text.gsub(/\s+/, "")).to have_text(File.read('/Users/ctrummer/mmt/spec/fixtures/loss_report_samples/loss_report_dif_sample.json').gsub(/\s+/, ""))
      end
      it 'properly displays the iso json report' do
        visit loss_report_collections_path(iso_concept_id, format:'json')
        # the reason this iso example has to be split is that cmr adds/updates a couple 'id' attributes
        # in the actual collection (every time it is translated) and therefore the the comparison report will always include these changes
        # except with a different value for the 'id' attribute. In order to bypass this issue we ignore the 'id' changes by using them as #split delimiters
        string_part = File.read('/Users/ctrummer/mmt/spec/fixtures/loss_report_samples/loss_report_iso_sample.json').gsub(/\s+/, "").split(/dc714eaf5-01b3-4705-9031-f35c87e98529|dd8cd38ba-0984-4af1-9a10-b6e303388cc4/)
        expect(page.text.gsub(/\s+/, "")).to have_text(string_part[0])
        expect(page.text.gsub(/\s+/, "")).to have_text(string_part[1])
        expect(page.text.gsub(/\s+/, "")).to have_text(string_part[2])
      end
    end

    context 'when displaying text' do

      it 'properly displays the echo text report' do
        visit loss_report_collections_path(echo_concept_id, format:'text')
        expect(page.text.gsub(/\s+/, "")).to have_text(File.read('/Users/ctrummer/mmt/spec/fixtures/loss_report_samples/loss_report_echo_sample.text').gsub(/\s+/, ""))
      end
      it 'properly displays the dif text report' do
        visit loss_report_collections_path(dif_concept_id, format:'text')
        expect(page.text.gsub(/\s+/, "")).to have_text(File.read('/Users/ctrummer/mmt/spec/fixtures/loss_report_samples/loss_report_dif_sample.text').gsub(/\s+/, ""))
      end
      it 'properly displays the iso text report' do
        visit loss_report_collections_path(iso_concept_id, format:'text')
        expect(page.text.gsub(/\s+/, "")).to have_text(File.read('/Users/ctrummer/mmt/spec/fixtures/loss_report_samples/loss_report_iso_sample.text').gsub(/\s+/, ""))
      end
    end
  end
end
