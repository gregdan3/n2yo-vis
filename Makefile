PWD=$(shell pwd)

build:
	docker build -t n2yovis .

run:
	docker run \
		-d \
		-p 80:80 \
		-p 443:443 \
		-v $(PWD)/app:/usr/local/apache2/htdocs \
		--name n2yovis \
		n2yovis
	# NOTE: docker ps to see container

stop:
	docker stop n2yovis

remove:
	docker rm n2yovis

clean: stop remove

reset: stop remove build run
