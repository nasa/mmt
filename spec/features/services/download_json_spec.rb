# EDL Failed Test
describe 'Downloading Service JSON', js: true, skip:true do
  before :all do
    @ingest_response, _concept_response = publish_service_draft
  end

  context 'when viewing the service preview page' do
    before do
      login

      visit service_path(@ingest_response['concept-id'])
    end

    it 'renders the download link' do
      expect(page).to have_link('Download JSON', href: download_json_service_path(@ingest_response['concept-id']))
    end

    context 'when downloading the json' do
      before do
        @file = "#{Rails.root}/#{@ingest_response['concept-id']}.json"
        click_on 'Download JSON'

        # Seems to need a brief (>0.1) pause to actually find the file.
        sleep(1)
      end

      after do
        FileUtils.rm @file if File.exist?(@file)
      end

      it 'downloads the file' do
        expect(File.exist?(@file)).to eq(true)
      end
    end
  end
end
