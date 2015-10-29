
STAGING = s3://open-staging.mesosphere.com/
PROD = s3://open.mesosphere.com/
PUBLIC_DIR= _build/

DOCKER_IMAGE=thomasr/build-jekyll
DOCKER_TAG=0.5

docker: docker.build docker.push

docker.build:
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

docker.push:
	docker push $(DOCKER_IMAGE):$(DOCKER_TAG)

site.build:
	docker run --rm=true -e "BRANCH=$(BRANCH)" -v $(CHECKOUT):/website \
		$(DOCKER_IMAGE):$(DOCKER_TAG) build

deploy_bucket=$(STAGING)
ifeq ($(BRANCH),prod)
	deploy_bucket=$(PROD)
endif

publish.assets:
	aws s3 sync \
		--region us-east-1 \
		--acl public-read \
		--cache-control "public,max-age=600" \
		--content-type "text/html; charset=utf-8" \
		--exclude "*" \
		--include "*.html" \
		--delete \
		$(PUBLIC_DIR) $(deploy_bucket)

	aws s3 sync \
		--region us-east-1 \
		--acl public-read \
		--cache-control "public,max-age=600" \
		--exclude "*" \
		--include "*.xml" \
		$(PUBLIC_DIR) $(deploy_bucket)

	aws s3 sync \
		--region us-east-1 \
		--acl public-read \
		--cache-control "public,max-age=31536000" \
		--exclude "*.html" \
		--exclude "*.xml" \
		$(PUBLIC_DIR) $(deploy_bucket)

build_config=-c _config.yml
ifeq ($(BRANCH),prod)
else
	build_config := $(build_config),_config.staging.yml
endif

build:
	bundle install
	LANG="en_US.UTF-8" LC_ALL="en_US.UTF-8" bundle exec jekyll build -d _build $(build_config)
