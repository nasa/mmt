# :nodoc:
class ServicesController < BasePublishedRecordController
  include ManageMetadataHelper

  before_action :set_service, only: [:show, :edit, :clone, :destroy, :revisions, :revert, :download_json]
  before_action :set_schema, only: [:show, :edit, :clone, :destroy]
  before_action :ensure_correct_provider, only: [:edit, :clone, :destroy]
  before_action :set_preview, only: [:show]

  # https://stackoverflow.com/questions/34735540/action-defined-in-applicationcontroller-can-not-be-found
  def clone
    super
  end

  private

  def resource_schema
    's'
  end
end
