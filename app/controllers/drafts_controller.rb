class DraftsController < ApplicationController
  before_action :set_draft, only: [:show, :edit, :update, :destroy]
  before_action :load_umm_schema

  # GET /drafts
  # GET /drafts.json
  def index
    @drafts = Draft.all
  end

  # GET /drafts/1
  # GET /drafts/1.json
  def show

    # Calculate spatial extent display information

    @point_coordinate_array = []
    @rectangle_coordinate_array = []

    if @draft.draft['SpatialExtent'] &&
      @draft.draft['SpatialExtent']['HorizontalSpatialDomain'] &&
      @draft.draft['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      map_width = 305
      map_height = 153
      highlight_color = "rgba(250,0,0,0.25)"

      geometry = @draft.draft['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      if !geometry['Points'].blank?

        dot_size = 5;

        geometry['Points'].each do |point|
          x, y = Draft.convert_lat_lon_to_image_x_y(point['Latitude'], point['Longitude'], map_width, map_height)
          @point_coordinate_array <<  {'lat'=>point['Latitude'], 'lon'=>point['Longitude'], 'x'=>x, 'y'=>y}
        end

      end

      if !geometry['BoundingRectangles'].blank?

        geometry['BoundingRectangles'].each do |bounding_rectangle|
          nbc = bounding_rectangle['NorthBoundingCoordinate']
          wbc = bounding_rectangle['WestBoundingCoordinate']
          sbc = bounding_rectangle['SouthBoundingCoordinate']
          ebc = bounding_rectangle['EastBoundingCoordinate']

          x1, y1 = Draft.convert_lat_lon_to_image_x_y(nbc, wbc, map_width, map_height)
          x2, y2 = Draft.convert_lat_lon_to_image_x_y(sbc, ebc, map_width, map_height)
          min_x = [x1, x2].min
          max_x = [x1, x2].max
          min_y = [y1, y2].min
          max_y = [y1, y2].max

          @rectangle_coordinate_array << {'nbc'=>nbc, 'wbc'=>wbc, 'sbc'=>sbc, 'ebc'=>ebc, 'min_x'=>min_x, 'min_y'=>min_y, 'max_x'=>max_x, 'max_y'=>max_y}
        end

      end
    end


    # Collect temporal extent display information

    @single_date_times = []
    @range_date_times = []
    @periodic_date_times = []

    if !@draft.draft['TemporalExtents'].blank?
      @draft.draft['TemporalExtents'].each do |temporal_extent|

        if temporal_extent['TemporalRangeType'] == 'SingleDateTime'

          temporal_extent['SingleDateTimes'].each do |single_date_time|
            @single_date_times << single_date_time
          end

        elsif temporal_extent['TemporalRangeType'] == 'RangeDateTime'

          temporal_extent['RangeDateTimes'].each do |range_date_time|
            @range_date_times << {'beginning_date_time'=>range_date_time['BeginningDateTime'], 'ending_date_time'=>range_date_time['EndingDateTime']}
          end

        elsif temporal_extent['TemporalRangeType'] == 'PeriodicDateTime'

          temporal_extent['PeriodicDateTimes'].each do |periodic_date_time|
            @periodic_date_times << {'start_date'=>periodic_date_time['StartDate'], 'end_date'=>periodic_date_time['EndDate']}
          end

        end

      end
    end

  end

  # GET /drafts/new
  def new
    draft = Draft.create(user: @current_user, draft: {})
    redirect_to draft_path(draft)
  end

  # GET /drafts/1/edit
  def edit
    if params[:form]
      @draft_form = params[:form]
    else
      render action: 'show'
    end
  end

  # PATCH/PUT /drafts/1
  # PATCH/PUT /drafts/1.json
  def update
    @draft = Draft.find(params[:id])
    if @draft.update_draft(params[:draft])
      case params[:commit]
      when "Save & Done"
        redirect_to @draft, notice: 'Draft was successfully updated.'
      when "Save & Next"
        # Determine next form to go to
        next_form_name = Draft.get_next_form(params["next_section"])
        redirect_to draft_edit_form_path(@draft, next_form_name)
      else # Jump directly to a form
        next_form_name = params["new_form_name"]
        redirect_to draft_edit_form_path(@draft, next_form_name)
      end
    else # record update failed
      # render 'edit' # this should get @draft_form
      # Remove
      redirect_to @draft
    end
  end

  # DELETE /drafts/1
  # DELETE /drafts/1.json
  def destroy
    @draft.destroy
    respond_to do |format|
      format.html { redirect_to dashboard_url} # Retain this for later use?, notice: "Draft \"#{@draft.entry_id}\"was successfully deleted." }
    end
  end

  def open_drafts
    @drafts = @current_user.drafts.order("updated_at DESC")
  end


  private

    # Use callbacks to share common setup or constraints between actions.
    def set_draft
      id = params[:draft_id] || params[:id]
      @draft = Draft.find(id)
      @draft_forms = Draft::DRAFT_FORMS
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def draft_params
      params.require(:draft).permit(:user_id, :draft, :title)
    end

    def load_umm_schema
      @json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'umm-c-json-schema.json')))
      # puts @json_schema
    end
end
