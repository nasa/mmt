# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2023_08_27_015034) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "draft_proposals", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.text "draft"
    t.string "short_name"
    t.string "entry_title"
    t.string "provider_id"
    t.string "native_id"
    t.string "draft_type"
    t.string "proposal_status", null: false
    t.text "approver_feedback"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "status_history"
    t.string "request_type", null: false
    t.string "submitter_id"
  end

  create_table "drafts", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.text "draft"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "short_name"
    t.string "entry_title"
    t.string "provider_id"
    t.string "native_id"
    t.string "draft_type"
    t.string "collection_concept_id"
  end

  create_table "keyword_recommendations", force: :cascade do |t|
    t.string "recommendable_type"
    t.bigint "recommendable_id"
    t.boolean "recommendation_provided", default: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "recommendation_request_id"
    t.text "recommended_keywords"
    t.index ["recommendable_type", "recommendable_id"], name: "keyword_recommendable_index"
  end

  create_table "proposal_keyword_recommendations", force: :cascade do |t|
    t.bigint "draft_proposal_id"
    t.boolean "recommendation_provided", default: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "recommendation_request_id"
    t.text "recommended_keywords"
    t.index ["draft_proposal_id"], name: "index_proposal_keyword_recommendations_on_draft_proposal_id"
  end

  create_table "sessions", id: :serial, force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "templates", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.text "draft"
    t.string "entry_title"
    t.string "provider_id"
    t.string "draft_type"
    t.string "template_name"
    t.string "short_name"
    t.string "native_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["provider_id", "template_name"], name: "index_templates_on_provider_id_and_template_name", unique: true
  end

  create_table "user_invites", id: :serial, force: :cascade do |t|
    t.string "manager_name"
    t.string "manager_email"
    t.string "user_first_name"
    t.string "user_last_name"
    t.string "user_email"
    t.string "group_id"
    t.string "group_name"
    t.string "provider"
    t.string "token"
    t.boolean "active", default: true
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "urs_uid"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "echo_id"
    t.string "provider_id"
    t.text "available_providers"
  end
end
