require 'rails_helper'

describe BulkUpdatesController, reset_provider: true do
  # TODO add contexts 'when bulk updates enabled' and 'when bulk updates disabled' ?
  describe 'GET #index' do
    before do
      sign_in

      get :index
    end

    it 'renders the #index view' do
      expect(response).to render_template(:index)
    end

    it 'sets the tasks instance variable' do
      # expect(assigns(:tasks)).to eq([]) # this should be the test when the dummy response data is removed

      # this is what we need to test against because of the response dummy data
      expect(assigns(:tasks)).to eq(
        [
          { "task-id" => "ABCDEF123","status" => "IN_PROGRESS" },
          { "task-id" => "12345678","status" => "COMPLETE" },
          { "task-id" => "XYZ123456","status" => "COMPLETE" }
        ]
      )
    end
  end

  describe 'GET #show' do
    before do
      sign_in

      get :show, id: 1
    end

    it 'renders the #show view' do
      expect(response).to render_template(:show)
    end

    it 'sets the task instance variable' do
      # these should be the expectations when there the dummy response data is removed
      # expect(assigns(:task)).to eq({})

      # this is what we need to test against because of the response dummy data
      expect(assigns(:task)).to eq(
        { "status" => 200,
          "task-status" => "COMPLETE",
          "status-message" => "The bulk update completed with 2 errors",
          "collection-statuses" => [
            { "concept-id" => "C1-PROV","status-message" => "Missing required properties" },
            {"concept-id" => "C2-PROV","status-message" => "Invalid XML" }
          ] })
    end
  end
end
