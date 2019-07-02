class TemplatesController < BaseDraftsController
  before_action :set_resource, only: [:create_draft, :destroy]
  before_action :templates_enabled?
end
