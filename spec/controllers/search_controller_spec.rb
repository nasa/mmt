require 'rails_helper'

RSpec.describe SearchController, type: :controller do

  describe "GET #search1" do
    it "returns http success" do
      get :search1
      expect(response).to have_http_status(:success)
    end
  end

end
