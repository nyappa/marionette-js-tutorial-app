#!/bin/sh
bundle exec rerun --dir ./ "rackup -p 3002 -o 0.0.0.0"
#rerun --dir ./ "rackup -p 3002"
