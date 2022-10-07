describe 'Groups breadcrumbs and header', js:true do
  before :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @group = create_group(
        name: 'Breadcrumbs_Test_Group_01',
        description: 'test group',
        provider_id: 'MMT_2'
      )
    end
  end

  after :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      delete_group(concept_id: @group['group_id'])
    end
  end

  before do
    login
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      visit group_path(@group['group_id'])
    end
  end

  context 'when viewing the breadcrumbs', js:true do
    it 'displays Blank Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Groups')
        expect(page).to have_content('Breadcrumbs_Test_Group_01')
      end
    end
  end

  context 'when viewing the header', js:true do
    it 'has "Manage CMR" as the underlined current header link' do
      within 'main header' do
        skip 'the underline is present in the screenshot' do
          expect(page).to have_css('h2.current', text: 'Manage CMR')
        end
      end
    end
  end
end
