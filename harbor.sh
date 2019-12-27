#/bin/bash

# work flow is:
#   build -> run -> stop

PORT_DEFAULT=3000
port_inside=${PORT_DEFAULT}
port_outside=${PORT_DEFAULT}
img_name=mmt

function help
{
  printf "run Docker\n\n"
  
  layout="%4s %-7s %-15s %-20s\n"
  printf "${layout}" flag option name note
  printf "${layout}" ---- ------ ------------- ----
  #printf "${layout}" -1   "" "Preset 1" "run build, list_builds, run"
  printf "${layout}" -b   "" "Build" "Step 1 - Build a new image, deleting the older one"
  printf "${layout}" -r   "" "run" "Step 2 - run ${img_name}"
  printf "${layout}" -c   "" "connect" "Step 3 - connect to ${img_name}"
  printf "\n"
  printf "${layout}" -B   "" "list builds from step 1" ""
  printf "${layout}" -C   "" "list containers from step 3" ""
  printf "${layout}" -d   "" "delete" ""
  printf "${layout}" -p   "number" "Inside Port" "${port_inside}"
  printf "${layout}" -P   "number" "Outside Port" "${port_outside}"
  printf "${layout}" -R   "" "step 2, but run interactivly"
  printf "${layout}" -h   "" "this" ""
}

# Step 1 ; -b ; build an image from a Dockerfile
function build
{
  #docker rmi --force mmt:latest
  docker build . --tag mmt --rm
}

# -B ; list build image
function list_builds
{
  docker image ls mmt:latest
}

# step 2 ; -r ; run the container, starting rails
function run
{
  docker run \
    --tty \
    --publish ${port_inside}:${port_outside} \
    --volume $(pwd):/build \
    --detach ${img_name}
  printf "Commands: docker container [create start run ls stop kill rm]\n"
  printf "Do not forget to run these commands:\n"
  printf ">bundle install\n"
  printf "./bin/rails s --bind 0.0.0.0\n"
}

# step 2 ; -r ; run the container, starting rails
function run_interactive
{
  docker run \
    --tty \
    --publish ${port_inside}:${port_outside} \
    --volume $(pwd):/build \
    ${img_name} /usr/bin/bash
    #tail -n 24 -f log/development.log
    #"echo bundle install ; ./bin/rails s --bind 0.0.0.0; /bin/bash"
}

# -C ; list containers
function list_containers
{
  docker container ls
}

# step 3 ; -c ; connect to a running container
function connect
{
  id="$(docker container ls | grep mmt | head -n 1 | cut -f 1 -d ' ')"
  if [ -z "${id}" ] ; then
    echo container not found
    bash ./harbor.sh -C
  else
    docker exec \
      --interactive \
      --tty \
      "${id}" \
      /bin/bash
    fi
}

# remove
function delete
{
  #doocker rm 
  #docker images ls
  #docker images --filter dangling=true -q 2
  docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
}

while getopts "1bBcCdp:P:rR" opt; do
  case ${opt} in
    1) build ; run ; connect ;;
    b) build ;;
    B) list_builds ;;
    c) connect ;;
    C) list_containers ;; 
    d) delete ;;
    p) port_inside=${OPTARG} ;;
    P) port_outside=${OPTARG} ;;
    r) run ;;
    R) run_interactive ;;
    h) help ; exit ;;
    *) help ; exit ;;
  esac
done
