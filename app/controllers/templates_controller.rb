class TemplatesController < BaseDraftsController
  before_action :set_resource, only: [:create_draft]
  before_action :templates_enabled?

  def create_draft; end
end
