describe VariableGenerationProcessesSearchesController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

  describe 'GET #new' do
    before :all do
      5.times { publish_collection_draft }
    end

    before do
      sign_in
    end

    context 'When variable generation is enabled' do
      context 'When no parameters are provided' do
        it 'renders the #new view' do
          get :new

          expect(response).to render_template(:new)
        end

        it 'sets the collections instance variable' do
          get :new

          expect(assigns(:collections)).to eq([])
        end
      end

      context 'When query and field are provided' do
        it 'sets the collections instance variable' do
          get :new, params: { search_criteria: { 123 => { query_text: 'false', field: 'browsable' } } }

          expect(assigns(:collections).size).to eq(5)
        end
      end
    end

    context 'When variable generation is disabled' do
      before do
        sign_in

        allow(Mmt::Application.config).to receive(:uvg_enabled).and_return(false)
      end

      it 'redirects the user to the manage variables page' do
        get :new

        expect(response).to redirect_to(manage_variables_path)
      end
    end
  end
end
