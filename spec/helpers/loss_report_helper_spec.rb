
describe 'Loss Report Helper' do
  let(:umm_c_version) { '1.15.3' }

  context '#prepare_collections' do
    context 'when using cmr endpoints' do
      it 'successfully retrieves and translates the dif collection' do
        expect(helper.prepare_collections(dif_id, umm_c_version)).to be_truthy
      end
      it 'successfully retrieves and translates the iso collection' do
        expect(helper.prepare_collections(iso_id, umm_c_version)).to be_truthy
      end
      it 'successfully retrieves and translates the echo collection' do
        expect(helper.prepare_collections(echo_id, umm_c_version)).to be_truthy
      end
    end

  context '#loss_report_output'
    context 'when processing a dif collection' do
      it 'successfully produces a text loss report' do
        expect(helper.loss_report_output(dif_id).gsub(/\s+/, "")).to eql(dif_text_report.gsub(/\s+/, ""))
      end
      it 'successfully produces a json loss report' do
        expect(helper.loss_report_output(dif_id, hide_items=false, disp='json')).to eql(dif_json_report)
      end
    end
    context 'when processing an echo collection' do
      it 'successfully produces a text loss report' do
        expect(helper.loss_report_output(echo_id).gsub(/\s+/, "")).to eql(echo_text_report.gsub(/\s+/, ""))
      end
      it 'successfully produces a json loss report' do
        expect(helper.loss_report_output(echo_id, hide_items=false, disp='json')).to eql(echo_json_report)
      end
    end
    context 'when processing an iso collection' do
      it 'successfully produces a text loss report' do
        expect(helper.loss_report_output(iso_id).gsub(/\s+/, "")).to eql(iso_text_report.gsub(/\s+/, ""))
      end
      it 'successfully produces a json loss report' do
        report = helper.loss_report_output(iso_id, hide_items=false, disp='json')
        expect(report.keys.length).to be(32)
        expect(report).to have_key('8. +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/processingLevelCode/MD_Identifier/codeSpace/CharacterString')
        expect(report).to have_key('21. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[4]')
        expect(report).to have_key('24. +: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[1]')
        expect(report).to have_key('31. +: /DS_Series/seriesMetadata/MI_Metadata/dateStamp/Date')
      end
    end
    # the reason the iso example only checks the last key (instead of verifying the full report) is that cmr adds/updates an 'id' attribute
    # in the actual collection (every time it is translated) and therefore the the comparison report will always include this change
    # except with a different value for the 'id' attribute. This would cause the equality between the hashes to evaluate false and fail the
    # test every time. Spot checking the output is a comparable solution because any small addition/removal should throw off the numbering system,
    # +/- symbol, or path, and this test will fail.
  end
end
