#!/bin/bash

# NOTE: DEFINE EC2_FOLDER_NAME (required) and PM2_CLEANUP_NAMES (optional)
# Should be excuted from the root folder of the project. Use npm run

aws_scripts_foldername="scripts"
before_install_filename="before_install.sh"
after_install_filename="after_install.sh"
application_start_filename="application_start.sh"

# Shell script templates path
templates_path="scripts_generators/aws_templates"

if [ -z "$EC2_FOLDER_NAME" ]; then
  echo "EC2_FOLDER_NAME is not set"
  exit 1
fi

before_install_filepath="${aws_scripts_foldername}/${before_install_filename}"
after_install_filepath="${aws_scripts_foldername}/${after_install_filename}"
application_start_filepath="${aws_scripts_foldername}/${application_start_filename}"

# ##########################
# # APPSPEC YML  FILE
# ##########################

echo "version: 0.0
os: linux
files:
  - source: /
    destination: /home/ec2-user/${EC2_FOLDER_NAME}
hooks:
  BeforeInstall:
    - location: ${before_install_filepath}
      timeout: 300
      runas: ec2-user
  AfterInstall:
    - location: ${after_install_filepath}
      timeout: 600
      runas: ec2-user
  ApplicationStart:
    - location: ${application_start_filepath}
      timeout: 300
      runas: ec2-user" >appspec.yml

##########################
#
# Create scripts folder
# if it does not exist
#
##########################
mkdir -p ${aws_scripts_foldername}

# HELPER METHOD TO READ FILE AND REPLACE VARIABLES
function read_and_replace_vars() {
  echo "$(cat $1)" |
    sed -e "s/__EC2_FOLDER_NAME__/$EC2_FOLDER_NAME/g" |
    sed -e "s/__PM2_CLEANUP_NAMES__/$PM2_CLEANUP_NAMES/g"
}

# ##########################
# # BEFORE INSTALL SCRIPT
# ##########################
read_and_replace_vars "${templates_path}/before_install.sh.template" \
  >"${before_install_filepath}"

# ##########################
# # AFTER INSTALL SCRIPT
# ##########################
read_and_replace_vars "${templates_path}/after_install.sh.template" \
  >"${after_install_filepath}"

# ##########################
# # APPLICATION START SCRIPT
# ##########################
read_and_replace_vars "${templates_path}/application_start.sh.template" \
  >"${application_start_filepath}"
