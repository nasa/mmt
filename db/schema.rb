# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_10_13_183338) do

  create_table "draft_proposals", force: :cascade do |t|
    t.integer "user_id"
    t.text "draft"
    t.string "short_name"
    t.string "entry_title"
    t.string "provider_id"
    t.string "native_id"
    t.string "draft_type"
    t.string "proposal_status", null: false
    t.text "approver_feedback"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "status_history"
    t.string "request_type", null: false
    t.string "submitter_id"
  end

  create_table "drafts", force: :cascade do |t|
    t.integer "user_id"
    t.text "draft"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "short_name"
    t.string "entry_title"
    t.string "provider_id"
    t.string "native_id"
    t.string "draft_type"
    t.string "collection_concept_id"
  end

  create_table "keyword_recommendations", force: :cascade do |t|
    t.string "recommendable_type"
    t.integer "recommendable_id"
    t.boolean "recommendation_provided", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "recommendation_request_id"
    t.text "recommended_keywords"
    t.index ["recommendable_type", "recommendable_id"], name: "keyword_recommendable_index"
  end

  create_table "proposal_keyword_recommendations", force: :cascade do |t|
    t.integer "draft_proposal_id"
    t.boolean "recommendation_provided", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "recommendation_request_id"
    t.text "recommended_keywords"
    t.index ["draft_proposal_id"], name: "index_proposal_keyword_recommendations_on_draft_proposal_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "templates", force: :cascade do |t|
    t.integer "user_id"
    t.text "draft"
    t.string "entry_title"
    t.string "provider_id"
    t.string "draft_type"
    t.string "template_name"
    t.string "short_name"
    t.string "native_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider_id", "template_name"], name: "index_templates_on_provider_id_and_template_name", unique: true
  end

  create_table "user_invites", force: :cascade do |t|
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "urs_uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "echo_id"
    t.string "provider_id"
    t.text "available_providers"
  end

end
