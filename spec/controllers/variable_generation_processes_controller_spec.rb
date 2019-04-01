describe VariableGenerationProcessesController, reset_provider: true do
  describe 'POST #create' do
    context 'when variable generation is enabled' do
      before do
        sign_in
      end

      context 'when correct data is being sent' do
        before do
          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_stubbed_naive_response.json')
          success_response_body = File.read(response_path)
          uvg_generate_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate_stub).and_return(uvg_generate_response)

          post :create,
               'payload': {
                 'collection_concept_id': 'C1238517344-GES_DISC',
                 'provider': 'GES_DISC'
               }
        end

        it 'renders the show view' do
          expect(response).to render_template(:show)
        end
      end

      # TODO: need proper errors from the api to test
      # context 'when incorrect data is being sent'
    end

    context 'when variable generation is disabled' do
      before do
        sign_in

        allow(Mmt::Application.config).to receive(:uvg_enabled).and_return(false)
      end

      it 'redirects the user to the manage variables page' do
        post :create

        expect(response).to redirect_to(manage_variables_path)
      end
    end
  end
end
