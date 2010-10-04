test-all:
	@@find test -name '*.js' -print0 | xargs -0 env NODE_PATH=./src node

link:
	ln -s `pwd`/src ~/.node_libraries/reut

.PHONY: test-all link
