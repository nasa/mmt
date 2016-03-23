module Helpers
  module GroupHelpers

    # def create_system_group(num = 1)
    #   (1..num).each do |n|
    #     sys_group_name = "System Group #{n}"
    #     sys_group_desc = "System Group #{n} description"
    #     sys_group = { name: sys_group_name, description: sys_group_desc }
    #
    #     sys_group_response = cmr_client.create_group(sys_group.to_json, token)
    #     if sys_group_response.success?
    #       puts 'group created'
    #     else
    #       puts 'group error'
    #     end
    #   end
    # end

    # def load_system_groups
    #   Rake.application.rake_require 'tasks/local_cmr'
    #   Rake::Task.define_task(:environment)
    #   Rake::Task['cmr:load_system_groups'].reenable
    #   Rake.application.invoke_task 'cmr:load_system_groups'
    # end
  end
end
