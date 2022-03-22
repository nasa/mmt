describe 'Downloading YAML configuration file', reset_provider: true, js: true do
  context 'when viewing the collection permissions index page' do
    before do
      login
      visit permissions_path
    end
    it 'renders the download link' do
      expect(page).to have_link('Download YAML', href: permissions_tea_configuration_path)
    end
    # context 'when downloading the YAML' do
    #   before do
    #     @file = "#{Rails.root}/tea_configuration-#{Date.today}.yaml"
    #     click_on 'Download YAML'
    #
    #     # Seems to need a brief (>0.1) pause to actually find the file.
    #     sleep(20)
    #   end
    #   after do
    #     FileUtils.rm @file if File.exist?(@file)
    #   end
    #
    #   it 'downloads the file' do
    #     expect(File.exist?(@file)).to eq(true)
    #   end
    # end
  end
end