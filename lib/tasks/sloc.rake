# expose the commands used to calculate the Lines of Code. We are using Rake for
# this to allow bamboo or other such systems to call one common action across
# applications and get the similar responses
# 
# Usage:
# rake sloc:cloc - run the cloc command report
# rake sloc:sloc - run the sloc
# rake sloc:report - expose to scripts which method should be run for MMT
# 
# @author thomas.a.cherry

namespace :sloc do
  desc 'use the cloc command to analyze the code, warn if not installed'
  task :cloc do
    cloc=`which cloc`
    if cloc.empty?
      puts 'run brew cloc before using this feature'
    else
      # exclude Markdown, Dockerfiles and Shell scripts because they are not 
      # contributing maintance of code and not code itself
      # exclude directories which do not have application code. Test code is not
      # considered application code. Reports and documentation also do not meet
      # the threshhold.
   	  shell_cmd = 'cloc ' \
        '--exclude-lang=Markdown,Dockerfile,"Bourne Shell" ' \
        '--exclude-dir=cmr,coverage,doc,log,spec,stubs,test_cmr,tmp,vendor ' \
        '.'
      puts %x( #{shell_cmd} )
    end
  end

  desc 'use the sloccount command to analyze the code, warn if not installed'
  task :sloc do
    cloc=`which sloccount`
    if cloc.empty?
      puts 'run brew sloccount before using this feature'
    else
   	  shell_cmd = 'sloccount .'
      puts %x( #{shell_cmd} )
    end
  end
  
  desc 'PUBLIC: run the prefered calculation that external processes are to use'
  task :report => [:cloc]

end
