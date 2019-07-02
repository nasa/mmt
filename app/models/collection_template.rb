class CollectionTemplate < Template
  class << self
    def create_template(draft, user, name)
      template = CollectionTemplate.new do |temp|
        temp.draft = draft.draft
        temp.user = user
        temp.entry_title = draft.entry_title
        temp.template_name = name
        temp.provider_id = user.provider_id
      end
      template.save
      template
    end
  end
end
