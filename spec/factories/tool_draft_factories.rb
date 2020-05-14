FactoryBot.define do
  factory :empty_tool_draft, class: ToolDraft do
    provider_id { 'MMT_2' }
    draft_type { 'ToolDraft' }

    draft { {} }

    short_name { nil }
    entry_title { nil }
  end
end
