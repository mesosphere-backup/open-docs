# [DEPRECATED] 
**This is currently used only for publishing [Mesos deb/rpm binaries](open.mesosphere.com/downloads/mesos) and is owned by the Mesos Core Team.**

Build is here: https://jenkins.mesosphere.com/service/jenkins/job/open-docs/

**THE REST OF THE CONTENT IS DEPRECATED. FOR THE LATEST INFORMATION, SEE <a href="dcos.io">dcos.io</a>.**

This repository contains the Markdown files that comprise the [Mesosphere open documentation site](http://open.mesosphere.com).

## View on staging environment

After a few minutes, an automated build will deploy changes to master to [the staging site](http://open-staging.mesosphere.com.s3-website-us-east-1.amazonaws.com/).

Periodically these changes will be pushed to the production site.

## Running this site locally

If you are developing against this site and wish to see a rendered version of your documentation locally.

1. Install [RubyGems](https://rubygems.org/pages/download)
2. Install Bundler

        sudo gem install bundler
3. Update bundler

		bundle update
4. Add the default gems from the root of the project (you may need libxml2 - see [here](http://nokogiri.org/tutorials/installing_nokogiri.html) for instructions)

        bundle install --path vendor/bundle
5. Run Jekyll from the root of the project

        # Run Jekyll and watch for changes
        bundle exec rake dev
6. View the site in your browser: [http://localhost:4000](http://localhost:4000)
