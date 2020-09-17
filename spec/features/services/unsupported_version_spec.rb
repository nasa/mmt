describe 'Services published at UMM Version higher than MMT supports', reset_provider: true do
  before :all do
    @ingest_response, _concept_response = publish_service_draft
    @original_s_config = Rails.configuration.umm_s_version
    Rails.configuration.umm_s_version = "vnd.nasa.cmr.umm+json; version=1.3.2"
  end

  after :all do
    Rails.configuration.umm_s_version = @original_s_config
  end

  context 'when in the right provider' do
    before do
      login
    end

    context 'when viewing the Service show page' do
      before do
        visit service_path(@ingest_response['concept-id'])
      end

      it 'displays a banner message explaining the published version is unsupported' do
        within '.eui-banner--warn' do
          expect(page).to have_content('This service has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this service is currently unavailable.')
          expect(page).to have_content('Cloning this service to create a new draft record may result in loss of data.')
        end
      end

      it 'displays a diabled Edit link but not the Clone link' do
        expect(page).to have_css('a.disabled', text: 'Edit Service Record')

        expect(page).to have_link('Edit Service Record', href: '#')
        expect(page).to have_link('Clone Service Record', href: clone_service_path(@ingest_response['concept-id']))
      end
    end

    context 'when trying to visit the Edit Service url directly' do
      before do
        visit edit_service_path(@ingest_response['concept-id'])
      end

      it 'displays a banner message explaining the published version is unsupported' do
        within '.eui-banner--warn' do
          expect(page).to have_content('This service has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this service is currently unavailable.')
          expect(page).to have_content('Cloning this service to create a new draft record may result in loss of data.')
        end
      end

      it 'displays a diabled Edit link but not the Clone link' do
        expect(page).to have_css('a.disabled', text: 'Edit Service Record')

        expect(page).to have_link('Edit Service Record', href: '#')
        expect(page).to have_link('Clone Service Record', href: clone_service_path(@ingest_response['concept-id']))
      end
    end
  end

  context 'when in the wrong provider' do
    before do
      login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))
      visit clone_service_path(@ingest_response['concept-id'])
    end

    it 'has a banner warning the user to change their provider' do
      expect(page).to have_content('You need to change your current provider to clone this service. Click here to change your provider')
    end

    it 'has a banner warning the user about the unsupported version' do
      expect(page).to have_content('This service has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this service is currently unavailable.')
      expect(page).to have_content('Cloning this service to create a new draft record may result in loss of data.')
    end

    it 'has a disabled edit link and enabled clone link' do
      # we need to use have_css to check the disabled class
      expect(page).to have_css('a.disabled', text: 'Edit Service Record')

      expect(page).to have_link('Edit Service Record', href: '#')
      expect(page).to have_link('Clone Service Record', href: '#not-current-provider-modal')
    end
  end
end
