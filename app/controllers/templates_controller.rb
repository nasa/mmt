class TemplatesController < BaseDraftsController
  before_action :set_resource, only: [:create_draft]

  def list
    render text: 'true'
  end

  def create_draft; end
end
