#!/bin/sh
bundle exec unicorn -E production -c unicorn.rb $1
