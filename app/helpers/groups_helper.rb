# :nodoc:
module GroupsHelper
  def check_if_system_group?(group, concept_id)
    group['provider_id'].nil? && concept_id =~ /(CMR)$/ ? true : false
  end

  def group_provider(group)
    check_if_system_group?(group, group['concept_id']) ? 'CMR' : group['provider_id']
  end
end
