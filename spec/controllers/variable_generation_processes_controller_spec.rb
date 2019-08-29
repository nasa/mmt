describe VariableGenerationProcessesController, reset_provider: true do
  before do
    set_as_mmt_proper
    sign_in
  end

  describe 'POST #create' do
    context 'when variable generation is enabled' do
      context 'when correct data is sent with the request' do
        before do
          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_stubbed_naive_response.json')
          success_response_body = File.read(response_path)
          uvg_generate_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_response)

          post :create,
               selected_collection: 'C1238517344-GES_DISC',
               provider: 'GES_DISC'
        end

        it 'renders the show view' do
          expect(response).to render_template(:show)
        end
      end

      context 'when request is sent with missing parameters' do
        before do
          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'no_payload_response.txt')
          error_response_body = File.read(response_path).to_json
          uvg_generate_error_response = cmr_fail_response(error_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_error_response)

          post :create,
               collection_concept_id: 'C1238517344-GES_DISC',
               provider: 'GES_DISC'
        end

        it 'redirects back to the cmr_search page' do
          expect(response).to redirect_to(new_variable_generation_processes_search_path)
        end
      end
    end

    context 'when variable generation is disabled' do
      before do
        allow(Mmt::Application.config).to receive(:uvg_enabled).and_return(false)
      end

      it 'redirects the user to the manage variables page' do
        post :create

        expect(response).to redirect_to(manage_variables_path)
      end
    end
  end

  describe 'PUT #update' do
    context 'when variable generation is enabled' do
      context 'when correct data is sent with the request' do
        before do
          variables_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_list_variables.json')
          variables = File.read(variables_path)

          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_stubbed_naive_response.json')
          success_response_body = File.read(response_path)
          uvg_augment_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_augment_keywords).and_return(uvg_augment_response)

          put :update,
              collection_id: 'C1238517344-GES_DISC',
              provider: 'GES_DISC',
              augmentation_type: 'keywords',
              variables_json: variables
        end

        it 'renders the show view' do
          expect(response).to render_template(:show)
        end
      end

      context 'when request is sent with missing parameters' do
        before do
          variables_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_list_variables.json')
          variables = File.read(variables_path)

          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'no_payload_response.txt')
          error_response_body = File.read(response_path)
          uvg_generate_error_response = cmr_fail_response(error_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_augment_keywords).and_return(uvg_generate_error_response)

          put :update,
              collection_concept_id: 'C1238517344-GES_DISC',
              provider: 'GES_DISC',
              augmentation_type: 'keywords',
              variables_json: variables
        end

        it 'renders the edit page' do
          expect(response).to render_template(:edit)
        end
      end
    end

    context 'when variable generation is disabled' do
      before do
        allow(Mmt::Application.config).to receive(:uvg_enabled).and_return(false)
      end

      it 'redirects the user to the manage variables page' do
        put :update

        expect(response).to redirect_to(manage_variables_path)
      end
    end
  end
end
