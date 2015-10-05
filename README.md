Mesosphere Community Docs Site
==============================

This repository contains the Markdown files that comprise the [Mesosphere open documentation site](http://open.mesosphere.com).

# Contributing!

Community contributions to the open docs are heartily welcomed.  There are two ways to help out.

## 1) Create an issue

If you find an error in our docs site and would like the Mesosphere docs team to take a look, please create a new issue in this GitHub project. Be sure to include a link to the page in question and if possible, a suggested fix.

## 2) Submit a pull request

To add or change a page to the open documentation site:

1. Fork this repository
2. Commit the necessary changes to your forked repository
3. Submit [a pull request](https://help.github.com/articles/using-pull-requests/) including your changes

We prefer pull requests to be as few commits as possible and that the request itself (title and/or description as necessary) are sufficiently descriptive. The Mesosphere docs team will review and merge your pull request!

**When showing commands to run, never make a reader download anything from http without verifying checksums.**


## 3) View on staging environment

After a few minutes, an automated build will deploy changes to master to [the staging site](http://open-staging.mesosphere.com.s3-website-us-east-1.amazonaws.com/).

Periodically these changes will be pushed to the production site.

# Running this site locally

If you are developing against this site and wish to see a rendered version of your documentation locally.

1. Install [RubyGems](https://rubygems.org/pages/download)
2. Install Bundler

        sudo gem install bundler
3. Add the default gems from the root of the project (you may need libxml2 - see [here](http://nokogiri.org/tutorials/installing_nokogiri.html) for instructions)

        bundle install --path vendor/bundle
4. Run Jekyll from the root of the project

        # Run Jekyll and watch for changes
        bundle exec rake dev
5. View the site in your browser: [http://localhost:4000](http://localhost:4000)
