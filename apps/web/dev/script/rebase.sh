#!/bin/bash

echo Enter branch name:
read branch
echo Start fetching remote
git fetch
git checkout development
echo Pulling development branch
git pull origin development
echo Rebasing requested branch onto development, check for error!
git checkout $branch
git rebase development