class CollectionTemplate < Template
  class << self
    def create_template(draft, user, name)
      template = CollectionTemplate.new do |temp|
        temp.draft = draft.draft
        temp.entry_title = draft.entry_title
        temp.user = user
        temp.title = name
        temp.provider_id = user.provider_id
      end
      template.save
      template
    end
  end
end
